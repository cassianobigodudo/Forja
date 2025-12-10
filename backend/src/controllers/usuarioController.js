const UsuarioModel = require('../models/usuarioModel');

const cadastrar = async (req, res) => {
    console.log("--- [DEBUG] INICIO DO CADASTRO ---");
    console.log("1. Dados recebidos:", req.body);

    const { nome, email, senha } = req.body;

    try {
        console.log("2. Chamando UsuarioModel.buscarPorEmail...");
        
        // O código provavelmente vai travar AQUI 👇
        const usuarioExistente = await UsuarioModel.buscarEmail(email);
        
        console.log("3. Busca retornou:", usuarioExistente);

        if (usuarioExistente) {
            console.log("4. Usuário já existe. Retornando 409.");
            return res.status(409).json({ 
                message: "Este email já está cadastrado no sistema." 
            });
        }

        console.log("5. Usuário não existe. Tentando criar...");
        const novoUsuario = await UsuarioModel.criarUsuario(nome, email, senha);
        
        console.log("6. Usuário criado com sucesso:", novoUsuario);
        res.status(201).json(novoUsuario);

    } catch (error) {
        console.error("--- [ERRO] NO CONTROLLER ---");
        console.error(error); // Isso VAI aparecer no log se der erro
        res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }
};

const login = async(req, res) =>{
    const { email, senha } = req.body
    try {
        const usuario = await UsuarioModel.buscarEmail(email)
        if (!usuario){
            return res.status(404).json({
                message: "Usuário não encontrado."
            })
        }
        if (usuario.senha_usuario != senha){
            return res.status(401).json({
                message: "Senha Incorreta"
            })
        }

        res.status(200).json({
            message: "Login realizado com sucesso!",
            id_usuario: usuario.id_usuario,
            nome_usuario: usuario.nome_usuario
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor ao fazer login." });  
    }

}

const adicionarCartao = async (req, res) => {
    const { id_usuario, numero_cartao, nome_titular, validade, cvv } = req.body;
    
    try {
        // Aqui chamamos o Model (veja abaixo)
        await UsuarioModel.salvarCartao(id_usuario, numero_cartao, nome_titular, validade, cvv);
        res.status(201).json({ message: "Cartão vinculado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao salvar cartão." });
    }
};

const deletarConta = async (req, res) => {
    const { id_usuario } = req.params;

    console.log(`\n🗑️ [DELETE REQUEST] Recebido pedido para apagar usuário ID: ${id_usuario}`);

    try {
        // Verifica se o ID veio
        if (!id_usuario || id_usuario === 'undefined') {
            console.log("❌ [ERRO] ID do usuário inválido ou indefinido.");
            return res.status(400).json({ message: "ID inválido." });
        }

        console.log("➡️ [MODEL] Chamando UsuarioModel.removerUsuario...");
        const resultado = await UsuarioModel.removerUsuario(id_usuario);
        
        console.log("✅ [SUCESSO] Usuário removido. Linhas afetadas:", resultado.rowCount);
        
        if (resultado.rowCount === 0) {
            console.warn("⚠️ [AVISO] O comando rodou, mas nenhum usuário foi encontrado com esse ID.");
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({ message: "Usuário removido com sucesso." });

    } catch (error) {
        console.error("❌ [ERRO FATAL NO DELETE]:");
        console.error("   -> Mensagem:", error.message);
        console.error("   -> Código SQL:", error.code); // Importante para saber se é Foreign Key
        console.error("   -> Detalhe:", error.detail);
        
        // Retorna o erro detalhado para o frontend (ajuda no debug)
        res.status(500).json({ 
            message: "Erro ao remover usuário.", 
            debug_erro: error.message,
            sql_code: error.code 
        });
    }
};

const editarDados = async (req, res) => {
    const { id_usuario } = req.params;
    const { nome, email, senha, img } = req.body; // Campos vindos do React

    try {
        let dadosParaUpdate = {};

        // Tradutor: Frontend -> Banco de Dados
        if (nome) dadosParaUpdate.nome_usuario = nome;
        if (email) dadosParaUpdate.email_usuario = email;
        if (senha) dadosParaUpdate.senha_usuario = senha; // Ideal seria criptografar aqui
        if (img) dadosParaUpdate.img = img;

        if (Object.keys(dadosParaUpdate).length === 0) {
            return res.status(400).json({ message: "Nenhum dado enviado para atualização." });
        }

        const usuarioAtualizado = await UsuarioModel.atualizarUsuario(id_usuario, dadosParaUpdate);

        if (!usuarioAtualizado) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({
            message: "Dados atualizados com sucesso!",
            usuario: {
                nome: usuarioAtualizado.nome_usuario,
                email: usuarioAtualizado.email_usuario
                // Não devolvemos a senha por segurança
            }
        });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: "Erro interno ao atualizar dados." });
    }
};

const obterDadosUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const usuario = await UsuarioModel.buscarPorId(id_usuario);
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }   
        res.status(200).json(usuario);
    } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
        res.status(500).json({ message: "Erro interno ao obter dados do usuário." });
    }
};

module.exports = { 
obterDadosUsuario,
cadastrar, 
login,
adicionarCartao,
deletarConta,
editarDados
};