const UsuarioModel = require('../models/usuarioModel');

const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const usuarioExistente = await UsuarioModel.buscarEmail(email)
        if (usuarioExistente){
            return res.status(409).json({
                message: "Esse email já está cadastrado."
            })
        }
        const novoUsuario = await UsuarioModel.criarUsuario(nome, email, senha)
        res.status(201).json(novoUsuario)
        
    } catch (error) {
        console.error(error);
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

module.exports = { 
cadastrar, 
login 
};