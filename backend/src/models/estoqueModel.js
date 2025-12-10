const db = require('../config/database');

const listarPecas = async () => {
    const { rows } = await db.query("SELECT * FROM estoque_pecas ORDER BY id ASC");
    return rows;
};

const atualizarPeca = async (id, quantidade) => {
    await db.query("UPDATE estoque_pecas SET quantidade = $1 WHERE id = $2", [quantidade, id]);
};

const verificarDisponibilidade = async (demandas) => {
    const erros = [];
    for (const [corId, qtdNecessaria] of Object.entries(demandas)) {
        const { rows } = await db.query("SELECT quantidade, cor_nome FROM estoque_pecas WHERE id = $1", [corId]);
        
        if (rows.length === 0) {
            erros.push(`Cor ID ${corId} não existe.`);
            continue;
        }
        const peca = rows[0];
        if (peca.quantidade < qtdNecessaria) {
            erros.push(`Falta ${peca.cor_nome} (Precisa: ${qtdNecessaria}, Tem: ${peca.quantidade})`);
        }
    }
    return erros;
};

const consumirItens = async (client, demandas) => {
    for (const [corId, qtd] of Object.entries(demandas)) {
        await client.query(
            "UPDATE estoque_pecas SET quantidade = quantidade - $1 WHERE id = $2",
            [qtd, corId]
        );
    }
};

const devolverItens = async (demandas) => {
    for (const [corId, qtd] of Object.entries(demandas)) {
        console.log(`      [SQL] UPDATE estoque_pecas SET qtd = qtd + ${qtd} WHERE id = ${corId}`);
        await db.query(
            "UPDATE estoque_pecas SET quantidade = quantidade + $1 WHERE id = $2",
            [qtd, corId]
        );
    }
};

const listarSlots = async () => {
    const query = `
        SELECT s.numero_slot, s.status, s.pedido_id, p.orderid_externo, u.nome_usuario 
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

const getPecasDoPedidoNoSlot = async (slot) => {
    const query = `
        SELECT pers.generonum as cor_cabeca, pers.acesspescoconum as cor_torso, pers.basemininum as cor_base
        FROM expedicao_slots s
        JOIN pedidos p ON s.pedido_id = p.id
        JOIN personagens pers ON p.personagem_id = pers.id
        WHERE s.numero_slot = $1 AND s.status = 'ocupado'
    `;
    const { rows } = await db.query(query, [slot]);
    return rows[0];
};

const listarLogs = async () => {
    const query = `SELECT id, orderid_externo, status, log_producao FROM pedidos WHERE log_producao IS NOT NULL ORDER BY id DESC LIMIT 10`;
    const { rows } = await db.query(query);
    return rows;
};

const buscarSlotLivre = async () => {
    // Pega o primeiro slot que estiver com status 'livre'
    const query = `
        SELECT numero_slot 
        FROM expedicao_slots 
        WHERE status = 'livre' 
        ORDER BY numero_slot ASC 
        LIMIT 1
    `;
    const { rows } = await db.query(query);
    // Retorna o número do slot ou null se não achar nada
    return rows[0] ? rows[0].numero_slot : null;
};

const ocuparSlot = async (numeroSlot, idInternoPedido) => {
    // Atualiza o slot com o ID interno do pedido e muda status para ocupado
    const query = `
        UPDATE expedicao_slots 
        SET status = 'ocupado', 
            pedido_id = $2,
            atualizado_em = NOW()
        WHERE numero_slot = $1
    `;
    await db.query(query, [numeroSlot, idInternoPedido]);
};

const buscarSlotDoPedido = async (pedidoId) => {
    const query = `SELECT numero_slot FROM expedicao_slots WHERE pedido_id = $1`;
    const { rows } = await db.query(query, [pedidoId]);
    return rows[0] ? rows[0].numero_slot : null;
};

module.exports = {
    listarPecas, 
    atualizarPeca, 
    verificarDisponibilidade, 
    consumirItens, 
    devolverItens,
    listarSlots, 
    liberarSlot, 
    getPecasDoPedidoNoSlot, 
    listarLogs,
    ocuparSlot,
    buscarSlotDoPedido,
    buscarSlotLivre
};