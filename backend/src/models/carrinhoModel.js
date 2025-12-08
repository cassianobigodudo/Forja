const db = require('../config/database');

// 1. ADICIONAR (Não muda nada, o id_carrinho_item é gerado sozinho)
const adicionarItem = async (id_usuario, personagem_id) => {
    const result = await db.query(
        'INSERT INTO carrinho (id_usuario, personagem_id) VALUES ($1, $2)',
        [id_usuario, personagem_id]
    );
    return result;
};

// 2. BUSCAR (Agora traz o id_carrinho_item)
const buscarPorSessao = async (id_usuario) => {
    const query = `
        SELECT 
            c.id_carrinho_item, -- O NOVO ID ÚNICO
            p.id AS personagem_id,
            p.nome, 
            p.valor, 
            p.img
        FROM carrinho c
        INNER JOIN personagens p ON c.personagem_id = p.id
        WHERE c.id_usuario = $1
        ORDER BY c.adicionado_em DESC
    `;
    const { rows } = await db.query(query, [id_usuario]);
    return rows;
};

// 3. REMOVER (Muito mais simples e seguro)
const limparUnidade = async (id_carrinho_item) => {
    // Deleta baseado apenas na chave primária da linha do carrinho
    const query = 'DELETE FROM carrinho WHERE id_carrinho_item = $1';
    
    const result = await db.query(query, [id_carrinho_item]);
    return result;
};

// Limpa o carrinho de uma sessão (será usado pelo controller de Pedidos)
const limparPorSessao = async (client, id_usuario) => {
    console.log(`--- [DEBUG MODEL CARRINHO] Executando DELETE para User: ${id_usuario}`);
    // Usamos o 'client' da transação para garantir consistência
    // Nota: Se 'client' não for passado (uso fora de transação), isso vai quebrar.
    // Se for usar sem transação, use db.query direto.
    if (client) {
         return client.query('DELETE FROM carrinho WHERE id_usuario = $1', [id_usuario]);
    } else {
         console.warn("--- [AVISO MODEL] limparPorSessao chamado sem client de transação. Usando db pool.");
         return db.query('DELETE FROM carrinho WHERE id_usuario = $1', [id_usuario]);
    }
};

module.exports = {
    adicionarItem,
    buscarPorSessao,
    limparUnidade,
    limparPorSessao
};