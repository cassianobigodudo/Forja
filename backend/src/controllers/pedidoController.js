const PedidoModel = require('../models/pedidoModel');
const CarrinhoModel = require('../models/carrinhoModel'); // <-- Importa o model do carrinho
const db = require('../config/database');
const axios = require('axios');

// Ação de criar um pedido a partir do carrinho
const criarAPartirDoCarrinho = async (req, res) => {
    const { usuario_id } = req.body;
    if (!usuario_id) {
        return res.status(400).json({ message: 'ID de sessão é obrigatório.' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Usa o CarrinhoModel para buscar os itens
        const itensCarrinho = await CarrinhoModel.buscarPorSessao(usuario_id);

        if (itensCarrinho.length === 0) {
            return res.status(400).json({ message: 'Seu carrinho está vazio.' });
        }
        
        const resultados = { sucessos: [], falhas: [] };

        for (const item of itensCarrinho) {
            let novoPedidoId = null;
            try {
                // 2. Cria o pedido usando o PedidoModel
                novoPedidoId = await PedidoModel.criar(client, usuario_id, item.id, 'processando');

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
                    callbackUrl: `${process.env.BACKEND_URL}/api/pedidos/callback`
                }

                // 3. Envia para o serviço externo
                await axios.post('http://52.72.137.244:3000//queue/items', requisicaoParaProfessor);
                
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
        await CarrinhoModel.limparPorSessao(client, usuario_id);
        
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

const receberCallback = async (req, res) => {
   
    console.log('--- CALLBACK DO PROFESSOR RECEBIDO ---');
    console.log('BODY:', JSON.stringify(req.body, null, 2));

    try {
        const statusExterno = req.body.status;
        const orderId = req.body.payload.orderId;      
        const producaoId = req.body.id;                

        if (!orderId || !statusExterno || !producaoId) {
            console.warn('Callback recebido com dados incompletos.');
            return res.status(400).json({ message: "Dados do callback incompletos." });
        }

        if (statusExterno === "COMPLETED") {
            
            const nossoStatus = 'forjado'; 

            const slotAleatorio = Math.floor(Math.random() * 100) + 1;
            console.log(`Pedido ${orderId} concluído. Atribuindo slot aleatório: ${slotAleatorio}`);

            const pedidoAtualizado = await PedidoModel.atualizarStatusPorCallback(
                orderId, 
                nossoStatus, 
                producaoId,
                slotAleatorio
            );

            if (!pedidoAtualizado) {
                console.error(`Callback para orderId ${orderId} não encontrou pedido no nosso banco.`);
                
                return res.status(404).json({ message: "Pedido não encontrado no nosso sistema." });
            }

            console.log(`SUCESSO: Pedido ${pedidoAtualizado.id} (Externo: ${orderId}) atualizado para status: ${nossoStatus}`);

        } else {
            console.log(`Callback recebido para ${orderId} com status: ${statusExterno}. Nenhuma ação de atualização foi tomada.`);
        }

        res.status(200).json({ message: "Callback processado com sucesso." });

    } catch (error) {
        console.error('### ERRO NO PROCESSAMENTO DO CALLBACK ###', error);
       
        res.status(500).json({ message: "Erro interno ao processar callback." });
    }
};

const getPedidosPorSessao = async (req, res) => {
    try {
        // Pegamos o session_id que vem na URL (ex: /api/pedidos/por-sessao/abc-123)
        const { session_id } = req.params;

        if (!session_id) {
            return res.status(400).json({ message: "ID de sessão é obrigatório." });
        }

        // Chama o model
        const pedidos = await PedidoModel.buscarPorSessao(session_id);

        // Retorna os pedidos encontrados (pode ser um array vazio [])
        res.status(200).json(pedidos);

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ message: "Erro ao buscar pedidos." });
    }
};

// Adicione a nova função ao module.exports
module.exports = {
    criarAPartirDoCarrinho,
    receberCallback,
    getPedidosPorSessao, // <-- ADICIONE AQUI
};