const PersonagemModel = require('../models/personagemModel');

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

// src/controllers/personagemController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializa o cliente da IA. Ele automaticamente lerá a chave do process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- FUNÇÕES HELPER ---

// Converte a string Base64 recebida do front-end
function parseBase64Image(base64String) {
  console.log('📸 Tamanho da imagem:', base64String.length);

  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('String Base64 de imagem inválida.');
  }

  console.log('✅ MIME Type:', matches[1]);

  return {
    mimeType: matches[1],
    data: matches[2]
  };
}

// O Molde do Prompt
function criarPrompt(nome, inspiracao1, inspiracao2, tonalidade) {
  return `
        Instrução de Papel (Persona):
        Você é um Mestre de Jogo experiente e um escritor de fantasia, especializado em criar narrativas profundas e coesas.

        Tarefa Principal:
        Crie uma história de origem (backstory) original e envolvente para um personagem de RPG. Sua história deve ter aproximadamente 150 palavras.

        Instruções Cruciais (Siga à risca):
        1.  **Análise Visual:** Analise a imagem do personagem fornecida. A aparência dele(a) é fundamental. Observe suas roupas, acessórios, a presença (ou ausência) de armas e sua postura. Incorpore esses detalhes visuais na história.
        2.  **Integração Criativa:** Use os "Elementos de Inspiração" como pontos de partida. Você deve CRIAR uma história que conecte esses elementos, não apenas listá-los.
        3.  **Foco Narrativo:** A história deve explicar *como* o personagem se tornou quem é.

        ---
        Dados do Personagem:
        * Nome: ${nome}
        * Elemento de Inspiração 1: ${inspiracao1}
        * Elemento de Inspiração 2: ${inspiracao2}
        * Tonalidade da História: ${tonalidade}
        ---
        Inicie a história diretamente:
    `;
}

// --- FUNÇÃO DO CONTROLLER ---

const gerarHistoria = async (req, res) => {
  console.log('🔵 === INÍCIO DA REQUISIÇÃO ===');
  console.log('🔑 API Key configurada?', !!process.env.GEMINI_API_KEY);

  try {
    const { nome, inspiracao1, inspiracao2, tonalidade, imageBase64 } = req.body;

    // 1. Validar entradas
    if (!nome || !inspiracao1 || !inspiracao2 || !tonalidade || !imageBase64) {
      console.log('❌ Campos faltando');
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    console.log('✅ Dados recebidos:', { nome, inspiracao1, inspiracao2, tonalidade });
    console.log('📸 Tamanho da imagem Base64:', imageBase64.length, 'caracteres');

    // 2. Configurar modelo e partes (texto + imagem)
    console.log('inicializando modelo gemini')
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    
    // Parse da imagem
    console.log('📸 Processando imagem...');
    let imagePart;
    try {
      const { mimeType, data } = parseBase64Image(imageBase64);
      console.log('✅ MIME Type:', mimeType);
      imagePart = {
        inlineData: { data, mimeType }
      };
    } catch (e) {
      console.error('❌ Erro ao processar imagem:', e.message);
      return res.status(400).json({ error: 'Formato de imagem Base64 inválido.' });
    }

    const promptDeTexto = criarPrompt(nome, inspiracao1, inspiracao2, tonalidade);
    console.log('📝 Prompt criado');
    
    // 3. Chamar a API do Gemini
    console.log('🚀 Chamando API do Gemini...');
    const result = await model.generateContent([promptDeTexto, imagePart]);

    console.log('✅ Resposta recebida do Gemini');
    const response = await result.response;
    const historiaGerada = response.text();

    console.log('📖 História gerada com sucesso! Tamanho:', historiaGerada.length, 'caracteres');

    // 4. Enviar resposta para o frontend
    res.status(200).json({ historia: historiaGerada });

  } catch (error) {
    console.error('❌ ERRO COMPLETO:', error);
    console.error('❌ Stack:', error.stack);
    console.error('Erro ao gerar história:', error);
    res.status(500).json({ 
      error: 'Falha ao se comunicar com a API do Gemini.',
      details: error.message
    });
  }
};


// const gerarHistoria = async (req, res) => {
//   console.log('🔵 === INÍCIO DA REQUISIÇÃO ===');
//   console.log('🔑 API Key configurada?', !!process.env.GEMINI_API_KEY);
  
//   try {
//     const { nome, inspiracao1, inspiracao2, tonalidade, imageBase64 } = req.body;

//     // Validação
//     if (!nome || !inspiracao1 || !inspiracao2 || !tonalidade || !imageBase64) {
//       console.log('❌ Campos faltando');
//       return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
//     }

//     console.log('✅ Dados recebidos:', { nome, inspiracao1, inspiracao2, tonalidade });
//     console.log('📸 Tamanho da imagem Base64:', imageBase64.length, 'caracteres');

//     // Parse da imagem
//     console.log('📸 Processando imagem...');
//     let imagePart;
//     try {
//       const { mimeType, data } = parseBase64Image(imageBase64);
//       console.log('✅ MIME Type:', mimeType);
//       imagePart = {
//         inlineData: { data, mimeType }
//       };
//     } catch (e) {
//       console.error('❌ Erro ao processar imagem:', e.message);
//       return res.status(400).json({ error: 'Formato de imagem Base64 inválido.' });
//     }

//     const promptDeTexto = criarPrompt(nome, inspiracao1, inspiracao2, tonalidade);
//     console.log('📝 Prompt criado');

//     // Lista de modelos para tentar (em ordem de preferência)
//     const modelosParaTentar = [
//       "gemini-1.5-flash",
//       "gemini-pro-vision",
//       "gemini-1.5-pro"
//     ];

//     let historiaGerada = null;
//     let ultimoErro = null;

//     // Tenta cada modelo até um funcionar
//     for (const nomeModelo of modelosParaTentar) {
//       try {
//         console.log(`🤖 Tentando modelo: ${nomeModelo}...`);
//         const model = genAI.getGenerativeModel({ model: nomeModelo });
        
//         const result = await model.generateContent([promptDeTexto, imagePart]);
//         const response = await result.response;
//         historiaGerada = response.text();
        
//         console.log(`✅ Sucesso com o modelo: ${nomeModelo}`);
//         break; // Sai do loop se funcionou
        
//       } catch (error) {
//         console.log(`❌ Modelo ${nomeModelo} falhou:`, error.message);
//         ultimoErro = error;
//         continue; // Tenta o próximo modelo
//       }
//     }

//     // Se nenhum modelo funcionou
//     if (!historiaGerada) {
//       throw new Error(`Nenhum modelo disponível. Último erro: ${ultimoErro?.message}`);
//     }

//     console.log('📖 História gerada com sucesso! Tamanho:', historiaGerada.length, 'caracteres');
//     res.status(200).json({ historia: historiaGerada });

//   } catch (error) {
//     console.error('❌ ERRO COMPLETO:', error.message);
//     res.status(500).json({ 
//       error: 'Falha ao se comunicar com a API do Gemini.',
//       details: error.message 
//     });
//   }
// };


module.exports = {
    criarPersonagem,
    gerarHistoria
};