const db = require('../config/database');

// Adiciona um item ao carrinho
const adicionarItem = async (session_id, personagem_id) => {
    return db.query(
        'INSERT INTO carrinho (session_id, personagem_id) VALUES ($1, $2)',
        [session_id, personagem_id]
    );
};

// Busca todos os itens do carrinho de uma sessão
const buscarPorSessao = async (session_id) => {
    const { rows } = await db.query(`
        SELECT p.id, p.genero, p.corPele, p.img, p.generoNum, p.corPeleNum 
        FROM carrinho c
        JOIN personagens p ON c.personagem_id = p.id
        WHERE c.session_id = $1
    `, [session_id]);
    return rows;
};

// Limpa o carrinho de uma sessão (será usado pelo controller de Pedidos)
const limparPorSessao = async (client, session_id) => {
    // Usamos o 'client' da transação para garantir consistência
    return client.query('DELETE FROM carrinho WHERE session_id = $1', [session_id]);
};

module.exports = {
    adicionarItem,
    buscarPorSessao,
    limparPorSessao,
};