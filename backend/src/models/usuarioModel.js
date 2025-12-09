
const db = require('../config/database');

const criarUsuario = async (nome, email, senha) => {
    const result = await db.query(
        `INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario)
         VALUES ($1, $2, $3)
         RETURNING id_usuario, nome_usuario, email_usuario`,
        [nome, email, senha]
    );
    return result.rows[0];
};

const buscarEmail = async (email) => {
    const result = await db.query(
        `SELECT id_usuario, nome_usuario, email_usuario, senha_usuario
        FROM usuarios
        WHERE email_usuario = $1`,
        [email]
    );
    return result.rows[0]
}

const salvarCartao = async (id_usuario, numero, nome, validade, cvv) => {
    const query = `
        INSERT INTO cartoes_credito (id_usuario, numero_cartao, nome_titular, validade, cvv)
        VALUES ($1, $2, $3, $4, $5)
    `;
    return db.query(query, [id_usuario, numero, nome, validade, cvv]);
};

const removerUsuario = async (id_usuario) => {
    // Apaga os dados relacionados primeiro (ordem importa!)
    await db.query("DELETE FROM enderecos WHERE id_usuario = $1", [id_usuario]);
    await db.query("DELETE FROM carrinho WHERE id_usuario = $1", [id_usuario]);
    
    // CUIDADO: Ao apagar pedidos, você perde histórico financeiro.
    // O ideal seria apenas desativar o usuário (soft delete).
    // Mas para o trabalho acadêmico, vamos apagar tudo:
    
    // Precisamos apagar os itens de expedição antes dos pedidos
    await db.query(`
        UPDATE expedicao_slots SET status = 'livre', pedido_id = NULL 
        WHERE pedido_id IN (SELECT id FROM pedidos WHERE id_usuario = $1)
    `, [id_usuario]);

    await db.query("DELETE FROM pedidos WHERE id_usuario = $1", [id_usuario]);
    
    // Personagens também
    await db.query("DELETE FROM personagens WHERE id_usuario = $1", [id_usuario]);

    // Finalmente, apaga o usuário
    return db.query("DELETE FROM usuarios WHERE id_usuario = $1", [id_usuario]);
}
// Exportamos a função para que o Controller possa usá-la
module.exports = {
    criarUsuario,
    buscarEmail,
    salvarCartao,
    removerUsuario
};