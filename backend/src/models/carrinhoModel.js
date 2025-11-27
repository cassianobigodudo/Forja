const db = require('../config/database');

// Adiciona um item ao carrinho
const adicionarItem = async (id_usuario, personagem_id) => {
    return db.query(
        'INSERT INTO carrinho (id_usuario, personagem_id) VALUES ($1, $2)',
        [id_usuario, personagem_id]
    );
};

// Busca todos os itens do carrinho de uma sessão
const buscarPorSessao = async (id_usuario) => {
    const { rows } = await db.query(`
        SELECT p.id, p.genero, p.corPele, p.img, p.generoNum, p.corPeleNum 
        FROM carrinho c
        JOIN personagens p ON c.personagem_id = p.id
        WHERE c.id_usuario = $1
    `, [id_usuario]);
    return rows;
};

// Limpa o carrinho de uma sessão (será usado pelo controller de Pedidos)
const limparPorSessao = async (client, id_usuario) => {
    // Usamos o 'client' da transação para garantir consistência
    return client.query('DELETE FROM carrinho WHERE id_usuario = $1', [id_usuario]);
};

module.exports = {
    adicionarItem,
    buscarPorSessao,
    limparPorSessao,
};