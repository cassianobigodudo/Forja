const db = require('../config/database');

const criar = async (client, id_usuario, personagem_id, status) => {
    const resPedido = await client.query(
        `INSERT INTO pedidos (id_usuario, personagem_id, status)
         VALUES ($1, $2, $3) RETURNING id`,
        [id_usuario, personagem_id, status]
    );
    return resPedido.rows[0].id;
};

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
             slot_expedicao = $4 -- Corrigido para nome da coluna no banco
         WHERE orderId_externo = $1 
         RETURNING *`,
        [orderIdExterno, novoStatus, producaoIdExterno, slot] 
    );
    return result.rows[0];
};

const atualizarStatusElog = async (orderIdExterno, novoStatus, logEntry, slot) => {
    const query = `
        UPDATE pedidos 
        SET 
            status = $2,
            slot_expedicao = COALESCE($4, slot_expedicao),
            log_producao = log_producao || $3::jsonb
        WHERE orderid_externo = $1
        RETURNING *
    `;
    const values = [orderIdExterno, novoStatus, JSON.stringify([logEntry]), slot];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const buscarPorUsuario = async (id_usuario) => {
    const { rows } = await db.query(
        `SELECT 
            p.id as pedido_id, 
            p.status, 
            p.orderid_externo, 
            p.producao_id_externo,
            p.slot_expedicao as slot,
            p.data_pedido,
            pers.nome as nome_personagem,
            pers.genero,
            pers.img,
            pers.valor
         FROM pedidos p
         JOIN personagens pers ON p.personagem_id = pers.id
         WHERE p.id_usuario = $1
         ORDER BY p.id DESC;`,
        [id_usuario]
    );
    return rows;
};

module.exports = {
    criar,
    atualizarStatus,
    atualizarStatusPorCallback,
    atualizarStatusElog,
    buscarPorUsuario
};