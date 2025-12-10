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

const atualizar = async (id_endereco, dados) => {
    const { cep, rua, numero, bairro, cidade, uf, complemento } = dados;
    
    const query = `
        UPDATE enderecos 
        SET cep=$1, rua=$2, numero=$3, bairro=$4, cidade=$5, estado=$6, complemento=$7
        WHERE id_endereco = $8
        RETURNING *
    `;
    const values = [cep, rua, numero, bairro, cidade, uf, complemento, id_endereco];
    const { rows } = await db.query(query, values);
    return rows[0];
};

// REMOVER
const remover = async (id_endereco) => {
    // Retorna rowCount para sabermos se deletou mesmo
    const result = await db.query("DELETE FROM enderecos WHERE id_endereco = $1", [id_endereco]);
    return result;
};

module.exports = {
    criar,
    listarPorUsuario,
    atualizar, // <--- Exportar
    remover    // <--- Exportar
};