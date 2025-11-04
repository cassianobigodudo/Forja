//personagemRoutes.js

const express = require('express');
const router = express.Router();
const personagemController = require('../controllers/personagemController');

router.post('/', personagemController.criarPersonagem);

// --- NOVA ROTA PARA IA ---
// Rota para gerar a história ANTES de talvez salvar o personagem
// POST /api/personagem/gerar-historia
router.post('/gerar-historia', personagemController.gerarHistoria);

module.exports = router;