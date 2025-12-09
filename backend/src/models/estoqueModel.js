const db = require('../config/database');

// --- PEÇAS (CHASSIS) ---
const listarPecas = async () => {
    const { rows } = await db.query("SELECT * FROM estoque_pecas ORDER BY id");
    return rows;
};

const atualizarPeca = async (id, quantidade) => {
    await db.query("UPDATE estoque_pecas SET quantidade = $1 WHERE id = $2", [quantidade, id]);
};

// --- EXPEDIÇÃO (SLOTS) ---
const listarSlots = async () => {
    const query = `
        SELECT s.*, p.orderid_externo, u.nome as nome_usuario
        FROM expedicao_slots s
        LEFT JOIN pedidos p ON s.pedido_id = p.id
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        ORDER BY s.numero_slot ASC
    `;
    const { rows } = await db.query(query);
    return rows;
};

const liberarSlot = async (slot) => {
    await db.query("UPDATE expedicao_slots SET status = 'livre', pedido_id = NULL WHERE numero_slot = $1", [slot]);
};

// --- LOGS ---
const listarLogs = async () => {
    const query = `
        SELECT id, orderid_externo, status, log_producao 
        FROM pedidos 
        WHERE log_producao IS NOT NULL 
        ORDER BY id DESC LIMIT 10
    `;
    const { rows } = await db.query(query);
    return rows;
};

module.exports = {
    listarPecas,
    atualizarPeca,
    listarSlots,
    liberarSlot,
    listarLogs
};