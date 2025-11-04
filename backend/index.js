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

// 4. Configura os middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 5. Linha Mágica: Diz ao Express para usar nosso gerenciador de rotas
//    para qualquer requisição que chegue no prefixo /api
app.use('/api', mainRoutes);

// 6. Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor MVC rodando na porta ${PORT} =)`);
});