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
    
    // Mapeamento: 1=Preto, 2=Vermelho, 3=Azul
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
        // CHUMBADO PARA GARANTIR QUE FUNCIONE NO RENDER
        callbackUrl: `http://localhost:3333/callback`
    };
};

// =========================================================================
// 2. CHECKOUT (COM VALIDAÇÃO DE ESTOQUE)
// =========================================================================
const criarAPartirDoCarrinho = async (req, res) => {
    console.log("\n🚀 [CHECKOUT] Iniciando...");
    const { id_usuario } = req.body;
    if (!id_usuario) return res.status(400).json({ message: 'Sem ID de usuário.' });

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Busca Carrinho
        const itensCarrinho = await CarrinhoModel.buscarPorSessao(id_usuario);
        if (itensCarrinho.length === 0) throw new Error('Carrinho vazio.');

        // 2. Valida e Consome Estoque
        const demandaTotal = {};
        const somar = (id) => { if(id) demandaTotal[String(id)] = (demandaTotal[String(id)] || 0) + 1; };
        itensCarrinho.forEach(item => {
            somar(item.generonum); somar(item.acesspescoconum); somar(item.basemininum);
        });

        const errosEstoque = await EstoqueModel.verificarDisponibilidade(demandaTotal);
        if (errosEstoque.length > 0) throw new Error(`Estoque insuficiente:\n${errosEstoque.join('\n')}`);
        
        await EstoqueModel.consumirItens(client, demandaTotal);
        console.log("🔥 Estoque reservado.");

        // 3. Loop de Envio
        for (const item of itensCarrinho) {
            // A. Cria pedido "Pendente/Processando" no banco local
            const novoPedidoId = await PedidoModel.criar(client, id_usuario, item.personagem_id, 'processando');
            
            // B. Monta o JSON
            const payload = montarPayloadIndustrial(item, novoPedidoId);

            console.log(`\n📡 Enviando Pedido Local ${novoPedidoId}...`);

            // C. Envia para a Máquina e PEGA O ID DELA
            try {
                const response = await axios.post('http://52.72.137.244:3000/queue/items', payload);
                
                // --- AQUI ESTÁ A SUA LÓGICA DE CAPTURA ---
                let producaoIdExterno = null;
                
                if (response.data && response.data.id) {
                    producaoIdExterno = response.data.id; // O famoso "68b7..."
                    console.log(`✅ [SUCESSO] Máquina aceitou! ID Produção: ${producaoIdExterno}`);
                } else {
                    console.warn("⚠️ Máquina aceitou mas não retornou ID padrão.", response.data);
                }

                // D. Atualiza o banco com TUDO: Status 'enviado' + ID Nosso + ID Deles
                await PedidoModel.atualizarStatus(
                    client, 
                    novoPedidoId, 
                    'enviado', 
                    payload.payload.orderId, // Nosso ID (pedido-forja-55)
                    producaoIdExterno        // ID Deles (68b730ef...) <--- SALVANDO AGORA!
                );

            } catch (err) {
                console.error("❌ Erro no envio para máquina:", err.message);
                throw new Error("Falha na comunicação com a Indústria.");
            }
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

// =========================================================================
// 3. CALLBACK (AQUI ESTAVA O QUE FALTOU)
// =========================================================================
const receberCallback = async (req, res) => {
    const dados = req.body;
    console.log('\n📡 [CALLBACK RECEBIDO]', JSON.stringify(dados, null, 2));

    try {
        const statusExterno = dados.status; 
        const orderIdExterno = dados.payload?.orderId;
        let slot = dados.payload?.slot || dados.estoquePos || dados.payload?.estoquePos;

        if (!orderIdExterno) {
            console.warn('⚠️ Callback sem OrderID ignorado.');
            return res.status(200).send('Ignored');
        }

        console.log(`🔎 Pedido: ${orderIdExterno} | Status: ${statusExterno}`);

        let novoStatus = 'processando';
        if (statusExterno === 'IN_PROGRESS' || statusExterno === 'PRINTING') novoStatus = 'forjando';
        
        if (statusExterno === 'COMPLETED' || statusExterno === 'ENTREGUE') {
            novoStatus = 'concluido';
            
            // Mock de Slot se vier null
            if (!slot) {
                console.warn("⚠️ Slot veio NULL. Simulando slot...");
                const idNum = parseInt(orderIdExterno.replace(/\D/g, '')) || 1;
                slot = (idNum % 6) + 1; 
            }
            console.log(`📍 Produto na GAVETA: ${slot}`);

            // --- AQUI ESTAVA O ERRO MVC ANTES ---
            // Agora usamos o Model para buscar o ID e o EstoqueModel para ocupar o slot
            
            const idInterno = await PedidoModel.buscarIdPorExterno(orderIdExterno);
            
            if (idInterno) {
                await EstoqueModel.ocuparSlot(slot, idInterno);
            } else {
                console.error(`🚨 Pedido ${orderIdExterno} não encontrado no banco local.`);
            }
        }

        const logEntry = { data: new Date(), status_maquina: statusExterno, slot_atribuido: slot, dados_brutos: dados };
        await PedidoModel.atualizarStatusElog(orderIdExterno, novoStatus, logEntry, slot);

        res.status(200).json({ message: "Callback processado" });

    } catch (error) {
        console.error('❌ Erro Callback:', error);
        res.status(500).json({ error: 'Erro interno.' });
    }
};

// =========================================================================
// 4. HISTÓRICO
// =========================================================================
const getPedidosPorSessao = async (req, res) => {
    const { session_id } = req.params;
    
    console.log(`\n🔍 [API] Buscando histórico para Usuario/Sessão: "${session_id}"`);

    try {
        const pedidos = await PedidoModel.buscarPorUsuario(session_id);
        
        console.log(`✅ [API] Encontrados ${pedidos.length} pedidos para este usuário.`);
        
        // Se a lista vier vazia, avisa no console pra gente saber
        if (pedidos.length === 0) {
            console.warn("⚠️ AVISO: O banco retornou array vazio!");
        }

        res.status(200).json(pedidos);
    } catch (error) {
        console.error("❌ [API] Erro no controller:", error);
        res.status(500).json({ message: "Erro ao buscar histórico." });
    }
};

module.exports = { 
    criarAPartirDoCarrinho, 
    receberCallback, 
    getPedidosPorSessao 
};