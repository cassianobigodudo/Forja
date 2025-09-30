//index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./db'); // <-- 1. Importe a configuração do banco

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//cadastra um usuário no banco
app.post('/usuarios', async(req, res) => {
    const { apelido, email, senha } = req.body;

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

// GET busca dados do usuário pelo id
app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query("SELECT id, apelido, email, senha FROM usuarios WHERE id = $1", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
});

// PATCH atualiza campos do usuário pelo id
app.patch("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const campos = req.body; // Ex.: { apelido: "Novo Apelido" }

  // Gera dinamicamente a query de update
  const chaves = Object.keys(campos);
  if (chaves.length === 0) return res.status(400).json({ erro: "Nenhum campo para atualizar" });

  const valores = Object.values(campos);
  const setString = chaves.map((chave, index) => `${chave} = $${index + 1}`).join(", ");

  try {
    const resultado = await db.query(
      `UPDATE usuarios SET ${setString} WHERE id = $${chaves.length + 1} RETURNING *`,
      [...valores, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
});

// DELETE usuário pelo id
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json({ mensagem: "Usuário excluído com sucesso" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao excluir usuário" });
  }
});

//rota para salvar o pedido no banco de dados
app.post('/pedidos', async (req, res) => {
    const { genero, generonum, corpele, corpelenum, img } = req.body;

    try {
        const result = await db.query(
        `INSERT INTO pedidos (genero, generonum, corpele, corpelenum, img)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
        [genero, generonum, corpele, corpelenum, img]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao salvar personagem no banco.' });
    }

})

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