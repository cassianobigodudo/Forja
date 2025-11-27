const db = require('../config/database');

const criar = async (personagemData) => {
    const { id_usuario, genero, generoNum, corPele, corPeleNum, img } = personagemData;
    const result = await db.query(
        `INSERT INTO personagens (id_usuario, genero, generoNum, corPele, corPeleNum, img)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [id_usuario, genero, generoNum, corPele, corPeleNum, img]
    );
    return result.rows[0];
};

const buscar = async () => {
    console.log("--- [DEBUG MODEL] Iniciando busca no banco de dados...");
    
    try {
        // Query para verificar se o usuario 5 tem itens
        const result = await db.query(`SELECT * FROM personagens WHERE id_usuario = 5;`);
        
        console.log(`--- [DEBUG MODEL] Query Sucesso. Itens encontrados: ${result.rows.length}`);
        
        if (result.rows.length === 0) {
            console.warn("--- [AVISO MODEL] A busca retornou 0 itens. Verifique se o id_usuario 5 tem personagens na tabela.");
        }

        return result.rows;
    } catch (error) {
        console.error("--- [ERRO MODEL] Falha na query SQL:", error);
        throw error; // Joga o erro para o controller pegar
    }
}

module.exports = {
    criar,
    buscar
};