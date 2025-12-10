const EstoqueModel = require('../models/estoqueModel');

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
    // Esperamos receber o ID INTERNO do pedido (aquele Integer do seu banco)
    const { pedidoId } = req.body; 

    console.log(`\n📥 Tentando alocar pedido ID ${pedidoId} na expedição...`);

    try {
        if (!pedidoId) {
            return res.status(400).json({ error: "ID do pedido é obrigatório." });
        }

        // 1. Segurança: Verifica se o pedido JÁ tem um slot
        const slotExistente = await EstoqueModel.buscarSlotDoPedido(pedidoId);
        if (slotExistente) {
            console.log(` ⚠️ Pedido já está no Slot ${slotExistente}.`);
            return res.status(200).json({ 
                message: "Pedido já alocado.", 
                slot: slotExistente 
            });
        }

        // 2. Busca um slot livre (A1, A2...)
        const slotLivre = await EstoqueModel.buscarSlotLivre();

        if (!slotLivre) {
            console.error(" ❌ Fila cheia! Nenhum slot livre.");
            return res.status(409).json({ error: "Expedição lotada. Aguarde retiradas." });
        }

        // 3. Ocupa o slot
        await EstoqueModel.ocuparSlot(slotLivre, pedidoId);
        
        console.log(` ✅ Sucesso! Pedido ${pedidoId} estacionado no Slot ${slotLivre}.`);

        res.status(200).json({ 
            success: true, 
            message: `Pedido alocado no slot ${slotLivre}`,
            slot: slotLivre
        });

    } catch (error) {
        console.error("Erro ao alocar expedição:", error);
        res.status(500).json({ error: "Erro interno ao processar alocação." });
    }
};

// =========================================================
// ♻️ FUNÇÃO DE RECICLAGEM (DEBUGADA)
// =========================================================
const liberarExpedicao = async (req, res) => {
    const { slot } = req.params;
    
    console.log(`\n=================================================`);
    console.log(`♻️ [RECICLAGEM] Iniciando liberação do BOX ${slot}...`);
    console.log(`=================================================`);

    try {
        // 1. Descobrir quais peças estão nesse slot para devolver
        console.log(`   🔎 Buscando pedido no Slot ${slot}...`);
        const pecas = await EstoqueModel.getPecasDoPedidoNoSlot(slot);

        if (pecas) {
            console.log(`   📦 Peças encontradas no boneco:`);
            console.log(`      -> Cabeça (Cor ID): ${pecas.cor_cabeca}`);
            console.log(`      -> Torso  (Cor ID): ${pecas.cor_torso}`);
            console.log(`      -> Base   (Cor ID): ${pecas.cor_base}`);

            // Monta o mapa de devolução
            const devolucao = {};

            const somar = (id) => {
                if (!id) return;
                const chave = String(id);
                devolucao[chave] = (devolucao[chave] || 0) + 1;
            };

            somar(pecas.cor_cabeca);
            somar(pecas.cor_torso);
            somar(pecas.cor_base);

            console.log("   📊 Resumo da Devolução (ID: Qtd):", JSON.stringify(devolucao));

            // 2. Devolve para o estoque (UPDATE +)
            console.log("   🔄 Executando estorno no banco de dados...");
            await EstoqueModel.devolverItens(devolucao);
            console.log("   ✅ Estoque reabastecido com sucesso.");
        
        } else {
            console.warn("   ⚠️ AVISO: Slot estava vazio ou pedido não tem peças vinculadas. Nada a devolver.");
        }

        // 3. Libera a gaveta (UPDATE status='livre')
        console.log("   🧹 Limpando a gaveta...");
        await EstoqueModel.liberarSlot(slot);
        
        console.log(`🏁 [FIM] Slot ${slot} liberado e pronto para uso.`);
        res.status(200).json({ message: `Slot ${slot} liberado e peças devolvidas ao estoque!` });

    } catch (error) {
        console.error("❌ [ERRO CRÍTICO] Falha na reciclagem:", error);
        res.status(500).json({ error: "Erro interno ao processar devolução." });
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