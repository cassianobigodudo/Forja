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
    try {
        const { slot } = req.params;
        await EstoqueModel.liberarSlot(slot);
        res.status(200).json({ message: `Slot ${slot} liberado` });
    } catch (error) {
        console.error("Erro ao liberar slot:", error);
        res.status(500).json({ error: "Erro interno" });
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