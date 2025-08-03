const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const {
    checkSlugAvailability,
    ensureUniqueSlug,
} = require('../utils/slugUtils');

const router = express.Router();

const validateWorkspace = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Workspace name is required (max 255 chars)'),
    body('slug')
        .optional()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Slug must be 1-255 characters'),
];

router.get('/check-slug', async (req, res, next) => {
    try {
        const { slug } = req.query;

        if (!slug) {
            return res.status(400).json({
                error: 'Missing parameter',
                message: 'Slug parameter is required',
            });
        }

        const availability = await checkSlugAvailability(slug);
        res.json(availability);
    } catch (error) {
        next(error);
    }
});

router.post(
    '/',
    authenticateToken,
    validateWorkspace,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'Invalid input data',
                    details: errors.array(),
                });
            }

            const { name, slug } = req.body;
            const userId = req.user.id;

            const finalSlug = await ensureUniqueSlug(slug || name);

            const [result] = await pool.execute(
                'INSERT INTO workspaces (userId, name, slug) VALUES (?, ?, ?)',
                [userId, name, finalSlug]
            );

            res.status(201).json({
                message: 'Workspace created successfully',
                workspace: {
                    id: result.insertId,
                    name,
                    slug: finalSlug,
                    userId,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [workspaces] = await pool.execute(
            'SELECT id, name, slug, created_at FROM workspaces WHERE userId = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json({
            workspaces,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [workspaces] = await pool.execute(
            'SELECT id, name, slug, created_at FROM workspaces WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (workspaces.length === 0) {
            return res.status(404).json({
                error: 'Workspace not found',
                message: 'Workspace does not exist or you do not have access',
            });
        }

        res.json({
            workspace: workspaces[0],
        });
    } catch (error) {
        next(error);
    }
});

router.put(
    '/:id',
    authenticateToken,
    validateWorkspace,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'Invalid input data',
                    details: errors.array(),
                });
            }

            const { id } = req.params;
            const { name, slug } = req.body;
            const userId = req.user.id;

            const [existing] = await pool.execute(
                'SELECT id FROM workspaces WHERE id = ? AND userId = ?',
                [id, userId]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    error: 'Workspace not found',
                    message:
                        'Workspace does not exist or you do not have access',
                });
            }

            let finalSlug = slug;
            if (slug) {
                finalSlug = await ensureUniqueSlug(slug);
            }

            await pool.execute(
                'UPDATE workspaces SET name = ?, slug = ? WHERE id = ? AND userId = ?',
                [name, finalSlug, id, userId]
            );

            res.json({
                message: 'Workspace updated successfully',
                workspace: {
                    id: parseInt(id),
                    name,
                    slug: finalSlug,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [existing] = await pool.execute(
            'SELECT id FROM workspaces WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Workspace not found',
                message: 'Workspace does not exist or you do not have access',
            });
        }

        await pool.execute(
            'DELETE FROM workspaces WHERE id = ? AND userId = ?',
            [id, userId]
        );

        res.json({
            message: 'Workspace deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
