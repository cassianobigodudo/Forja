const CarrinhoModel = require('../models/carrinhoModel');

// Lida com a adição de um item
const adicionarItem = async (req, res) => {
    console.log("--- [DEBUG CONTROLLER CARRINHO] POST /adicionarItem chamado ---");
    
    // Log do corpo bruto para ver se o JSON está chegando certo
    console.log("Body recebido:", JSON.stringify(req.body, null, 2));

    const { id_usuario, personagem_id } = req.body;

    if (!id_usuario || !personagem_id) {
        console.warn("--- [AVISO CONTROLLER] Faltando dados obrigatórios (id_usuario ou personagem_id) ---");
        return res.status(400).json({ message: 'ID de sessão e ID do personagem são obrigatórios.' });
    }

    try {
        console.log(`--- [DEBUG CONTROLLER] Chamando Model.adicionarItem(${id_usuario}, ${personagem_id})...`);
        await CarrinhoModel.adicionarItem(id_usuario, personagem_id);
        
        console.log("--- [DEBUG CONTROLLER] Sucesso! Item adicionado.");
        res.status(201).json({ message: 'Personagem adicionado ao carrinho!' });

    } catch (error) {
        if (error.code === '23505') { // Código de erro do Postgres para Unique Violation
            console.warn("--- [AVISO CONTROLLER] Item duplicado detectado.");
            return res.status(409).json({ message: 'Este personagem já está no seu carrinho.' });
        }
        
        console.error("--- [ERRO CONTROLLER] Erro fatal ao adicionar item:", error);
        res.status(500).json({ message: 'Erro ao adicionar ao carrinho.' });
    }
};

// Lida com a busca dos itens do carrinho
const getItens = async (req, res) => {
    console.log("--- [DEBUG CONTROLLER CARRINHO] GET /getItens chamado ---");
    
    // IMPORTANTE: Aqui você usa req.params. O Frontend deve chamar /api/carrinho/123
    const { id_usuario } = req.params;
    console.log("Parametro id_usuario recebido na URL:", id_usuario);

    if (!id_usuario) {
        console.error("--- [ERRO CONTROLLER] id_usuario veio undefined. Verifique a rota no routes.js! ---");
        // Dica: Se vier undefined, talvez você esteja enviando como query (?id=1) e não params (/1)
    }

    try {
        console.log(`--- [DEBUG CONTROLLER] Chamando Model.buscarPorSessao(${id_usuario})...`);
        const itens = await CarrinhoModel.buscarPorSessao(id_usuario);
        
        console.log(`--- [DEBUG CONTROLLER] Model retornou ${itens.length} itens.`);
        res.status(200).json(itens);

    } catch (error) {
        console.error("--- [ERRO CONTROLLER] Erro ao buscar itens:", error);
        res.status(500).json({ message: 'Erro ao buscar carrinho.' });
    }
};

const removerItem = async (req, res) => {
    console.log("--- [DEBUG CONTROLLER CARRINHO] DELETE /removerItem chamado ---");
    
    const { id_usuario, personagem_id } = req.params;

    if (!id_usuario || !personagem_id) {
        console.warn("--- [AVISO CONTROLLER] Faltando dados obrigatórios (id_usuario ou personagem_id) ---");
        return res.status(400).json({ message: 'ID de sessão e ID do personagem são obrigatórios.' });
    }

    try {
        console.log(`--- [DEBUG CONTROLLER] Chamando Model.limparUnidade(${id_usuario}, ${personagem_id})...`);
        await CarrinhoModel.limparUnidade(id_usuario, personagem_id);
        
        console.log("--- [DEBUG CONTROLLER] Sucesso! Item removido.");
        res.status(200).json({ message: 'Personagem removido do carrinho!' });

    } catch (error) {
        console.error("--- [ERRO CONTROLLER] Erro fatal ao remover item:", error);
        res.status(500).json({ message: 'Erro ao remover do carrinho.' });
    }
};

module.exports = {
    adicionarItem,
    getItens,
    removerItem
};