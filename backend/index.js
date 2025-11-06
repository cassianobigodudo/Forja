// backend/index.js

// 1. Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 2. Importa nosso gerenciador central de rotas
const mainRoutes = require('./src/routes');

const app = express();
// 3. Usa a porta definida no .env ou 3000 como padrão
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Necessário para o Render

// 1. Defina QUEM pode acessar sua API
const whitelist = [
  'http://localhost:3000', // Seu frontend em desenvolvimento
  // 'https://SEU-FRONTEND-NO-VERCEL-OU-NETLIFY.com' // ADICIONE QUANDO FOR HOSPEDAR
];

// 4. Configura os middlewares
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pela política de CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// 5. Registra APENAS o gerenciador central de rotas
app.use('/api', mainRoutes);

// Rota de teste para ver se o servidor está vivo
app.get('/', (req, res) => {
  res.send('Servidor Forja está VIVO!');
});

// 6. Inicia o servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor MVC rodando na porta ${PORT} =)`);
});

// // 🔥 IMPORTANTE: Registrar as rotas
// app.use('/api/personagem', personagemRoutes);

// // Rota de teste
// app.get('/', (req, res) => {
//   res.send('Servidor MVC rodando!');
// });


// // 5. Linha Mágica: Diz ao Express para usar nosso gerenciador de rotas
// //    para qualquer requisição que chegue no prefixo /api
// app.use('/api', mainRoutes);

// // 6. Inicia o servidor
// app.listen(PORT, () => {
//     console.log(`Servidor MVC rodando na porta ${PORT} =)`);
// });

// backend/index.js

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mainRoutes = require('./src/routes');

// const app = express();
// // O Render ignora essa porta, mas é bom ter o '0.0.0.0'
// const PORT = process.env.PORT || 3001;
// const HOST = '0.0.0.0'; 

// // --- CONFIGURAÇÃO DE CORS À PROVA DE RENDER ---

// // 1. Defina QUEM pode acessar sua API
// const whitelist = [
//   'http://localhost:3000', // A. Seu frontend em desenvolvimento
//   // B. ADICIONE AQUI A URL DO SEU JOGO QUANDO ESTIVER HOSPEDADO
//   // ex: 'https://meu-jogo-forja.vercel.app' 
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Permite requisições da whitelist (e requisições sem 'origin', como do Postman)
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Não permitido pela política de CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
//   allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
// };

// // 2. Lida com TODAS as requisições OPTIONS (preflight) PRIMEIRO
// // Esta é a linha mais importante para corrigir o erro do Render.
// app.options('*', cors(corsOptions)); 

// // 3. Aplica a configuração de CORS a todas as outras rotas
// app.use(cors(corsOptions));

// // --------------------------------------------------

// // O resto do seu código
// app.use(express.json({ limit: '10mb' })); 
// app.use('/api', mainRoutes);

// app.listen(PORT, HOST, () => {
//     console.log(`Servidor MVC rodando na porta ${PORT} =)`);
// });