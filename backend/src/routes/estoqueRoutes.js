const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController'); // Importa o Controller

// Peças
router.get('/pecas', estoqueController.getPecas);
router.put('/pecas/:id', estoqueController.updatePeca);

// Expedição
router.get('/expedicao', estoqueController.getExpedicao);
router.post('/expedicao/alocar', estoqueController.alocarPedidoNaExpedicao);
router.post('/expedicao/:slot/liberar', estoqueController.liberarExpedicao);

// Logs
router.get('/logs', estoqueController.getLogs);

module.exports = router;