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
    // AQUI ESTAVA O PROBLEMA: A formatação das vírgulas tem que ser perfeita
    const query = `
        SELECT 
            c.id as id_carrinho_item, 
            p.id as personagem_id,
            p.nome,
            p.valor,
            p.img,
            p.historia, -- Adicionei caso queira mostrar resumo no carrinho
            
            -- DADOS INDUSTRIAIS (Verifique se os nomes batem com suas colunas no banco)
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

        FROM carrinho_itens c
        JOIN personagens p ON c.id_personagem = p.id
        WHERE c.id_usuario = $1
    `;
    
    try {
        const { rows } = await db.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        console.error("Erro no SQL do Carrinho:", error.message);
        throw error; // Joga o erro para o controller saber que falhou
    }
};

const limparPorSessao = async (client, id_usuario) => {
    // Se passar 'client' (transação), usa ele. Se não, usa o pool direto.
    const executor = client || db;
    await executor.query('DELETE FROM carrinho_itens WHERE id_usuario = $1', [id_usuario]);
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