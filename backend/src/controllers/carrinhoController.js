// backend/src/controllers/carrinhoController.js
const CarrinhoModel = require('../models/carrinhoModel');

// Lida com a adição de um item
const adicionarItem = async (req, res) => {
    const { usuario_id, personagem_id } = req.body;
    console.log("Adicionando ao carrinho:", { usuario_id, personagem_id });
    if (!usuario_id || !personagem_id) {
        return res.status(400).json({ message: 'ID de sessão e ID do personagem são obrigatórios.' });
    }

    try {
        await CarrinhoModel.adicionarItem(usuario_id, personagem_id);
        res.status(201).json({ message: 'Personagem adicionado ao carrinho!' });
    } catch (error) {
        if (error.code === '23505') { // Item duplicado
            return res.status(409).json({ message: 'Este personagem já está no seu carrinho.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar ao carrinho.' });
    }
};

// Lida com a busca dos itens do carrinho
const getItens = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const itens = await CarrinhoModel.buscarPorSessao(usuario_id);
        res.status(200).json(itens);
    } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
        res.status(500).json({ message: 'Erro ao buscar carrinho.' });
    }
};

module.exports = {
    adicionarItem,
    getItens,
};