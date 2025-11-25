// src/controllers/personagemController.js

const PersonagemModel = require('../models/personagemModel');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Inicializa o cliente da IA. Ele automaticamente lerá a chave do process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const criarPersonagem = async (req, res) => {
    try {
        // A validação de 'session_id' obrigatório fica aqui
        if (!req.body.session_id) {
            return res.status(400).json({ message: 'ID de sessão é obrigatório.' });
        }
        const novoPersonagem = await PersonagemModel.criar(req.body);
        res.status(201).json(novoPersonagem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao salvar personagem.' });
    }
};


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
        const base64Data = imageBase64.replace(/^data:image\/png;base64,/, "");

        // 3. Criar Prompt
        const prompt = `
            Crie uma história original de RPG com aproximadamente 150 palavras.
            Use as seguintes informações:

            - Nome: ${nome}
            - Inspiração 1: ${inspiracao1}
            - Inspiração 2: ${inspiracao2}
            - Tom / estilo da história: ${tonalidade}

            Também analise a imagem fornecida para descrever aparência, expressão, roupas e possíveis pistas visuais.
            Conecte esses elementos de forma criativa em uma narrativa coerente.
        `;

        // 4. Modelo
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        // 5. Enviar TEXTO + IMAGEM
        const result = await model.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "image/png",
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
    gerarHistoria
};