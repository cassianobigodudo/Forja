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

        // =================================================================
        // 🛑 LÓGICA DE ESTOQUE (Inserida aqui)
        // =================================================================
        
        const demandaTotal = {}; 

        const somarUso = (idCor) => {
            if (!idCor) return; 
            const chave = String(idCor);
            demandaTotal[chave] = (demandaTotal[chave] || 0) + 1;
        };

        // Calcula quantos blocos de cada cor precisamos
        itensCarrinho.forEach(item => {
            somarUso(item.generonum);       // Cabeça
            somarUso(item.acesspescoconum); // Torso
            somarUso(item.basemininum);     // Base
        });

        console.log("📊 [ESTOQUE] Demanda Calculada:", demandaTotal);

        // A. Verificar se TEM peça suficiente
        const errosEstoque = await EstoqueModel.verificarDisponibilidade(demandaTotal);
        
        if (errosEstoque.length > 0) {
            console.error("❌ [ESTOQUE] Insuficiente:", errosEstoque);
            // Joga erro para cair no catch e fazer ROLLBACK
            throw new Error(`Estoque insuficiente:\n${errosEstoque.join('\n')}`);
        }

        // B. CONSUMIR (SUBTRAIR) DO BANCO AGORA
        // Isso acontece DENTRO da transação. Se a API da máquina falhar depois, isso é desfeito.
        await EstoqueModel.consumirItens(client, demandaTotal);
        console.log("🔥 [ESTOQUE] Debitado com sucesso (Reserva Garantida).");

        // =================================================================
        // 🚀 ENVIO PARA MÁQUINA
        // =================================================================

        for (const item of itensCarrinho) {
            console.log(`\n🔨 [PROCESSANDO] Item: ${item.nome} (ID: ${item.personagem_id})`);

            // Cria pedido local
            const novoPedidoId = await PedidoModel.criar(client, id_usuario, item.personagem_id, 'processando');
            console.log(`   -> Pedido criado no DB Local: ID ${novoPedidoId}`);
            
            // Monta Payload
            const payloadIndustrial = montarPayloadIndustrial(item, novoPedidoId);

            console.log("   -> 📤 Payload Sendo Enviado (Resumo): OrderID", payloadIndustrial.payload.orderId);

            // ENVIA PARA MÁQUINA
            console.log("   -> 📡 Disparando Axios para a Fábrica...");
            
            try {
                // Tenta enviar. Se a máquina rejeitar, cai no catch abaixo
                const responseExt = await axios.post('http://52.72.137.244:3000/queue/items', payloadIndustrial);
                
                console.log("   ✅ [SUCESSO IMEDIATO DA MÁQUINA]");
                console.log("   -> Status Code:", responseExt.status);

            } catch (axiosErro) {
                console.error("   ❌ [A MÁQUINA REJEITOU O PEDIDO]");
                if (axiosErro.response) {
                    console.error("   -> Motivo:", JSON.stringify(axiosErro.response.data));
                } else {
                    console.error("   -> Erro de Rede:", axiosErro.message);
                }
                // Esse throw faz o código pular para o catch principal -> ROLLBACK (Estoque volta)
                throw new Error("Falha na comunicação com a Indústria.");
            }

            // Atualiza status local com o ID externo
            await PedidoModel.atualizarStatus(client, novoPedidoId, 'enviado', payloadIndustrial.payload.orderId);
        }

        // Limpa carrinho e confirma tudo
        await CarrinhoModel.limparPorSessao(client, id_usuario);
        await client.query('COMMIT');
        
        console.log("🏁 [CHECKOUT] Finalizado com Sucesso Total.");
        res.status(200).json({ message: 'Itens enviados para produção.' });

    } catch (error) {
        // QUALQUER ERRO (Estoque ou API) cai aqui
        await client.query('ROLLBACK');
        console.error('🔥 [ROLLBACK TOTAL] Operação cancelada. Estoque restaurado.');
        console.error('   -> Erro:', error.message);
        
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