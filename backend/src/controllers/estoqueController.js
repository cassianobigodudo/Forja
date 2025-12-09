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
    console.log(`\n♻️ [RECICLAGEM] Liberando Slot ${slot}...`);

    try {
        // 1. Recupera peças do boneco para reciclar
        const pecas = await EstoqueModel.getPecasDoPedidoNoSlot(slot);
        
        if (pecas) {
            const devolucao = {};
            const somar = (id) => { if(id) devolucao[id] = (devolucao[id] || 0) + 1; };
            
            somar(pecas.cor_cabeca); somar(pecas.cor_torso); somar(pecas.cor_base);
            
            await EstoqueModel.devolverItens(devolucao); // SOMA no estoque
            console.log("   -> Peças devolvidas ao estoque:", devolucao);
        }

        // 2. Libera a gaveta
        await EstoqueModel.liberarSlot(slot);
        res.status(200).json({ message: `Slot ${slot} liberado e reciclado!` });

    } catch (error) {
        console.error("❌ Erro na reciclagem:", error);
        res.status(500).json({ error: "Erro ao liberar slot" });
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