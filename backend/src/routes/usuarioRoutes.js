const express = require('express');
const router = express.Router();

// 1. Importamos o controller
const usuarioController = require('../controllers/usuarioController');

// 2. Definimos que a rota POST para a raiz ('/') vai chamar a função do controller
router.post('/', usuarioController.criarUsuario);

// 3. Exportamos o router
module.exports = router;