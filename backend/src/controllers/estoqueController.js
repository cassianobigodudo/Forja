const EstoqueModel = require('../models/estoqueModel');
const PedidoModel = require('../models/pedidoModel');
db = require('../config/database');

// --- PEÇAS ---
const getPecas = async (req, res) => {
    try {
        const pecas = await EstoqueModel.listarPecas();
        res.status(200).json(pecas);
    } catch (error) {
        console.error("Erro ao listar peças:", error);
        res.status(500).json({ error: "Erro interno" });
    }
};

const updatePeca = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantidade } = req.body;
        await EstoqueModel.atualizarPeca(id, quantidade);
        res.status(200).json({ message: "Estoque atualizado" });
    } catch (error) {
        console.error("Erro ao atualizar peça:", error);
        res.status(500).json({ error: "Erro interno" });
    }
};

// --- EXPEDIÇÃO ---
const getExpedicao = async (req, res) => { 
    try {
        const slots = await EstoqueModel.listarSlots();
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ error: "Erro interno" });
    }
};

const alocarPedidoNaExpedicao = async (req, res) => {
    const { pedidoId, orderIdExterno } = req.body;

    console.log(`\n📥 Processando alocação para Pedido ID ${pedidoId}...`);

    try {
        // 1. Verifica se já tem slot (Segurança)
        const slotExistente = await EstoqueModel.buscarSlotDoPedido(pedidoId);
        if (slotExistente) {
            return res.status(200).json({ message: "Já alocado", slot: slotExistente });
        }

        // 2. Busca vaga
        const slotLivre = await EstoqueModel.buscarSlotLivre();
        if (!slotLivre) {
            return res.status(409).json({ error: "Expedição lotada." });
        }

        // 3. Ocupa o Slot (Responsabilidade do EstoqueModel)
        await EstoqueModel.ocuparSlot(slotLivre, pedidoId);
        
        // 4. Atualiza Status (Responsabilidade do PedidoModel) - CORRIGIDO
        await PedidoModel.marcarComoPronto(pedidoId);

        console.log(` ✅ Pedido ${pedidoId} atualizado para 'PRONTO' no Slot ${slotLivre}`);

        res.status(200).json({ success: true, slot: slotLivre });

    } catch (error) {
        console.error("Erro ao alocar:", error);
        res.status(500).json({ error: "Erro interno" });
    }
};

// =========================================================
// ♻️ FUNÇÃO DE RECICLAGEM (DEBUGADA)
// =========================================================
const liberarExpedicao = async (req, res) => {
    const { slot } = req.params;
    
    console.log(`\n=================================================`);
    console.log(`♻️ [LIBERAÇÃO] Processando Slot ${slot}...`);

    // 1. Pega um cliente da pool para abrir transação
    const client = await db.connect(); 

    try {
        await client.query('BEGIN'); // Inicia a transação

        // -----------------------------------------------------------
        // A. DESCOBRIR O QUE TEM LÁ
        // -----------------------------------------------------------
        // Pega as peças do pedido (usando o Model)
        // Certifique-se que o Model retorna: id_cabeca, id_torso, id_chassi
        const pecas = await EstoqueModel.getPecasDoPedidoNoSlot(slot);
        
        // Pega o ID do pedido direto da tabela de slots
        const resSlot = await client.query(
            "SELECT pedido_id FROM expedicao_slots WHERE numero_slot = $1", 
            [slot]
        );
        const pedidoId = resSlot.rows[0]?.pedido_id;


        // -----------------------------------------------------------
        // B. DEVOLVER PEÇAS AO ESTOQUE (LOOP)
        // -----------------------------------------------------------
        if (pecas) {
            console.log(` 📦 Peças identificadas: Cabeça:${pecas.id_cabeca}, Torso:${pecas.id_torso}, Base:${pecas.id_chassi}`);
            
            const devolucao = {};
            const somar = (id) => { 
                if (!id) return;
                const chave = String(id);
                devolucao[chave] = (devolucao[chave] || 0) + 1; 
            };

            somar(pecas.id_cabeca);
            somar(pecas.id_torso);
            somar(pecas.id_chassi);

            // Chama o model para devolver (como seu model usa db.query direto,
            // ele vai rodar fora dessa transação 'client', mas vai funcionar)
            if (Object.keys(devolucao).length > 0) {
                await EstoqueModel.devolverItens(devolucao);
                console.log(" 🔄 Itens devolvidos ao estoque.");
            }
        } else {
            console.warn(" ⚠️ Nenhuma peça vinculada. Apenas liberando slot.");
        }


        // -----------------------------------------------------------
        // C. LIBERAR O SLOT E FINALIZAR PEDIDO
        // -----------------------------------------------------------
        
        // Limpa o slot
        await client.query(
            "UPDATE expedicao_slots SET status = 'livre', pedido_id = NULL, atualizado_em = NOW() WHERE numero_slot = $1",
            [slot]
        );

        // Marca pedido como CONCLUIDO
        if (pedidoId) {
            await client.query(
                "UPDATE pedidos SET status = 'CONCLUIDO' WHERE id = $1", 
                [pedidoId]
            );
            console.log(` ✅ Pedido ${pedidoId} finalizado.`);
        }

        await client.query('COMMIT'); // Confirma tudo
        res.status(200).json({ message: "Ciclo completo: Slot livre e itens devolvidos!" });

    } catch (error) {
        await client.query('ROLLBACK'); // Desfaz se der erro
        console.error("❌ Erro no controller:", error);
        res.status(500).json({ error: "Erro interno ao liberar slot." });
    } finally {
        client.release(); // Solta a conexão
    }
};
// --- LOGS ---
const getLogs = async (req, res) => {
    try {
        const logs = await EstoqueModel.listarLogs();
        res.status(200).json(logs);
    } catch (error) {
        console.error("Erro ao buscar logs:", error);
        res.status(500).json({ error: "Erro interno" });
    }
};


module.exports = {
    getPecas,
    updatePeca,
    getExpedicao,
    liberarExpedicao,
    getLogs,
    alocarPedidoNaExpedicao
};