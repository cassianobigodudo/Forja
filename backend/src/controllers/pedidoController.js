const PedidoModel = require('../models/pedidoModel');
const CarrinhoModel = require('../models/carrinhoModel');
const EstoqueModel = require('../models/estoqueModel');
const db = require('../config/database');
const axios = require('axios');

// =========================================================================
// 1. TRADUTOR: RPG -> INDÚSTRIA
// =========================================================================
const montarPayloadIndustrial = (item, novoPedidoId) => {
    const safeInt = (val) => val ? parseInt(val) : 0;

    // BLOCO 3 (TOPO)
    const bloco3 = {
        cor: safeInt(item.generonum),
        lamina1: safeInt(item.corpelenum),
        padrao1: String(safeInt(item.marcasnum)),
        lamina2: safeInt(item.cabelonum),
        padrao2: String(safeInt(item.corcabelonum)),
        lamina3: safeInt(item.acesscabecanum),
        padrao3: String(safeInt(item.acesscabecanum) > 0 ? 1 : 0)
    };

    // BLOCO 2 (MEIO)
    const bloco2 = {
        cor: safeInt(item.acesspescoconum) || 1,
        lamina1: safeInt(item.roupacimanum),
        padrao1: String(safeInt(item.roupacimavariantenum)),
        lamina2: 0, padrao2: "0",
        lamina3: safeInt(item.armasnum),
        padrao3: String(safeInt(item.armasnum) > 0 ? 1 : 0)
    };

    // BLOCO 1 (BASE)
    const bloco1 = {
        cor: safeInt(item.basemininum) || 1,
        lamina1: safeInt(item.roupabaixonum),
        padrao1: String(safeInt(item.roupabaixovariantenum)),
        lamina2: 0, padrao2: "0",
        lamina3: safeInt(item.sapatonum),
        padrao3: String(safeInt(item.sapatovariantenum))
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

// =========================================================================
// 2. CRIAR PEDIDO (CHECKOUT COM CONSUMO DE ESTOQUE)
// =========================================================================
const criarAPartirDoCarrinho = async (req, res) => {
    console.log("\n🚀 [CHECKOUT] Iniciando processo...");
    const { id_usuario } = req.body;

    if (!id_usuario) return res.status(400).json({ message: 'Sem ID de usuário.' });

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Busca Itens do Carrinho
        const itensCarrinho = await CarrinhoModel.buscarPorSessao(id_usuario);
        if (itensCarrinho.length === 0) throw new Error('Carrinho vazio.');

        console.log(`📦 Itens no carrinho: ${itensCarrinho.length}`);

        // =================================================================
        // 🛑 NOVA LÓGICA: CALCULAR DEMANDA E SUBTRAIR ESTOQUE
        // =================================================================
        
        const demandaTotal = {}; // Ex: { '1': 3, '2': 5 } (ID Preto: 3, ID Vermelho: 5)

        const somarUso = (idCor) => {
            if (!idCor) return; 
            const chave = String(idCor);
            demandaTotal[chave] = (demandaTotal[chave] || 0) + 1;
        };

        // Varre todos os itens e soma os chassis usados
        itensCarrinho.forEach(item => {
            somarUso(item.generonum);       // Cor da Cabeça
            somarUso(item.acesspescoconum); // Cor do Torso
            somarUso(item.basemininum);     // Cor da Base
        });

        console.log("📊 Demanda de Peças:", demandaTotal);

        // A. Verificar se TEM peça suficiente (Sem mexer ainda)
        // Você precisa ter criado essa função no estoqueModel.js (passo anterior)
        const errosEstoque = await EstoqueModel.verificarDisponibilidade(demandaTotal);
        
        if (errosEstoque.length > 0) {
            console.error("❌ FALTA DE ESTOQUE:", errosEstoque);
            // IMPORTANTE: Retorna 409 (Conflict) para o front saber que é erro de estoque
            throw new Error(`Estoque insuficiente:\n${errosEstoque.join('\n')}`);
        }

        // B. CONSUMIR (SUBTRAIR) DO BANCO AGORA
        // Passamos 'client' para garantir que isso faça parte da transação
        // Se der erro depois (na API do professor), o ROLLBACK desfaz essa subtração
        await EstoqueModel.consumirItens(client, demandaTotal);
        console.log("🔥 Estoque debitado com sucesso (Reserva Garantida).");

        // =================================================================
        // FIM DA LÓGICA DE ESTOQUE - CONTINUA O PROCESSO NORMAL
        // =================================================================

        for (const item of itensCarrinho) {
            if (!item.personagem_id) throw new Error(`Item ${item.nome} sem ID válido.`);

            console.log(`\n🔨 Processando: ${item.nome}`);

            // Cria pedido no banco
            const novoPedidoId = await PedidoModel.criar(client, id_usuario, item.personagem_id, 'processando');
            
            // Monta Payload
            const payloadIndustrial = montarPayloadIndustrial(item, novoPedidoId);

            // Envia para Máquina
            console.log("   📡 Enviando para fila de produção...");
            await axios.post('http://52.72.137.244:3000/queue/items', payloadIndustrial);
            console.log("   ✅ Sucesso no envio.");

            // Atualiza status local
            await PedidoModel.atualizarStatus(client, novoPedidoId, 'enviado', payloadIndustrial.payload.orderId);
        }

        await CarrinhoModel.limparPorSessao(client, id_usuario);
        
        // Se chegou aqui, confirma a subtração do estoque e os pedidos
        await client.query('COMMIT');
        
        console.log("🏁 [CHECKOUT] Finalizado com sucesso.");
        res.status(200).json({ message: 'Itens enviados para produção.' });

    } catch (error) {
        // Se der erro em qualquer lugar (falta estoque, API offline), desfaz a subtração
        await client.query('ROLLBACK');
        
        console.error('❌ [ERRO CHECKOUT]', error.message);
        
        // Retorna status adequado
        const status = error.message.includes('Estoque insuficiente') ? 409 : 500;
        
        res.status(status).json({ 
            message: 'Erro ao processar.', 
            detalhe: error.message 
        });
    } finally {
        client.release();
    }
};

// =========================================================================
// 3. CALLBACK DETETIVE
// =========================================================================
const receberCallback = async (req, res) => {
    const dados = req.body;

    console.log('\n==================================================');
    console.log('📡 [CALLBACK RECEBIDO] SINAL DA MÁQUINA');
    console.log('==================================================');
    
    // Log Cru para aprendizado
    console.log('📦 JSON COMPLETO:', JSON.stringify(dados, null, 2));

    try {
        const statusExterno = dados.status; 
        const orderIdExterno = dados.payload?.orderId;
        
        // Pega o slot (Tenta payload.slot ou raiz.estoquePos)
        let slot = dados.payload?.slot || dados.estoquePos || dados.payload?.estoquePos;

        if (!orderIdExterno) {
            console.warn('⚠️ Ignorando callback sem OrderID.');
            return res.status(200).send('Ignored');
        }

        console.log(`🔎 Pedido: ${orderIdExterno} | Status Máquina: ${statusExterno}`);

        // Tradução de Status
        let novoStatus = 'processando';
        if (statusExterno === 'IN_PROGRESS' || statusExterno === 'PRINTING') {
            novoStatus = 'forjando';
        }
        if (statusExterno === 'COMPLETED' || statusExterno === 'ENTREGUE') {
            novoStatus = 'concluido';
            
            // Tratamento de Slot Nulo (Mock para teste se a máquina não mandar)
            if (!slot) {
                console.warn("⚠️ Slot veio NULL. Simulando slot para teste.");
                const idNum = parseInt(orderIdExterno.replace(/\D/g, '')) || 1;
                slot = (idNum % 6) + 1; 
            }
            console.log(`📍 Produto pronto na GAVETA/SLOT: ${slot}`);

            // Atualiza a tabela de EXPEDIÇÃO (Ocupa o slot)
            await db.query(
                "UPDATE expedicao_slots SET status = 'ocupado', pedido_id = (SELECT id FROM pedidos WHERE orderid_externo = $1) WHERE numero_slot = $2",
                [orderIdExterno, slot]
            );
        }

        // Salva Log JSONB e Atualiza Pedido
        const logEntry = {
            data: new Date(),
            status_maquina: statusExterno,
            slot_atribuido: slot,
            dados_brutos: dados
        };

        // Chama a função atualizada do Model (veja abaixo)
        await PedidoModel.atualizarStatusElog(orderIdExterno, novoStatus, logEntry, slot);

        console.log("✅ Pedido atualizado com sucesso.");
        res.status(200).json({ message: "Callback processado." });

    } catch (error) {
        console.error('❌ Erro no Callback:', error);
        res.status(500).json({ error: 'Erro interno.' });
    }
};

// =========================================================================
// 4. GET PEDIDOS (IMPORTANTE PARA O FRONTEND DO CLIENTE)
// =========================================================================
const getPedidosPorSessao = async (req, res) => {
    try {
        const { session_id } = req.params; // ID do Usuário

        if (!session_id) {
            return res.status(400).json({ message: "ID de sessão/usuário é obrigatório." });
        }

        // Chama o model que agora deve trazer o SLOT e o STATUS atualizado
        const pedidos = await PedidoModel.buscarPorUsuario(session_id);

        res.status(200).json(pedidos);

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ message: "Erro ao buscar histórico de pedidos." });
    }
};

module.exports = {
    criarAPartirDoCarrinho,
    receberCallback,
    getPedidosPorSessao // <--- EXPORTADO E ATIVO
};