const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./db'); // <-- 1. Importe a configuração do banco

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/enviar-caixa', async (req, res) => {
    
    const requisicaoCompleta = req.body;
    console.log('--- Requisição completa recebida do frontend ---');
    console.log(JSON.stringify(requisicaoCompleta, null, 2));

    // 1. CORREÇÃO: Desestruturamos 'payload' E 'callbackUrl' DIRETAMENTE do corpo da requisição.
    const { payload, callbackUrl } = requisicaoCompleta;

    // 2. CORREÇÃO: A validação agora checa 'callbackUrl' no nível correto e os campos dentro de 'payload'.
    if (!payload || !callbackUrl || !payload.orderId || !payload.order) {
        console.error('ERRO: Requisição inválida. Campos obrigatórios: payload, callbackUrl, payload.orderId, payload.order.');
        return res.status(400).json({ mensagem: 'Formato da requisição inválido.' });
    }

    try {
        // --- LÓGICA DO BANCO DE DADOS ---
        const insertQuery = `
            INSERT INTO pedidos(order_id, dados_do_pedido, callback_url)
            VALUES($1, $2, $3)
            RETURNING id;
        `;
        
        // 3. CORREÇÃO: O array de valores usa a variável 'callbackUrl' que acabamos de extrair.
        const values = [
            payload.orderId,    // Para $1
            payload.order,      // Para $2
            callbackUrl         // Para $3
        ];

        console.log('>>> Valores que serão inseridos no banco de dados:');
        console.log(values);
        
        const result = await db.query(insertQuery, values);
        console.log(`+++ SUCESSO! Pedido salvo no banco de dados com o ID: ${result.rows[0].id} +++`);

        // --- FIM DA LÓGICA DO BANCO DE DADOS ---

        // O encaminhamento para o servidor do professor já estava correto,
        // pois ele envia a 'requisicaoCompleta' original.
        console.log('>>> Encaminhando a requisição completa para o servidor do professor...');
        
        const respostaDoProfessor = await axios.post(
            'http://52.1.197.112:3000/queue/items',
            requisicaoCompleta
        );

        console.log('+++ SUCESSO! Resposta do servidor do professor: +++');
        console.log('Status:', respostaDoProfessor.status);
        console.log('Dados:', respostaDoProfessor.data);

        res.status(200).json({ 
            mensagem: 'Pedido salvo e enviado com sucesso!', 
            respostaDoServidor: respostaDoProfessor.data 
        });

    } catch (error) {
        // Bloco de tratamento de erro (sem alterações)
        console.error('### FALHA NA OPERAÇÃO ###');
        
        if (error.response) {
            console.error('O servidor de destino respondeu com um erro.');
            console.error('Status do erro:', error.response.status);
            console.error('Dados do erro:', error.response.data);
            res.status(500).json({ mensagem: 'Erro ao encaminhar o pedido para o servidor de produção.' });
        
        } else if (error.code) { 
            console.error('Erro no banco de dados:', error.message);
            if (error.code === '23505') {
                 return res.status(409).json({ mensagem: `Erro: O order_id '${payload.orderId}' já existe no banco de dados.` });
            }
            res.status(500).json({ mensagem: 'Erro ao salvar o pedido no banco de dados.' });
        } else {
            console.error('Erro desconhecido:', error.message);
            res.status(500).json({ mensagem: 'Ocorreu um erro inesperado.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor principal rodando na porta ${PORT} =)`)
});