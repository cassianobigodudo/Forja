// src/controllers/personagemController.js

const PersonagemModel = require('../models/personagemModel');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Inicializa o cliente da IA. Ele automaticamente lerá a chave do process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ===============================
// CRIAR PERSONAGEM
// ===============================

const criarPersonagem = async (req, res) => {
    console.log("--- [DEBUG] 1. Requisição chegou no Controller ---");
    console.log("Dados recebidos:", JSON.stringify(req.body, null, 2));

    try {
        // 1. Validação
        if (!req.body.id_usuario) {
            console.log("--- [ERRO] Falta id_usuario ---");
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

const buscarPersonagensLoja = async (req, res) => {
    console.log("--- [DEBUG CONTROLLER] Requisição GET /buscar-loja recebida ---");

    try {
        // Chama o Model
        const personagens = await PersonagemModel.buscar();
        
        console.log("--- [DEBUG CONTROLLER] Dados recebidos do Model. Enviando para o Frontend...");
        
        // Retorna o JSON
        res.status(200).json(personagens);
        
    } catch (err) {
        console.error("--- [ERRO CONTROLLER] Erro ao buscar personagens:", err);
        res.status(500).json({ message: 'Erro interno ao buscar personagens da loja.' });
    }
}


// ===============================
// GERAR HISTÓRIA COM IA + IMAGEM
// ===============================

const gerarHistoria = async (req, res) => {
    try {
        const { nome, inspiracao1, inspiracao2, tonalidade, imageBase64 } = req.body;

        // 1. Validação
        if (!nome || !inspiracao1 || !inspiracao2 || !tonalidade || !imageBase64) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        // 2. Remover cabeçalho da Base64
        // const base64Data = imageBase64.replace(/^data:image\/png;base64,/, "");

        let base64Data = imageBase64;

        // Remove qualquer prefixo de base64
        if (base64Data.includes(",")) {
            base64Data = base64Data.split(",")[1];
        }

        // Remove espaços, quebras de linha e caracteres inválidos
        base64Data = base64Data.trim().replace(/\s/g, "");

        // 3. Criar Prompt
        const prompt = `
            Crie uma história de background para um boneco de RPG com aproximadamente 150 palavras, usando as informações abaixo como inspiração. Atenção aos elementos de inspiração, quero que você *CRIE* baseado nos elementos, e não dependa só deles. Análise a miniatura printada na imagem e pegue todos os detalhes dela, desde o cabelo, as roupas, suas armas (ou a falta de armas) e seus acessórios. Conecte esses elementos de forma criativa em uma narrativa coerente.
            Use as seguintes informações:

            - Nome: ${nome}
            - Inspiração 1: ${inspiracao1}
            - Inspiração 2: ${inspiracao2}
            - Tom / estilo da história: ${tonalidade}

        `;

        // 4. Modelo
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        // 5. Enviar TEXTO + IMAGEM
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: base64Data
                            }
                        }
                    ]
                }
            ]
        });

        const historia = result.response.text();

        return res.status(200).json({ historia });

    } catch (error) {
        console.error("Erro ao gerar história:", error);
        res.status(500).json({
            error: "Erro ao se comunicar com a IA.",
            details: error.message
        });
    }
};

// ===============================
// EXPORTAÇÃO FINAL
// ===============================
module.exports = {
    criarPersonagem,
    gerarHistoria,
    buscarPersonagensLoja
};