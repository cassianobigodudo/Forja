const db = require('../config/database');

// 1. ADICIONAR (Não muda nada, o id_carrinho_item é gerado sozinho)
const adicionarItem = async (id_usuario, personagem_id) => {
    const result = await db.query(
        'INSERT INTO carrinho (id_usuario, personagem_id) VALUES ($1, $2)',
        [id_usuario, personagem_id]
    );
    return result;
};

const buscarPorSessao = async (id_usuario) => {
    const query = `
        SELECT 
            c.id_carrinho_item,   -- PK correta da tabela carrinho
            c.personagem_id,      -- FK correta (antes eu chamei de id_personagem)
            
            -- Dados da tabela personagens (Join)
            p.id as id_original_personagem,
            p.nome,
            p.valor,
            p.img,
            p.historia,
            
            -- DADOS INDUSTRIAIS (Necessários para a máquina)
            p.generonum, 
            p.corpelenum, 
            p.marcasnum,
            p.cabelonum, 
            p.corcabelonum,
            p.acesscabecanum, 
            p.acesspescoconum,
            p.roupacimanum, 
            p.roupacimavariantenum,
            p.armasnum, 
            p.basemininum,
            p.roupabaixonum, 
            p.roupabaixovariantenum,
            p.sapatonum, 
            p.sapatovariantenum

        FROM carrinho c -- Assumindo que o nome da tabela é 'carrinho'
        JOIN personagens p ON c.personagem_id = p.id
        WHERE c.id_usuario = $1
    `;
    
    try {
        const { rows } = await db.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        console.error("Erro no SQL do Carrinho:", error.message);
        throw error;
    }
};

const limparPorSessao = async (client, id_usuario) => {
    const executor = client || db;
    // Ajustado para o nome da tabela 'carrinho'
    await executor.query('DELETE FROM carrinho WHERE id_usuario = $1', [id_usuario]);
};

// 3. REMOVER (Muito mais simples e seguro)
const limparUnidade = async (id_carrinho_item) => {
    // Deleta baseado apenas na chave primária da linha do carrinho
    const query = 'DELETE FROM carrinho WHERE id_carrinho_item = $1';
    
    const result = await db.query(query, [id_carrinho_item]);
    return result;
};
module.exports = {
    adicionarItem,
    buscarPorSessao,
    limparUnidade,
    limparPorSessao
};