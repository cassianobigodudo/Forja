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

//rota para salvar o pedido no banco de dados
app.post('/pedidos', async (req, res) => {
    const { genero, generoNum, corPele, corPeleNum, img } = req.body;
    console.log ('requisição ', req.body)

    try {
        const result = await db.query(
        `INSERT INTO pedidos (genero, generoNum, corPele, corPeleNum, img)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
        [genero, generoNum, corPele, corPeleNum, img]
        );
        res.status(201).json(result.rows[0]);
        console.log('Personagem salvo no banco de dados com sucesso!!')
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao salvar personagem no banco.' });
    }

})

app.post('/enviar-pedidos-pendentes', async (req, res) => {
    console.log('--- Iniciando envio em lote de todos os pedidos pendentes ---');

    try {
        // 1. Buscar todos os pedidos que ainda não foram enviados.
        const { rows: pedidosPendentes } = await db.query(
            "SELECT id, generoNum, corPeleNum FROM pedidos WHERE status = 'pendente'"
        );

        if (pedidosPendentes.length === 0) {
            console.log('>>> Nenhum pedido pendente para enviar.');
            return res.status(200).json({ mensagem: 'Nenhum pedido pendente para enviar.' });
        }

        console.log(`>>> Encontrados ${pedidosPendentes.length} pedidos para enviar.`);

        const resultados = {
            sucessos: [],
            falhas: []
        };

        // 2. Passar por cada pedido pendente, um por um.
        for (const pedido of pedidosPendentes) {
            const pedidoId = pedido.id;
            try {
                // 3. Montar o payload para cada pedido.
                const requisicaoParaProfessor = {
                    payload: {
                        orderId: `pedido-forja-${pedidoId}`,
                        order: {
                            codigoProduto: 1,
                            bloco1: { cor: 1, lamina1: 1, lamina2: 1, lamina3: 1, padrao1: "1", padrao2: "1", padrao3: "1" },
                            bloco2: { cor: 1, lamina1: 1, lamina2: 1, lamina3: 1, padrao1: "1", padrao2: "1", padrao3: "1" },
                            bloco3: {
                                "cor": pedido.generonum,
                                "lamina1": 1,
                                "lamina2": pedido.corpelenum,
                                "lamina3": 1,
                                "padrao1": "1",
                                "padrao2": "1",
                                "padrao3": "1"
                            }
                        },
                        sku: "KIT-01"
                    },
                    callbackUrl: "http://localhost:3333/callback"
                };

                // 4. Enviar para o servidor do professor.
                await axios.post('http://52.1.197.112:3000/queue/items', requisicaoParaProfessor);
                
                // 5. Se o envio deu certo, ATUALIZAR o status no banco.
                await db.query("UPDATE pedidos SET status = 'enviado' WHERE id = $1", [pedidoId]);
                
                console.log(`+++ SUCESSO! Pedido ${pedidoId} enviado e status atualizado.`);
                resultados.sucessos.push(pedidoId);

            } catch (error) {
                console.error(`### FALHA ao processar o pedido ${pedidoId}: ${error.message}`);
                resultados.falhas.push({ pedidoId, erro: error.message });
            }
        }

        // 6. Enviar uma resposta final para o frontend.
        res.status(200).json({
            mensagem: 'Processamento de pedidos pendentes finalizado.',
            ...resultados
        });

    } catch (dbError) {
        console.error('### FALHA GERAL: Erro ao consultar o banco de dados ###', dbError);
        res.status(500).json({ mensagem: 'Ocorreu um erro grave ao processar os pedidos.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor principal rodando na porta ${PORT} =)`)
});