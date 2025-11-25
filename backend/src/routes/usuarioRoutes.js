const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para CADASTRO (POST /api/usuarios/cadastro)
router.post('/cadastro', usuarioController.cadastrar);

// Rota para LOGIN (POST /api/usuarios/login)
router.post('/login', usuarioController.login);

module.exports = router;