//db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'forja', 
    password: 'jaime@db',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};