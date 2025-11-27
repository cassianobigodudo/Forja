//backend/src/routes/personagemRoutes.js

const express = require('express');
const router = express.Router();
const personagemController = require('../controllers/personagemController');

router.post('/', personagemController.criarPersonagem);
router.post('/gerar-historia', personagemController.gerarHistoria);
router.get('/buscar-loja', personagemController.buscarPersonagensLoja);

module.exports = router;