const UsuarioModel = require('../models/usuarioModel');

const criarUsuario = async (req, res) => {
    const { apelido, email, senha, confirmarSenha } = req.body;

    if (senha !== confirmarSenha) {
        return res.status(400).json({ message: "As senhas não coincidem!" });
    }

    try {
        const novoUsuario = await UsuarioModel.criar(apelido, email, senha);
        res.status(201).json(novoUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao cadastrar o usuário!!!" });
    }
};

module.exports = {
    criarUsuario,
};