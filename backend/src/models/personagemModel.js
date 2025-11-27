const db = require('../config/database');

const criar = async (personagemData) => {
    const { id_usuario, genero, generoNum, corPele, corPeleNum, img } = personagemData;
    const result = await db.query(
        `INSERT INTO personagens (id_usuario, genero, generoNum, corPele, corPeleNum, img)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [id_usuario, genero, generoNum, corPele, corPeleNum, img]
    );
    return result.rows[0];
};

//id_usuario = 5 é o ADMIN
const buscar = async () => {
    const result = await db.query(`SELECT * FROM personagens WHERE id_usuario = 5;`);
    return result.rows;
}

module.exports = {
    criar,
    buscar
};