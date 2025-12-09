const db = require('../config/database');

// --- PEÇAS (CHASSIS) ---
const listarPecas = async () => {
    // ADICIONEI "ORDER BY id ASC" PARA GARANTIR A ORDEM 1, 2, 3
    const { rows } = await db.query("SELECT * FROM estoque_pecas ORDER BY id ASC");
    return rows;
};

const atualizarPeca = async (id, quantidade) => {
    await db.query("UPDATE estoque_pecas SET quantidade = $1 WHERE id = $2", [quantidade, id]);
};

// --- EXPEDIÇÃO (SLOTS) ---
const listarSlots = async () => {
    /* CORREÇÃO AQUI:
       - Tabela: usuarios (u)
       - Coluna Nome: u.nome_usuario (antes estava u.nome)
       - Join: p.id_usuario = u.id_usuario (PK correta)
    */
    const query = `
        SELECT 
            s.numero_slot,
            s.status,
            s.pedido_id,
            p.orderid_externo,
            u.nome_usuario as nome_usuario  -- <--- CORRIGIDO AQUI
        FROM expedicao_slots s
        LEFT JOIN pedidos p ON s.pedido_id = p.id
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        ORDER BY s.numero_slot ASC
    `;
    
    try {
        const { rows } = await db.query(query);
        return rows;
    } catch (error) {
        console.error("Erro SQL listarSlots:", error.message);
        throw error;
    }
};

// --- NOVO: RECUPERAR PEÇAS ANTES DE LIBERAR ---
const getPecasDoPedidoNoSlot = async (slot) => {
    // Faz um Join triplo: Slot -> Pedido -> Personagem
    // Para descobrir as cores (IDs) usadas naquele boneco específico
    const query = `
        SELECT 
            pers.generonum as cor_cabeca,       -- ID da cor da cabeça
            pers.acesspescoconum as cor_torso,  -- ID da cor do corpo
            pers.basemininum as cor_base        -- ID da cor da base
        FROM expedicao_slots s
        JOIN pedidos p ON s.pedido_id = p.id
        JOIN personagens pers ON p.personagem_id = pers.id
        WHERE s.numero_slot = $1 AND s.status = 'ocupado'
    `;
    const { rows } = await db.query(query, [slot]);
    return rows[0]; // Retorna objeto { cor_cabeca: 1, cor_torso: 2, ... }
};

// --- NOVO: DEVOLVER AO ESTOQUE ---
const devolverItens = async (mapaDeCores) => {
    // mapaDeCores ex: { '1': 2, '3': 1 } (ID da Cor : Quantidade a devolver)
    for (const [idCor, qtd] of Object.entries(mapaDeCores)) {
        await db.query(
            "UPDATE estoque_pecas SET quantidade = quantidade + $1 WHERE id = $2",
            [qtd, idCor]
        );
    }
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

const consumirItens = async (client, demandas) => {
    // demandas é { '1': 2, '3': 1 }
    for (const [corId, qtd] of Object.entries(demandas)) {
        // Usa 'client.query' para manter na transação do pedido
        await client.query(
            "UPDATE estoque_pecas SET quantidade = quantidade - $1 WHERE id = $2",
            [qtd, corId]
        );
    }
};

module.exports = {
    listarPecas,
    atualizarPeca,
    listarSlots,
    liberarSlot,
    listarLogs,
    getPecasDoPedidoNoSlot, // <--- NOVO
    devolverItens,
    consumirItens
};