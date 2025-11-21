const PersonagemModel = require('../models/personagemModel');

const criarPersonagem = async (req, res) => {
    console.log("--- [DEBUG] 1. Requisição chegou no Controller ---");
    console.log("Dados recebidos:", JSON.stringify(req.body, null, 2));

    try {
        // 1. Validação
        if (!req.body.usuario_id) {
            console.log("--- [ERRO] Falta usuario_id ---");
            return res.status(400).json({ message: 'Usuário não identificado.' });
        }

        console.log("--- [DEBUG] 2. Dados validados. Chamando Model... ---");

        // 2. Chama o Model (Onde costuma travar se o banco estiver ruim)
        const novoPersonagem = await PersonagemModel.criar(req.body);
        
        console.log("--- [DEBUG] 3. Model retornou com sucesso! ---");
        console.log("ID Criado:", novoPersonagem.id);

        res.status(201).json(novoPersonagem);

    } catch (err) {
        console.error("--- [ERRO FATAL] No Controller ---");
        console.error(err);
        res.status(500).json({ message: 'Erro ao salvar personagem.' });
    }
};

module.exports = {
    criarPersonagem,
};