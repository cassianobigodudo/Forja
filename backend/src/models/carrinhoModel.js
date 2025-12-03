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

// Busca os itens VISUAIS para o carrinho
const buscarPorSessao = async (id_usuario) => {
    console.log(`--- [DEBUG MODEL CARRINHO] Buscando vitrine do carrinho para User: ${id_usuario}`);
    
    // AQUI ESTÁ A MÁGICA DO JOIN:
    // c = tabela carrinho
    // p = tabela personagens
    // Estamos pegando apenas o que importa para a exibição
    const query = `
        SELECT 
            p.id,           -- ID do Personagem (para linkar ou remover depois)
            p.nome,         -- Nome (ex: "Ladino Sombrio")
            p.valor,        -- Preço (ex: 84.90)
            p.img,          -- A foto do rosto
            c.adicionado_em -- Data (opcional, bom para ordenar)
        FROM carrinho c
        INNER JOIN personagens p ON c.personagem_id = p.id
        WHERE c.id_usuario = $1
        ORDER BY c.adicionado_em DESC; 
    `;

    try {
        const { rows } = await db.query(query, [id_usuario]);
        console.log(`--- [DEBUG MODEL] Sucesso. ${rows.length} itens recuperados com dados visuais.`);
        return rows;
    } catch (err) {
        console.error("--- [ERRO MODEL] Falha ao buscar itens visuais:", err.message);
        throw err;
    }
};

const limparUnidade = async (id_usuario, personagem_id) => {
    console.log(`--- [DEBUG MODEL CARRINHO] Executando DELETE para User: ${id_usuario}, Pers: ${personagem_id}`);
    try {
        const result = await db.query(
            'DELETE FROM carrinho WHERE id_usuario = $1 AND personagem_id = $2 LIMIT 1',
            [id_usuario, personagem_id]
        );
        console.log("--- [DEBUG MODEL] DELETE OK. Rows affected:", result.rowCount);
        return result;
    } catch (err) {
        console.error("--- [ERRO MODEL] Falha no DELETE:", err.message);
        throw err;
    }
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