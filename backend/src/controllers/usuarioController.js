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
    try {
        await UsuarioModel.removerUsuario(id_usuario);
        res.status(200).json({ message: "Usuário removido com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao remover usuário." });
    }
};

module.exports = { 
cadastrar, 
login,
adicionarCartao,
deletarConta
};