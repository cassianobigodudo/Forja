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
                    callbackUrl: `${process.env.BACKEND_URL}/api/pedidos/callback`
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

const receberCallback = async (req, res) => {
    // Manter o log é ótimo para depuração!
    console.log('--- CALLBACK DO PROFESSOR RECEBIDO ---');
    console.log('BODY:', JSON.stringify(req.body, null, 2));

    try {
        // 1. Extrair os dados que importam do JSON
        const statusExterno = req.body.status;
        const orderId = req.body.payload.orderId;      // ex: "pedido-forja-3"
        const producaoId = req.body.id;                // ex: "68f91767..."

        // 2. Validar se temos o que precisamos
        if (!orderId || !statusExterno || !producaoId) {
            console.warn('Callback recebido com dados incompletos.');
            return res.status(400).json({ message: "Dados do callback incompletos." });
        }

        // 3. A LÓGICA DE NEGÓCIO: Só atualizar se o status for "COMPLETED"
        if (statusExterno === "COMPLETED") {
            
            const nossoStatus = 'forjado'; // O status que você quer!

            // 4. Chamar o Model para atualizar nosso banco
            const pedidoAtualizado = await PedidoModel.atualizarStatusPorCallback(
                orderId, 
                nossoStatus, 
                producaoId
            );

            if (!pedidoAtualizado) {
                console.error(`Callback para orderId ${orderId} não encontrou pedido no nosso banco.`);
                // O professor não precisa saber disso, só avisamos que não encontramos.
                return res.status(404).json({ message: "Pedido não encontrado no nosso sistema." });
            }

            console.log(`SUCESSO: Pedido ${pedidoAtualizado.id} (Externo: ${orderId}) atualizado para status: ${nossoStatus}`);

        } else {
            // O status não é "COMPLETED" (ex: "IN_PROGRESS")
            console.log(`Callback recebido para ${orderId} com status: ${statusExterno}. Nenhuma ação de atualização foi tomada.`);
        }

        // 5. Responda 200 OK para o servidor do professor (ISSO É ESSENCIAL)
        // Avisamos que recebemos e processamos com sucesso.
        res.status(200).json({ message: "Callback processado com sucesso." });

    } catch (error) {
        console.error('### ERRO NO PROCESSAMENTO DO CALLBACK ###', error);
        // Se algo der errado, avisamos o professor.
        res.status(500).json({ message: "Erro interno ao processar callback." });
    }
};

module.exports = {
    criarAPartirDoCarrinho,
    receberCallback,
};