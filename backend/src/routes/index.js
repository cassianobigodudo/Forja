//backend/src/routes/index.js

const express = require('express');
const router = express.Router();

// 1. Importa os arquivos de rota que criamos
const usuarioRoutes = require('./usuarioRoutes');
const personagemRoutes = require('./personagemRoutes');
const carrinhoRoutes = require('./carrinhoRoutes'); // <-- Adicionado
const pedidoRoutes = require('./pedidoRoutes');     // <-- Adicionado

// 2. Define um "prefixo" para cada conjunto de rotas
router.use('/usuarios', usuarioRoutes);
router.use('/personagens', personagemRoutes);
router.use('/carrinho', carrinhoRoutes);
router.use('/pedidos', pedidoRoutes);

module.exports = router;