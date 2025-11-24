// backend/index.js
// VERSÃO LIMPA E CORRETA

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');

// // 1. Importa APENAS o seu gerenciador central de rotas
// const mainRoutes = require('./src/routes');

// const app = express();
// const PORT = process.env.PORT || 3001; 

// // 4. Configura os middlewares padrões
// app.use(express.json({ limit: '10mb' })); 

// // 5. Registra APENAS o gerenciador central de rotas UMA VEZ
// // o 'mainRoutes' (src/routes/index.js) é responsável por carregar o 'personagemRoutes', 'carrinhoRoutes', etc.
// app.use('/api', mainRoutes);

// // 6. Inicia o servidor
// app.listen(PORT, () => {
//     console.log(`Servidor MVC rodando na porta ${PORT} =)`);
// });


// nova versão do index.js com correções

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mainRoutes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // <-- FALTAVA ISSO
app.use(express.json({ limit: '10mb' }));

// Rotas
app.use('/api', mainRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Servidor MVC rodando na porta ${PORT}`);
});
