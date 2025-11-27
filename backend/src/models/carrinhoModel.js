const db = require('../config/database');

// Adiciona um item ao carrinho
const adicionarItem = async (id_usuario, personagem_id) => {
    console.log(`--- [DEBUG MODEL CARRINHO] Executando INSERT. User: ${id_usuario}, Pers: ${personagem_id}`);
    try {
        const result = await db.query(
            'INSERT INTO carrinho (id_usuario, personagem_id) VALUES ($1, $2)',
            [id_usuario, personagem_id]
        );
        console.log("--- [DEBUG MODEL] INSERT OK. Rows affected:", result.rowCount);
        return result;
    } catch (err) {
        console.error("--- [ERRO MODEL] Falha no INSERT:", err.message);
        throw err; // Joga o erro de volta pro controller tratar (como o erro 23505)
    }
};

// Busca todos os itens do carrinho de uma sessão
const buscarPorSessao = async (id_usuario) => {
    console.log(`--- [DEBUG MODEL CARRINHO] Executando SELECT JOIN para User: ${id_usuario}`);
    
    const { rows } = await db.query(`
        SELECT p.id, p.genero, p.corPele, p.img, p.generoNum, p.corPeleNum 
        FROM carrinho c
        JOIN personagens p ON c.personagem_id = p.id
        WHERE c.id_usuario = $1
    `, [id_usuario]);

    console.log(`--- [DEBUG MODEL] SELECT OK. Itens encontrados: ${rows.length}`);
    return rows;
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
    limparPorSessao,
};