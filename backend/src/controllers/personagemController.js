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
    // ============================================================
    // 🔍 DEBUGGER VIZINHO: CHECKPOINT 2 (CONTROLLER)
    // ============================================================
    console.log("\n================================================");
    console.log("📡 RECEBIDO NO CONTROLLER PERSONAGEM (REQ.BODY)");
    console.log("================================================");
    const d = req.body;

    console.log("1. DADOS DE CABELO E PELE:");
    console.log(`   - Cabelo: ${d.cabelo} (Num: ${d.cabeloNum})`);
    console.log(`   - Cor Cabelo: ${d.corCabelo} (Num: ${d.corCabeloNum})`);
    console.log(`   - Pele: ${d.corPele} (Num: ${d.corPeleNum})`);

    console.log("2. ACESSÓRIOS:");
    console.log(`   - Pescoço: ${d.acessorioPescoco} (Num: ${d.acessPescocoNum})`);
    console.log(`   - Cabeça Array: ${JSON.stringify(d.acessoriosCabeca)}`);
    console.log(`   - Cabeça Base Num: ${d.acessCabeca}`);
    console.log(`   - Cabeça Padrão: ${d.acessCabecapadrao}`);
    console.log(`   - Marcas: ${d.marcas} (Padrao: ${d.marcaspadrao})`);

    console.log("3. ROUPAS INDUSTRIAIS (Cor/Padrão):");
    console.log(`   - Torso: ${d.roupaCimaCorNum} / ${d.roupaCimaPadrao} (Var: ${d.roupaCimaVarPadrao})`);
    console.log(`   - Perna: ${d.roupaBaixoCorNum} / ${d.roupaBaixoPadrao} (Var: ${d.roupaBaixoVarPadrao})`);
    console.log(`   - Sapato Cor: ${d.sapatoCorNum}`);
    console.log(`   - Arma Cor/Pad: ${d.armasCorNum} / ${d.armasPadrao}`);
    console.log("====================================================\n");
    // ============================================================
    
    try {
        // Valida se o ID do usuário veio
        if (!req.body.id_usuario) {
            return res.status(400).json({ message: 'Usuário não identificado.' });
        }

        // Verifica tamanho da imagem (Base64)
        const imgSize = req.body.img ? req.body.img.length : 0;
        console.log(`--- [DEBUG CONTROLLER] ID Usuário: ${req.body.id_usuario}`);
        console.log(`--- [DEBUG CONTROLLER] Gênero: ${req.body.genero} (Num: ${req.body.generoNum})`);
        console.log(`--- [DEBUG CONTROLLER] Tamanho da Imagem Recebida: ${imgSize} caracteres`);

        console.log("--- [DEBUG CONTROLLER] Chamando PersonagemModel.criar... ---");
        const novoPersonagem = await PersonagemModel.criar(req.body);
        
        console.log("--- [DEBUG CONTROLLER] Sucesso! ID do Novo Personagem:", novoPersonagem.id);

        res.status(201).json(novoPersonagem);

    } catch (err) {
        console.error("--- [ERRO FATAL CONTROLLER] Erro ao salvar personagem: ---");
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