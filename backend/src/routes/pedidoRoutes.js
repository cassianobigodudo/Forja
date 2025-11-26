// backend/src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// POST /api/pedidos
// Esta rota representa a ação de "criar um novo pedido a partir do carrinho"
router.post('/', pedidoController.criarAPartirDoCarrinho);

// ROTA DE CALLBACK: O professor vai chamar esta rota
router.post('/callback', pedidoController.receberCallback);

// ROTA PARA BUSCAR OS PEDIDOS (NOVA)
// ex: GET http://meu-backend.com/api/pedidos/por-sessao/abc-123
router.get('/por-sessao/:session_id', pedidoController.getPedidosPorSessao);

module.exports = router;