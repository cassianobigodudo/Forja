const EnderecoModel = require('../models/enderecoModel');

const adicionarEndereco = async (req, res) => {
    try {
        const { id_usuario, cep, rua, numero, bairro, cidade, uf } = req.body;

        // Validação básica
        if (!id_usuario || !cep || !rua || !cidade || !uf) {
            return res.status(400).json({ message: "Dados obrigatórios faltando." });
        }

        const novoEndereco = await EnderecoModel.criar(req.body);

        res.status(201).json({ 
            message: "Endereço cadastrado com sucesso!", 
            endereco: novoEndereco 
        });

    } catch (error) {
        console.error("Erro ao cadastrar endereço:", error);
        res.status(500).json({ message: "Erro interno ao salvar endereço." });
    }
};

const buscarPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const enderecos = await EnderecoModel.listarPorUsuario(id_usuario);
        res.status(200).json(enderecos);
    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        res.status(500).json({ message: "Erro ao buscar endereços." });
    }
};

module.exports = {
    adicionarEndereco,
    buscarPorUsuario
};