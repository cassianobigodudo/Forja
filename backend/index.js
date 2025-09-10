const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota POST que recebe os dados do seu frontend e envia para o professor
app.post('/enviar-caixa', async (req, res) => {
    
    // 1. Recebe a requisição completa do seu frontend
    const requisicaoCompleta = req.body;
    console.log('--- Requisição recebida do frontend ---');
    console.log(requisicaoCompleta);

    // 2. Extrai o "payload" para encaminhar
    const payloadParaEnviar = requisicaoCompleta.payload;

    if (!payloadParaEnviar) {
        console.error('ERRO: O objeto "payload" não foi encontrado no corpo da requisição.');
        return res.status(400).json({ mensagem: 'Formato da requisição inválido: objeto "payload" ausente.' });
    }

    console.log('>>> Encaminhando payload para o servidor do professor...');

    try {
        // 3. Usa o Axios para fazer a requisição POST, com a URL diretamente na chamada
        const respostaDoProfessor = await axios.post(
            'http://10.28.196.250:8000/api/requisicoes', // URL inserida diretamente aqui
            payloadParaEnviar
        );

        // 4. Se a requisição foi bem-sucedida, loga a resposta e avisa o frontend
        console.log('+++ SUCESSO! Resposta do servidor do professor: +++');
        console.log('Status:', respostaDoProfessor.status);
        console.log('Dados:', respostaDoProfessor.data);

        // Envia uma resposta final de sucesso para o seu frontend
        res.status(200).json({ 
            mensagem: 'Pedido enviado com sucesso para produção!', 
            respostaDoServidor: respostaDoProfessor.data 
        });

    } catch (error) {
        // 5. Se a comunicação com o servidor do professor falhar, captura e loga o erro
        console.error('### FALHA AO COMUNICAR COM O SERVIDOR DO PROFESSOR ###');
        
        if (error.response) {
            console.error('O servidor de destino respondeu com um erro.');
            console.error('Status do erro:', error.response.status);
            console.error('Dados do erro:', error.response.data);
        } else if (error.request) {
            console.error('A requisição foi enviada, mas não houve resposta do servidor de destino.');
        } else {
            console.error('Erro ao configurar a requisição:', error.message);
        }

        // Envia uma resposta de erro para o seu frontend
        res.status(500).json({ mensagem: 'Erro ao encaminhar o pedido para o servidor de produção.' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor principal rodando na porta ${PORT} =)`)
});