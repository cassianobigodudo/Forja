const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');

// POST: Salvar novo endereço
// URL: http://.../api/enderecos
router.post('/', enderecoController.adicionarEndereco);

// GET: Pegar endereços de um usuário específico
// URL: http://.../api/enderecos/usuario/5
router.get('/usuario/:id_usuario', enderecoController.buscarPorUsuario);

// NOVAS ROTAS
router.put('/:id_endereco', enderecoController.editarEndereco);
router.delete('/:id_endereco', enderecoController.deletarEndereco);

module.exports = router;