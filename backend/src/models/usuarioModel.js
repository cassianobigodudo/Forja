
const db = require('../config/database');

const criar = async (apelido, email, senha) => {
    
    const result = await db.query(
        `INSERT INTO usuarios (apelido, email, senha)
         VALUES ($1, $2, $3)
         RETURNING id, apelido, email`, 
        [apelido, email, senha]
    );
    
    return result.rows[0];
};

// Exportamos a função para que o Controller possa usá-la
module.exports = {
    criar,
};