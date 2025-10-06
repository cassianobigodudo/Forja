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

module.exports = {
    criar,
    atualizarStatus,
};