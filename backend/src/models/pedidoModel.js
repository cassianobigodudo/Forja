// backend/src/models/pedidoModel.js
const db = require('../config/database');

// Cria um novo registro de pedido dentro de uma transação
const criar = async (client, session_id, personagem_id, status) => {
    const resPedido = await client.query(
        `INSERT INTO pedidos (session_id, personagem_id, status)
         VALUES ($1, $2, $3) RETURNING id`,
        [session_id, personagem_id, status]
    );
    return resPedido.rows[0].id;
};

// Atualiza um pedido existente, também dentro de uma transação
const atualizarStatus = async (client, pedidoId, status, orderIdExterno) => {
    return client.query(
        "UPDATE pedidos SET status = $2, orderId_externo = $3 WHERE id = $1",
        [pedidoId, status, orderIdExterno]
    );
};

const atualizarStatusPorCallback = async (orderIdExterno, novoStatus, producaoIdExterno) => {
    const result = await db.query(
        `UPDATE pedidos 
         SET status = $2, producao_id_externo = $3 
         WHERE orderId_externo = $1 RETURNING *`,
        [orderIdExterno, novoStatus, producaoIdExterno]
    );
    return result.rows[0];
};

const buscarPorSessao = async (session_id) => {
    const { rows } = await db.query(
        `SELECT 
            p.id as pedido_id, 
            p.status, 
            p.orderid_externo, 
            p.producao_id_externo,
            pers.genero,
            pers.corPele,
            pers.img
         FROM pedidos p
         JOIN personagens pers ON p.personagem_id = pers.id
         WHERE p.session_id = $1
         ORDER BY p.id DESC; -- Alterado para ordenar pelo ID
        `,
        [session_id]
    );
    return rows;
};

// Adicione a nova função ao module.exports
module.exports = {
    criar,
    atualizarStatus,
    atualizarStatusPorCallback,
    buscarPorSessao, // <-- ADICIONE AQUI
};