// backend/index.js

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
