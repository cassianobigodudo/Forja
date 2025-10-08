const PedidoModel = require('../models/pedidoModel');
const CarrinhoModel = require('../models/carrinhoModel'); // <-- Importa o model do carrinho
const db = require('../config/database');
const axios = require('axios');

// Ação de criar um pedido a partir do carrinho
const criarAPartirDoCarrinho = async (req, res) => {
    const { session_id } = req.body;
    if (!session_id) {
        return res.status(400).json({ message: 'ID de sessão é obrigatório.' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Usa o CarrinhoModel para buscar os itens
        const itensCarrinho = await CarrinhoModel.buscarPorSessao(session_id);

        if (itensCarrinho.length === 0) {
            return res.status(400).json({ message: 'Seu carrinho está vazio.' });
        }
        
        const resultados = { sucessos: [], falhas: [] };

        for (const item of itensCarrinho) {
            let novoPedidoId = null;
            try {
                // 2. Cria o pedido usando o PedidoModel
                novoPedidoId = await PedidoModel.criar(client, session_id, item.id, 'processando');

                const orderIdExterno = `pedido-forja-${novoPedidoId}`;
                const requisicaoParaProfessor = {
                    payload: {
                        orderId: orderIdExterno,
                        order: {
                            codigoProduto: 1,
                            bloco1: { cor: 1, lamina1: 1, lamina2: 1, lamina3: 1, padrao1: "1", padrao2: "1", padrao3: "1" },
                            bloco2: { cor: 1, lamina1: 1, lamina2: 1, lamina3: 1, padrao1: "1", padrao2: "1", padrao3: "1" },
                            bloco3: {
                                "cor": item.generonum,
                                "lamina1": 1,
                                "lamina2": item.corpelenum,
                                "lamina3": 1,
                                "padrao1": "1", "padrao2": "1", "padrao3": "1"
                            }
                        },
                        sku: "KIT-01"
                    },
                    callbackUrl: "http://localhost:3333/callback"
                }

                // 3. Envia para o serviço externo
                await axios.post('http://52.1.197.112:3000/queue/items', requisicaoParaProfessor);
                
                // 4. Atualiza o status do pedido usando o PedidoModel
                await PedidoModel.atualizarStatus(client, novoPedidoId, 'enviado', orderIdExterno);
                resultados.sucessos.push(novoPedidoId);

            } catch (error) {
                console.error(`### FALHA ao processar o personagem ${item.id}: ${error.message}`);
                resultados.falhas.push({ personagemId: item.id, erro: error.message });
                if (novoPedidoId) {
                    await PedidoModel.atualizarStatus(client, novoPedidoId, 'falha_envio', null);
                }
                throw error;
            }
        }

        // 5. Limpa o carrinho usando o CarrinhoModel
        await CarrinhoModel.limparPorSessao(client, session_id);
        
        await client.query('COMMIT');
        res.status(200).json({ mensagem: 'Finalização de compra processada.', ...resultados });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('### ERRO GERAL NA TRANSAÇÃO ###', error);
        res.status(500).json({ message: 'Ocorreu um erro grave ao finalizar a compra.' });
    } finally {
        client.release();
    }
};

module.exports = {
    criarAPartirDoCarrinho,
};