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

// ... imports

const criarAPartirDoCarrinho = async (req, res) => {
    console.log("\n🚀 [CHECKOUT] 1. Recebido pedido de finalização...");
    const { id_usuario } = req.body;

    if (!id_usuario) {
        console.log("❌ [ERRO] Sem ID de usuário no body.");
        return res.status(400).json({ message: 'Sem ID de usuário.' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Busca Itens
        console.log(`🔎 [CHECKOUT] 2. Buscando itens do usuário ${id_usuario}...`);
        const itensCarrinho = await CarrinhoModel.buscarPorSessao(id_usuario);
        
        if (itensCarrinho.length === 0) {
            console.log("⚠️ [CHECKOUT] Carrinho vazio.");
            throw new Error('Carrinho vazio.');
        }
        console.log(`📦 [CHECKOUT] 3. Itens encontrados: ${itensCarrinho.length}`);

        // --- VALIDAÇÃO E CONSUMO (Seu código de estoque aqui) ---
        // (Vou assumir que a parte do EstoqueModel está ok, focando no envio)
        
        // LOOP DE ENVIO
        for (const item of itensCarrinho) {
            console.log(`\n🔨 [PROCESSANDO] Item: ${item.nome} (ID: ${item.personagem_id})`);

            // Cria pedido local
            const novoPedidoId = await PedidoModel.criar(client, id_usuario, item.personagem_id, 'processando');
            console.log(`   -> Pedido criado no DB Local: ID ${novoPedidoId}`);
            
            // Monta Payload
            const payloadIndustrial = montarPayloadIndustrial(item, novoPedidoId);

            // LOG CRÍTICO: O QUE ESTAMOS MANDANDO?
            console.log("   -> 📤 Payload Sendo Enviado:");
            console.log(JSON.stringify(payloadIndustrial, null, 2));

            // ENVIA PARA MÁQUINA E ESPERA RESPOSTA IMEDIATA
            console.log("   -> 📡 Disparando Axios para: http://52.72.137.244:3000/queue/items");
            
            try {
                const responseExt = await axios.post('http://52.72.137.244:3000/queue/items', payloadIndustrial);
                
                // SE CHEGOU AQUI, A MÁQUINA RESPONDEU "OK"
                console.log("   ✅ [SUCESSO IMEDIATO DA MÁQUINA]");
                console.log("   -> Status Code:", responseExt.status); // Deve ser 200 ou 201
                console.log("   -> Resposta Body:", JSON.stringify(responseExt.data));

            } catch (axiosErro) {
                // AQUI É ONDE ESTÁ O SEGREDO DO ERRO
                console.error("   ❌ [A MÁQUINA REJEITOU O PEDIDO]");
                if (axiosErro.response) {
                    console.error("   -> Status:", axiosErro.response.status);
                    console.error("   -> Motivo:", JSON.stringify(axiosErro.response.data));
                } else {
                    console.error("   -> Erro de Rede/Timeout:", axiosErro.message);
                }
                throw new Error("Falha na comunicação com a Indústria.");
            }

            // Atualiza status local
            await PedidoModel.atualizarStatus(client, novoPedidoId, 'enviado', payloadIndustrial.payload.orderId);
        }

        await CarrinhoModel.limparPorSessao(client, id_usuario);
        await client.query('COMMIT');
        
        console.log("🏁 [CHECKOUT] Finalizado. Aguardando Callback...");
        res.status(200).json({ message: 'Itens enviados para produção.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('🔥 [ROLLBACK TOTAL] Ocorreu um erro:', error.message);
        res.status(500).json({ message: 'Erro ao processar.', detalhe: error.message });
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