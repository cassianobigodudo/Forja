const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para CADASTRO (POST /api/usuarios/cadastro)
router.post('/cadastro', usuarioController.cadastrar);

// Rota para LOGIN (POST /api/usuarios/login)
router.post('/login', usuarioController.login);
//
// Rota para CADASTRO DE CARTÃO (POST /api/usuarios/cartoes)
router.post('/cartoes', usuarioController.adicionarCartao);

router.get('/:id_usuario', usuarioController.obterDadosUsuario);

router.patch('/:id_usuario', usuarioController.editarDados);

router.delete('/:id_usuario', usuarioController.deletarConta);
module.exports = router;