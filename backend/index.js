// backend/index.js
// VERSÃO LIMPA E CORRETA

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Importa APENAS o seu gerenciador central de rotas
const mainRoutes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3001; 
const HOST = '0.0.0.0'; // Necessário para o Render

// --- CONFIGURAÇÃO DE CORS À PROVA DE RENDER ---

// 1. Defina QUEM pode acessar sua API
const whitelist = [
  'http://localhost:3000', // Seu frontend em desenvolvimento
  // 'https://SEU-FRONTEND-NO-VERCEL-OU-NETLIFY.com' // ADICIONE QUANDO FOR HOSPEDAR
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições da whitelist (e requisições sem 'origin', como do Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origem não permitida pela política de CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// 2. ESSA LINHA É A MAIS IMPORTANTE: Lida com o "preflight" (OPTIONS)
// Isso resolve o erro "Redirect is not allowed" do Render.
app.options('*', cors(corsOptions)); 

// 3. Aplica a configuração de CORS a todas as outras rotas
app.use(cors(corsOptions));

// --------------------------------------------------

// 4. Configura os middlewares padrões
app.use(express.json({ limit: '10mb' })); 

// 5. Registra APENAS o gerenciador central de rotas UMA VEZ
// O seu 'mainRoutes' (src/routes/index.js) é responsável por carregar
// o 'personagemRoutes', 'carrinhoRoutes', etc.
app.use('/api', mainRoutes);

// Rota de teste para ver se o servidor está vivo
app.get('/', (req, res) => {
  res.send('Servidor Forja está VIVO!');
});

// 6. Inicia o servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor MVC rodando na porta ${PORT} =)`);
});