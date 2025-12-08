const PedidoModel = require('../models/pedidoModel');
const CarrinhoModel = require('../models/carrinhoModel'); // <-- Importa o model do carrinho
const db = require('../config/database');
const axios = require('axios');

// Função auxiliar para traduzir RPG -> Indústria
const montarPayloadIndustrial = (item, novoPedidoId) => {
    
    // Fallback: Se vier null do banco, usa 0 ou 1 para não quebrar a máquina
    const safeInt = (val) => val ? parseInt(val) : 0; // 0 geralmente é "sem faceta"

    // Mapeamento baseado na sua Tabela:
    
    // BLOCO 3 (TOPO - Cabeça)
    const bloco3 = {
        cor: safeInt(item.generonum),       // Cor do Bloco = Gênero
        lamina1: safeInt(item.corpelenum),  // Frontal Cor = Pele
        padrao1: String(safeInt(item.marcasnum)), // Frontal Símbolo = Sardas (String)
        lamina2: safeInt(item.cabelonum),   // Direita Cor = Estilo Cabelo
        padrao2: String(safeInt(item.corcabelonum)), // Direita Símbolo = Cor Cabelo
        lamina3: safeInt(item.acesscabecanum), // Esquerda Cor = Acessório
        padrao3: String(safeInt(item.acesscabecanum) > 0 ? 1 : 0) // Exemplo: Se tem acessório, põe simbolo 1
    };

    // BLOCO 2 (MEIO - Torso)
    const bloco2 = {
        cor: safeInt(item.acesspescoconum) || 1, // Cor do Bloco = Acessório Pescoço (Default 1 se nulo)
        lamina1: safeInt(item.roupacimanum),     // Frontal Cor = Roupa Cima
        padrao1: String(safeInt(item.roupacimavariantenum)), // Frontal Símbolo
        lamina2: 0, // Branca (Fixo na tabela) ou lógica específica
        padrao2: "0",
        lamina3: safeInt(item.armasnum),         // Esquerda Cor = Armas
        padrao3: String(safeInt(item.armasnum) > 0 ? 1 : 0)
    };

    // BLOCO 1 (BASE - Pernas)
    const bloco1 = {
        cor: safeInt(item.basemininum) || 1,     // Cor do Bloco = Base
        lamina1: safeInt(item.roupabaixonum),    // Frontal Cor = Roupa Baixo
        padrao1: String(safeInt(item.roupabaixovariantenum)),
        lamina2: 0, // Branca (Fixo)
        padrao2: "0",
        lamina3: safeInt(item.sapatonum),        // Esquerda Cor = Sapatos
        padrao3: String(safeInt(item.sapatovariantenum))
    };

    return {
        payload: {
            orderId: `pedido-forja-${novoPedidoId}`,
            order: {
                codigoProduto: 1, // Fixo ou dinâmico
                bloco1: bloco1,
                bloco2: bloco2,
                bloco3: bloco3
            },
            sku: "FORJA-CUSTOM-V1"
        },
        // IMPORTANTE: Use a variável de ambiente. Se estiver testando local, use ngrok.
        callbackUrl: `${process.env.BACKEND_URL}/api/pedidos/callback`
    };
};

// src/controllers/pedidoController.js

const criarAPartirDoCarrinho = async (req, res) => {
    console.log("\n🚀 [DEBUG] Iniciando Checkout (MODO RIGOROSO)...");
    const { id_usuario } = req.body;

    if (!id_usuario) return res.status(400).json({ message: 'Sem ID de usuário.' });

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Busca itens (Agora com a coluna personagem_id garantida)
        const itensCarrinho = await CarrinhoModel.buscarPorSessao(id_usuario);
        
        console.log(`📦 [DEBUG] Itens encontrados: ${itensCarrinho.length}`);
        
        // DEBUG EXTRA: Ver o que veio do banco
        if(itensCarrinho.length > 0) {
            console.log("🔍 [DEBUG] Primeiro item (estrutura):", JSON.stringify(itensCarrinho[0], null, 2));
        }

        if (itensCarrinho.length === 0) {
            throw new Error('Carrinho vazio.'); // Joga para o catch principal
        }
        
        // LOOP DE PROCESSAMENTO
        for (const item of itensCarrinho) {
            
            // VALIDAÇÃO CRÍTICA DO ID
            if (!item.personagem_id) {
                throw new Error(`O item "${item.nome}" não possui um ID de personagem válido.`);
            }

            console.log(`\n🔨 [DEBUG] Processando: ${item.nome} (ID Personagem: ${item.personagem_id})`);
            
            // 2. Cria pedido no banco
            // IMPORTANTE: Usando item.personagem_id agora!
            const novoPedidoId = await PedidoModel.criar(client, id_usuario, item.personagem_id, 'processando');
            console.log(`   -> Pedido criado ID: ${novoPedidoId}`);

            // 3. Monta Payload
            // Certifique-se que sua função montarPayloadIndustrial usa as colunas novas (generonum, etc)
            const requisicaoParaProfessor = montarPayloadIndustrial(item, novoPedidoId);

            // 4. Envia para API Externa
            console.log("   -> 📡 Enviando para fábrica...");
            
            // Se o axios falhar aqui, ele vai explodir o erro e cair no catch lá em baixo (ROLLBACK)
            await axios.post('http://52.72.137.244:3000/queue/items', requisicaoParaProfessor);
                
            console.log(`   -> ✅ Sucesso na fábrica.`);

            // 5. Atualiza status local
            const orderIdExterno = requisicaoParaProfessor.payload.orderId;
            await PedidoModel.atualizarStatus(client, novoPedidoId, 'enviado', orderIdExterno);
        }

        // 6. Se chegou aqui, TODOS deram certo. Limpa o carrinho.
        await CarrinhoModel.limparPorSessao(client, id_usuario);
        
        await client.query('COMMIT');
        console.log("🏁 [DEBUG] SUCESSO TOTAL. Commit realizado.");
        
        res.status(200).json({ mensagem: 'Compra finalizada com sucesso!' });

    } catch (error) {
        // QUALQUER ERRO CAI AQUI E CANCELA TUDO
        await client.query('ROLLBACK');
        
        console.error('❌ [DEBUG] ERRO FATAL - OPERAÇÃO CANCELADA');
        
        // Tenta pegar mensagem de erro da API do professor se existir
        const msgErro = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error('   -> Motivo:', msgErro);

        res.status(500).json({ 
            message: 'Erro ao processar pagamento. Nenhuma cobrança foi feita.',
            detalhe: msgErro
        });
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