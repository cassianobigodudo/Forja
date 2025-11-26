const { Pool } = require('pg');
require('dotenv').config();

// Se a variável de ambiente DATABASE_URL existir (na Vercel), use-a.
// Senão (local), use as variáveis locais.
const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = isProduction
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };

const pool = new Pool(connectionConfig);

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool,
};