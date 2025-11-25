// backend/src/routes/carrinhoRoutes.js
const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');

// POST /api/carrinho
router.post('/', carrinhoController.adicionarItem);

// GET /api/carrinho/:usuario_id
router.get('/:usuario_id', carrinhoController.getItens);

module.exports = router;