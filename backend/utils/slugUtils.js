const { pool } = require('../config/database');

const normalizeSlug = (input) => {
    return input
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

const checkSlugAvailability = async (slug) => {
    try {
        const normalizedSlug = normalizeSlug(slug);

        const [existing] = await pool.execute(
            'SELECT slug FROM workspaces WHERE slug = ?',
            [normalizedSlug]
        );

        if (existing.length === 0) {
            return {
                available: true,
                suggestion: normalizedSlug,
            };
        }

        const baseSlug = normalizedSlug.replace(/\d+$/, '');
        let counter = 1;
        let suggestedSlug = `${baseSlug}${counter}`;

        while (true) {
            const [check] = await pool.execute(
                'SELECT slug FROM workspaces WHERE slug = ?',
                [suggestedSlug]
            );

            if (check.length === 0) {
                break;
            }

            counter++;
            suggestedSlug = `${baseSlug}${counter}`;
        }

        return {
            available: false,
            suggestion: suggestedSlug,
        };
    } catch (error) {
        console.error('Slug availability check error:', error);
        throw new Error('Failed to check slug availability');
    }
};

const ensureUniqueSlug = async (requestedSlug) => {
    const availability = await checkSlugAvailability(requestedSlug);

    if (availability.available) {
        return availability.suggestion;
    }

    return availability.suggestion;
};

module.exports = {
    normalizeSlug,
    checkSlugAvailability,
    ensureUniqueSlug,
};
