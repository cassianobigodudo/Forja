
const db = require('../config/database');

const criarUsuario = async (nome, email, senha) => {
    const result = await db.query(
        `INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario)
         VALUES ($1, $2, $3)
         RETURNING id_usuario, nome_usuario, email_usuario`,
        [nome, email, senha]
    );
    return result.rows[0];
};

const buscarEmail = async (email) => {
    const result = await db.query(
        `SELECT id_usuario, nome_usuario, email_usuario, senha_usuario
        FROM usuarios
        WHERE email_usuario = $1`,
        [email]
    );
    return result.rows[0]
}

// Exportamos a função para que o Controller possa usá-la
module.exports = {
    criarUsuario,
    buscarEmail
};