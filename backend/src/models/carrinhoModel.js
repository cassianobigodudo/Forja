const db = require('../config/database');

// Adiciona um item ao carrinho
const adicionarItem = async (usuario_id, personagem_id) => {
    return db.query(
        'INSERT INTO carrinho (usuario_id, personagem_id) VALUES ($1, $2)',
        [usuario_id, personagem_id]
    );
};

// Busca todos os itens do carrinho de uma sessão
const buscarPorSessao = async (usuario_id) => {
    const { rows } = await db.query(`
        SELECT p.id, p.genero, p.corPele, p.img, p.generoNum, p.corPeleNum 
        FROM carrinho c
        JOIN personagens p ON c.personagem_id = p.id
        WHERE c.usuario_id = $1
    `, [usuario_id]);
    return rows;
};

// Limpa o carrinho de uma sessão (será usado pelo controller de Pedidos)
const limparPorSessao = async (client, usuario_id) => {
    // Usamos o 'client' da transação para garantir consistência
    return client.query('DELETE FROM carrinho WHERE usuario_id = $1', [usuario_id]);
};

module.exports = {
    adicionarItem,
    buscarPorSessao,
    limparPorSessao,
};