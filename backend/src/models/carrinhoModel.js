const db = require('../config/database');

// 1. ADICIONAR (Não muda nada, o id_carrinho_item é gerado sozinho)
const adicionarItem = async (id_usuario, personagem_id) => {
    const result = await db.query(
        'INSERT INTO carrinho (id_usuario, personagem_id) VALUES ($1, $2)',
        [id_usuario, personagem_id]
    );
    return result;
};

// src/models/carrinhoModel.js

const buscarPorSessao = async (id_usuario) => {
    // ATENÇÃO NOS CAMPOS DO SELECT
    const query = `
        SELECT 
            c.id as id_carrinho_item, 
            p.id as personagem_id,      -- <--- ISSO ESTAVA FALTANDO OU COM NOME ERRADO
            p.nome,
            p.valor,
            p.img,
            -- Trazendo os dados numéricos para a Indústria
            p.generonum, p.corpelenum, p.marcasnum,
            p.cabelonum, p.corcabelonum,
            p.acesscabecanum, p.acesspescoconum,
            p.roupacimanum, p.roupacimavariantenum,
            p.armasnum, p.basemininum,
            p.roupabaixonum, p.roupabaixovariantenum,
            p.sapatonum, p.sapatovariantenum
        FROM carrinho_itens c
        JOIN personagens p ON c.id_personagem = p.id
        WHERE c.id_usuario = $1
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