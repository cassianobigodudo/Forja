const express = require('express');
const router = express.Router();
const personagemController = require('../controllers/personagemController');

router.post('/', personagemController.criarPersonagem);

module.exports = router;