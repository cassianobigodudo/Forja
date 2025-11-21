const PersonagemModel = require('../models/personagemModel');

const criarPersonagem = async (req, res) => {
    try {
        // A validação de 'usuario_id' obrigatório fica aqui
        if (!req.body.usuario_id) {
            return res.status(400).json({ message: 'ID de sessão é obrigatório.' });
        }
        const novoPersonagem = await PersonagemModel.criar(req.body);
        res.status(201).json(novoPersonagem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao salvar personagem.' });
    }
};

module.exports = {
    criarPersonagem,
};