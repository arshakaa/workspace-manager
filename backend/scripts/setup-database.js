const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
        });

        console.log('✅ Connected to MySQL server');

        const dbName = process.env.DB_NAME || 'workspace_manager';

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✅ Database '${dbName}' created/verified`);

        await connection.query(`USE ${dbName}`);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Users table created/verified');

        await connection.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
        console.log('✅ Workspaces table created/verified');

        const createIndexIfNotExists = async (
            indexName,
            tableName,
            columns
        ) => {
            try {
                await connection.query(
                    `CREATE INDEX ${indexName} ON ${tableName}(${columns})`
                );
                console.log(`✅ Index '${indexName}' created`);
            } catch (error) {
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`ℹ️  Index '${indexName}' already exists`);
                } else {
                    console.error(
                        `❌ Failed to create index '${indexName}':`,
                        error.message
                    );
                }
            }
        };

        await createIndexIfNotExists('idx_users_email', 'users', 'email');
        await createIndexIfNotExists(
            'idx_workspaces_userid',
            'workspaces',
            'userId'
        );
        await createIndexIfNotExists(
            'idx_workspaces_slug',
            'workspaces',
            'slug'
        );
        console.log('✅ Database indexes created/verified');

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\nNext steps:');
        console.log(
            '1. Copy env.example to .env and update your database credentials'
        );
        console.log('2. Run: npm run dev (to start both backend and frontend)');
        console.log('3. Or run: npm run server (backend only)');
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;
