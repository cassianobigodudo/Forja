const db = require('../config/database');

const criar = async (client, id_usuario, personagem_id, status) => {
    const resPedido = await client.query(
        `INSERT INTO pedidos (id_usuario, personagem_id, status)
         VALUES ($1, $2, $3) RETURNING id`,
        [id_usuario, personagem_id, status]
    );
    return resPedido.rows[0].id;
};

const atualizarStatus = async (client, pedidoId, status, orderIdExterno, producaoIdExterno) => {
    const query = `
        UPDATE pedidos 
        SET 
            status = $2, 
            orderid_externo = $3,
            producao_id_externo = $4
        WHERE id = $1
    `;

    const values = [pedidoId, status, orderIdExterno, producaoIdExterno];

    return client.query(query, values);
};

// Removido argumento 'slot' e a coluna 'slot_expedicao' da query
const atualizarStatusPorCallback = async (orderIdExterno, novoStatus, producaoIdExterno) => {
    const result = await db.query(
        `UPDATE pedidos 
         SET status = $2, 
             producao_id_externo = $3
         WHERE orderId_externo = $1 
         RETURNING *`,
        [orderIdExterno, novoStatus, producaoIdExterno] 
    );
    return result.rows[0];
};

// Removido argumento 'slot' e a coluna 'slot_expedicao' da query
const atualizarStatusElog = async (orderIdExterno, novoStatus, logEntry) => {
    const query = `
        UPDATE pedidos 
        SET 
            status = $2,
            log_producao = log_producao || $3::jsonb
        WHERE orderid_externo = $1
        RETURNING *
    `;
    const values = [orderIdExterno, novoStatus, JSON.stringify([logEntry])];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const buscarPorUsuario = async (id_usuario) => {
    console.log(`   🛠️ [DB] Buscando pedidos...`);

    // ADICIONEI O JOIN COM expedicao_slots
    const query = `
        SELECT 
            p.id as pedido_id, 
            p.status, 
            p.orderid_externo, 
            p.producao_id_externo,
            p.data_pedido,
            pers.nome as nome_personagem,
            pers.img,
            s.numero_slot as slot -- <--- RECUPERAMOS O SLOT AQUI
         FROM pedidos p
         LEFT JOIN personagens pers ON p.personagem_id = pers.id
         LEFT JOIN expedicao_slots s ON p.id = s.pedido_id -- JOIN PARA LER O SLOT
         WHERE CAST(p.id_usuario AS VARCHAR) = $1
         ORDER BY p.id DESC;
    `;
    
    const { rows } = await db.query(query, [String(id_usuario)]);
    return rows;
};

const buscarIdPorExterno = async (orderIdExterno) => {
    const { rows } = await db.query(
        `SELECT id FROM pedidos WHERE orderid_externo = $1`,
        [orderIdExterno]
    );
    return rows[0]?.id;
};

const marcarComoPronto = async (pedidoId) => {
    const query = `UPDATE pedidos SET status = 'PRONTO' WHERE id = $1`;
    await db.query(query, [pedidoId]);
};

module.exports = {
    criar,
    atualizarStatus,
    atualizarStatusPorCallback,
    atualizarStatusElog,
    buscarPorUsuario,
    buscarIdPorExterno,
    marcarComoPronto
};