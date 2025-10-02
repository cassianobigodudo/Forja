//index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./db'); // <-- 1. Importe a configuração do banco

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//rota para cadastrar um usuário
app.post('/usuarios', async(req, res) => {
    const { apelido, email, senha, confirmarSenha } = req.body;

    // 👇 Log dos dados recebidos do Thunder Client / frontend
    console.log('📥 Dados recebidos no cadastro de usuário:', req.body);

    // 🔒 Validação: senha e confirmarSenha precisam ser iguais
    if (senha !== confirmarSenha) {
        return res.status(400).json({
            message: "As senhas não coincidem!"
        });
    }

    try {
        const result = await db.query(
            `INSERT INTO usuarios (apelido, email, senha)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [apelido, email, senha]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Erro ao cadastro o usuário!!!"
        })
        
    }
});

//rota para salvar o personagem no banco de dados
app.post('/personagens', async (req, res) => {
    const { session_id, ...personagemData } = req.body;
    if (!session_id) {
        return res.status(400).json({ message: 'ID de sessão é obrigatório.' });
    }

    const { genero, generoNum, corPele, corPeleNum, img /* etc */ } = personagemData;

    try {
        const result = await db.query(
            `INSERT INTO personagens (session_id, genero, generoNum, corPele, corPeleNum, img /* etc */)
             VALUES ($1, $2, $3, $4, $5, $6 /* etc */) RETURNING *;`,
            [session_id, genero, generoNum, corPele, corPeleNum, img /* etc */]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao salvar personagem.' });
    }
});

app.post('/carrinho', async (req, res) => {
    const { session_id, personagem_id } = req.body;
    if (!session_id || !personagem_id) {
        return res.status(400).json({ message: 'ID de sessão e ID do personagem são obrigatórios.' });
    }

    try {
        await db.query(
            'INSERT INTO carrinho (session_id, personagem_id) VALUES ($1, $2)',
            [session_id, personagem_id]
        );
        res.status(201).json({ message: 'Personagem adicionado ao carrinho!' });
    } catch (error) {
        if (error.code === '23505') { // Item duplicado
            return res.status(409).json({ message: 'Este personagem já está no seu carrinho.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar ao carrinho.' });
    }
});

// A única rota necessária para finalizar o pedido.
app.post('/finalizar-compra', async (req, res) => {
    const { session_id } = req.body;
    console.log ('ID da sessão: ', session_id)
    if (!session_id) {
        return res.status(400).json({ message: 'ID de sessão é obrigatório.' });
    }

    const client = await db.pool.connect();
    const resultados = { sucessos: [], falhas: [] };

    try {
        await client.query('BEGIN'); // Inicia a transação

        // 1. Pega os IDs dos personagens no carrinho da sessão.
        const { rows: itensCarrinho } = await client.query(
            'SELECT personagem_id FROM carrinho WHERE session_id = $1',
            [session_id]
        );

        if (itensCarrinho.length === 0) {
            return res.status(400).json({ message: 'Seu carrinho está vazio.' });
        }

        console.log(`--- Iniciando finalização de ${itensCarrinho.length} item(ns) para a sessão ${session_id} ---`);

        // 2. Passa por cada item do carrinho, um por um.
        for (const item of itensCarrinho) {
            const personagemId = item.personagem_id;
            console.log('id do personagem, ', personagemId)
            let novoPedidoId = null; // Variável para guardar o ID do pedido que vamos criar

            try {
                // 2a. Busca os dados do personagem para a "tradução".
                const resPersonagem = await client.query(
                    'SELECT generoNum, corPeleNum FROM personagens WHERE id = $1',
                    [personagemId]
                );
                const dadosPersonagem = resPersonagem.rows[0];
                console.log('Dados do personagem, ', dadosPersonagem)
                console.log('Dados do personagem, ', dadosPersonagem)

                if (!dadosPersonagem) {
                    throw new Error(`Personagem com ID ${personagemId} não encontrado.`);
                }
                
                // 2b. Cria o registro do pedido na tabela 'pedidos' e já pega o ID gerado.
                //     O status inicial pode ser 'processando'.
                const resPedido = await client.query(
                    `INSERT INTO pedidos (session_id, personagem_id, status)
                     VALUES ($1, $2, 'processando') RETURNING id`,
                    [session_id, personagemId]
                );
                novoPedidoId = resPedido.rows[0].id;
                
                // 2c. "Traduz" para o formato da "caixa".
                const orderIdExterno = `pedido-forja-${novoPedidoId}`;
                const requisicaoParaProfessor = {
                    payload: {
                        orderId: orderIdExterno,
                        order: {
                            codigoProduto: 1,
                            bloco1: { cor: 1, lamina1: 1, lamina2: 1, lamina3: 1, padrao1: "1", padrao2: "1", padrao3: "1" },
                            bloco2: { cor: 1, lamina1: 1, lamina2: 1, lamina3: 1, padrao1: "1", padrao2: "1", padrao3: "1" },
                            bloco3: {
                                "cor": dadosPersonagem.generonum,
                                "lamina1": 1,
                                "lamina2": dadosPersonagem.corpelenum,
                                "lamina3": 1,
                                "padrao1": "1", "padrao2": "1", "padrao3": "1"
                            }
                        },
                        sku: "KIT-01"
                    },
                    callbackUrl: "http://localhost:3333/callback"
                };

                // 2d. Envia para o servidor do professor.
                await axios.post('http://52.1.197.112:3000/queue/items', requisicaoParaProfessor);
                
                // 2e. Se tudo deu certo, atualiza o status final para 'enviado'.
                await client.query(
                  "UPDATE pedidos SET status = 'enviado', orderId_externo = $2 WHERE id = $1",
                  [novoPedidoId, orderIdExterno]
                );

                console.log(`+++ SUCESSO! Pedido ${novoPedidoId} (personagem ${personagemId}) enviado.`);
                resultados.sucessos.push(novoPedidoId);

            } catch (error) {
                console.error(`### FALHA ao processar o personagem ${personagemId}: ${error.message}`);
                resultados.falhas.push({ personagemId, erro: error.message });
                
                // Se o pedido chegou a ser criado, atualiza seu status para 'falha'.
                if (novoPedidoId) {
                    await client.query("UPDATE pedidos SET status = 'falha_envio' WHERE id = $1", [novoPedidoId]);
                }
            }
        }

        // 3. Limpa o carrinho da sessão.
        await client.query('DELETE FROM carrinho WHERE session_id = $1', [session_id]);

        await client.query('COMMIT'); // 4. Confirma todas as operações bem-sucedidas no banco.

        res.status(200).json({
            mensagem: 'Finalização de compra processada.',
            ...resultados
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Desfaz tudo se um erro grave acontecer
        console.error('### ERRO GERAL NA TRANSAÇÃO ###', error);
        res.status(500).json({ message: 'Ocorreu um erro grave ao finalizar a compra.' });
    } finally {
        client.release();
    }
});

app.get('/carrinho/:session_id', async (req, res) => {
    const { session_id } = req.params;

    try {
        const { rows } = await db.query(`
            SELECT p.id, p.genero, p.corPele, p.img 
            FROM carrinho c
            JOIN personagens p ON c.personagem_id = p.id
            WHERE c.session_id = $1
        `, [session_id]);
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
        res.status(500).json({ message: 'Erro ao buscar carrinho.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor principal rodando na porta ${PORT} =)`)
});