const db = require('../config/database');

const criar = async (dados) => {
    // Desestruturando para garantir a ordem
    const { 
        id_usuario, 
        cep, 
        rua, 
        numero, 
        bairro, 
        cidade, 
        uf, // No front chamamos de UF
        complemento 
    } = dados;

    const query = `
        INSERT INTO enderecos (
            id_usuario, 
            cep, 
            rua, 
            numero, 
            bairro, 
            cidade, 
            estado,   -- No banco chama 'estado'
            complemento
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
    `;

    const values = [
        id_usuario, 
        cep, 
        rua, 
        numero, 
        bairro, 
        cidade, 
        uf, // Passamos o valor de UF para a coluna estado
        complemento
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
};

const listarPorUsuario = async (id_usuario) => {
    const query = `SELECT * FROM enderecos WHERE id_usuario = $1 ORDER BY id_endereco DESC`;
    const { rows } = await db.query(query, [id_usuario]);
    return rows;
};

module.exports = {
    criar,
    listarPorUsuario
};