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
    console.log(`   🛠️ [DB] Executando SELECT WHERE p.id_usuario = '${id_usuario}'`);

    // Removida a linha 'p.slot_expedicao as slot'
    const query = `
        SELECT 
            p.id as pedido_id, 
            p.status, 
            p.orderid_externo, 
            p.producao_id_externo,
            p.data_pedido,
            pers.nome as nome_personagem,
            pers.genero,
            pers.img,
            pers.valor
         FROM pedidos p
         LEFT JOIN personagens pers ON p.personagem_id = pers.id
         WHERE CAST(p.id_usuario AS VARCHAR) = $1
         ORDER BY p.id DESC;
    `;
    
    try {
        const { rows } = await db.query(query, [String(id_usuario)]);
        console.log(`   📦 [DB] Query retornou ${rows.length} linhas.`);
        return rows;
    } catch (err) {
        console.error("   ❌ [DB] Erro na Query SQL:", err.message);
        throw err;
    }
};

const buscarIdPorExterno = async (orderIdExterno) => {
    const { rows } = await db.query(
        `SELECT id FROM pedidos WHERE orderid_externo = $1`,
        [orderIdExterno]
    );
    return rows[0]?.id;
};

module.exports = {
    criar,
    atualizarStatus,
    atualizarStatusPorCallback,
    atualizarStatusElog,
    buscarPorUsuario,
    buscarIdPorExterno
};