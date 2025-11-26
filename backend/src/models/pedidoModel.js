// backend/src/models/pedidoModel.js
const db = require('../config/database');

// Cria um novo registro de pedido dentro de uma transação
const criar = async (client, usuario_id, personagem_id, status) => {
    const resPedido = await client.query(
        `INSERT INTO pedidos (usuario_id, personagem_id, status)
         VALUES ($1, $2, $3) RETURNING id`,
        [usuario_id, personagem_id, status]
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

const atualizarStatusPorCallback = async (orderIdExterno, novoStatus, producaoIdExterno, slot) => {
    const result = await db.query(
        `UPDATE pedidos 
         SET status = $2, 
             producao_id_externo = $3, 
             slot = $4                  -- <-- Nova linha
         WHERE orderId_externo = $1 
         RETURNING *`,
        [orderIdExterno, novoStatus, producaoIdExterno, slot] 
    );
    return result.rows[0];
};

const buscarPorUsuario = async (usuario_id) => {
    const { rows } = await db.query(
        `SELECT 
            p.id as pedido_id, 
            p.status, 
            p.orderid_externo, 
            p.producao_id_externo,
            p.slot,
            pers.genero,
            pers.corPele,
            pers.img,
            pers.historia
         FROM pedidos p
         JOIN personagens pers ON p.personagem_id = pers.id
         WHERE p.usuario_id = $1
         ORDER BY p.id DESC;
        `,
        [usuario_id]
    );
    return rows;
};

module.exports = {
    criar,
    atualizarStatus,
    atualizarStatusPorCallback,
    buscarPorUsuario, // Exporte a nova função
};