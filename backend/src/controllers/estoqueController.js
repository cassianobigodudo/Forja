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
        console.error("Erro ao listar slots:", error);
        res.status(500).json({ error: "Erro interno" });
    }
};

const liberarExpedicao = async (req, res) => {
    const { slot } = req.params;
    console.log(`\n♻️ [RECICLAGEM] Iniciando liberação do Slot ${slot}...`);

    try {
        // 1. Descobrir quais peças estão nesse slot para devolver
        const pecas = await EstoqueModel.getPecasDoPedidoNoSlot(slot);

        if (pecas) {
            // Monta o mapa de devolução (Ex: 2 Vermelhos, 1 Azul)
            const devolucao = {};

            // Helper para somar no objeto
            const somar = (id) => {
                if (!id) return;
                const chave = String(id);
                devolucao[chave] = (devolucao[chave] || 0) + 1;
            };

            somar(pecas.cor_cabeca);
            somar(pecas.cor_torso);
            somar(pecas.cor_base);

            console.log("   -> Peças recuperadas do boneco:", devolucao);

            // 2. Devolve para o estoque (UPDATE +)
            await EstoqueModel.devolverItens(devolucao);
            console.log("   -> Estoque reabastecido com sucesso.");
        } else {
            console.warn("   -> Slot estava vazio ou pedido não encontrado. Nada a devolver.");
        }

        // 3. Libera a gaveta (UPDATE status='livre')
        await EstoqueModel.liberarSlot(slot);
        
        console.log("   -> Slot liberado.");
        res.status(200).json({ message: `Slot ${slot} liberado e peças devolvidas ao estoque!` });

    } catch (error) {
        console.error("❌ Erro ao liberar slot:", error);
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
    getLogs
};