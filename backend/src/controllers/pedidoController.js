const PedidoModel = require('../models/pedidoModel');
const CarrinhoModel = require('../models/carrinhoModel');
const EstoqueModel = require('../models/estoqueModel');
const db = require('../config/database');
const axios = require('axios');

const montarPayloadIndustrial = (item, novoPedidoId) => {
    const safeInt = (val) => val ? parseInt(val) : 0;
    
    // Mapeamento: 1=Preto, 2=Vermelho, 3=Azul (Confirme no seu banco!)
    
    const bloco3 = { // Cabeça
        cor: safeInt(item.generonum),
        lamina1: safeInt(item.corpelenum), padrao1: String(safeInt(item.marcasnum)),
        lamina2: safeInt(item.cabelonum), padrao2: String(safeInt(item.corcabelonum)),
        lamina3: safeInt(item.acesscabecanum), padrao3: String(safeInt(item.acesscabecanum) > 0 ? 1 : 0)
    };
    const bloco2 = { // Torso
        cor: safeInt(item.acesspescoconum) || 1,
        lamina1: safeInt(item.roupacimanum), padrao1: String(safeInt(item.roupacimavariantenum)),
        lamina2: 0, padrao2: "0",
        lamina3: safeInt(item.armasnum), padrao3: String(safeInt(item.armasnum) > 0 ? 1 : 0)
    };
    const bloco1 = { // Base
        cor: safeInt(item.basemininum) || 1,
        lamina1: safeInt(item.roupabaixonum), padrao1: String(safeInt(item.roupabaixovariantenum)),
        lamina2: 0, padrao2: "0",
        lamina3: safeInt(item.sapatonum), padrao3: String(safeInt(item.sapatovariantenum))
    };

    return {
        payload: {
            orderId: `pedido-forja-${novoPedidoId}`,
            order: { codigoProduto: 1, bloco1, bloco2, bloco3 },
            sku: "FORJA-CUSTOM-V1"
        },
        callbackUrl: `${process.env.BACKEND_URL}/api/pedidos/callback`
    };
};

const criarAPartirDoCarrinho = async (req, res) => {
    console.log("\n🚀 [CHECKOUT] Iniciando...");
    const { id_usuario } = req.body;
    if (!id_usuario) return res.status(400).json({ message: 'Sem ID de usuário.' });

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        const itensCarrinho = await CarrinhoModel.buscarPorSessao(id_usuario);
        if (itensCarrinho.length === 0) throw new Error('Carrinho vazio.');

        // --- VALIDAÇÃO DE ESTOQUE ---
        const demandaTotal = {};
        const somar = (id) => { if(id) demandaTotal[id] = (demandaTotal[id] || 0) + 1; };
        
        itensCarrinho.forEach(item => {
            somar(item.generonum); somar(item.acesspescoconum); somar(item.basemininum);
        });

        const errosEstoque = await EstoqueModel.verificarDisponibilidade(demandaTotal);
        if (errosEstoque.length > 0) throw new Error(`Estoque insuficiente:\n${errosEstoque.join('\n')}`);

        // --- CONSUMO ---
        await EstoqueModel.consumirItens(client, demandaTotal);
        console.log("🔥 Estoque reservado.");

        for (const item of itensCarrinho) {
            const novoPedidoId = await PedidoModel.criar(client, id_usuario, item.personagem_id, 'processando');
            const payload = montarPayloadIndustrial(item, novoPedidoId);
            
            // Envia para API (Se falhar, o catch faz rollback do estoque)
            await axios.post('http://52.72.137.244:3000/queue/items', payload);
            await PedidoModel.atualizarStatus(client, novoPedidoId, 'enviado', payload.payload.orderId);
        }

        await CarrinhoModel.limparPorSessao(client, id_usuario);
        await client.query('COMMIT');
        res.status(200).json({ message: 'Produção iniciada com sucesso!' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ [ERRO CHECKOUT]', error.message);
        const status = error.message.includes('Estoque insuficiente') ? 409 : 500;
        res.status(status).json({ message: 'Erro ao processar.', detalhe: error.message });
    } finally {
        client.release();
    }
};

const receberCallback = async (req, res) => {
    // ... (Seu código de callback detetive vai aqui - use a versão mais recente que te mandei)
    // Lembre-se de importar o db para fazer o UPDATE nos slots
    const dados = req.body;
    // ... lógica de atualização de status e log ...
    res.status(200).json({ message: "Callback ok" });
};

const getPedidosPorSessao = async (req, res) => {
    try {
        const pedidos = await PedidoModel.buscarPorUsuario(req.params.session_id);
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar histórico." });
    }
};

module.exports = { criarAPartirDoCarrinho, receberCallback, getPedidosPorSessao };