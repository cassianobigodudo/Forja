const db = require('../config/database');

const criar = async (personagemData) => {
    const { usuario_id, genero, generoNum, corPele, corPeleNum, img } = personagemData;
    const result = await db.query(
        `INSERT INTO personagens (usuario_id, genero, generoNum, corPele, corPeleNum, img)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [usuario_id, genero, generoNum, corPele, corPeleNum, img]
    );
    return result.rows[0];
};

module.exports = {
    criar,
};