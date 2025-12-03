// backend/src/routes/carrinhoRoutes.js
const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');

// POST /api/carrinho
router.post('/', carrinhoController.adicionarItem);

// GET /api/carrinho/:id_usuario
router.get('/:id_usuario', carrinhoController.getItens);

// DELETE /api/carrinho/:id_usuario/:personagem_id
router.delete('/:id_usuario/:personagem_id', carrinhoController.removerItem);

module.exports = router;