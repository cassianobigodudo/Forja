
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

const salvarCartao = async (id_usuario, numero, nome, validade, cvv) => {
    const query = `
        INSERT INTO cartoes_credito (id_usuario, numero_cartao, nome_titular, validade, cvv)
        VALUES ($1, $2, $3, $4, $5)
    `;
    return db.query(query, [id_usuario, numero, nome, validade, cvv]);
};

const removerUsuario = async (id_usuario) => {
    const query = `DELETE FROM usuarios WHERE id_usuario = $1`;
    console.log(`🔌 [SQL EXEC] Executando: ${query} com ID [${id_usuario}]`);
    
    // O retorno do db.query contém 'rowCount', que diz quantas linhas foram apagadas
    return db.query(query, [id_usuario]); 
}
// Exportamos a função para que o Controller possa usá-la
module.exports = {
    criarUsuario,
    buscarEmail,
    salvarCartao,
    removerUsuario
};