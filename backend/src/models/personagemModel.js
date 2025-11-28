// src/models/personagemModel.js
const db = require('../config/database');

const criar = async (dados) => {
    // 1. Prepara os dados para caberem nas colunas do banco
    // O Hook manda camelCase (ex: generoNum), o banco quer lowercase (ex: generonum)
    
    // Tratamento especial para Acessórios (Array -> String)
    // O banco é VARCHAR(50), então tentamos salvar o principal ou juntar nomes curtos
    const acessCabecaString = Array.isArray(dados.acessoriosCabeca) 
        ? dados.acessoriosCabeca.join(',') 
        : dados.acessoriosCabeca || '';

    const values = [
        dados.usuario_id,         // $1: id_usuario
        dados.img,                // $2: img
        dados.nome || 'Sem Nome', // $3: nome (Vem da tela de história)
        
        // Gênero
        dados.genero,             // $4
        dados.generoNum,          // $5
        
        // Pele
        dados.corPele,            // $6
        dados.corPeleNum,         // $7
        
        // Cabelo
        dados.cabelo,             // $8
        dados.cabeloNum,          // $9
        dados.corCabelo,          // $10
        parseInt(dados.corCabeloNum) || 0, // $11 (Garante Inteiro)

        // Marcas
        dados.marcas,             // $12
        parseInt(dados.marcaspadrao) || 0, // $13 (Mapeando padrao para num)

        // Acessórios Cabeça
        acessCabecaString.slice(0, 50), // $14 (Corta para não estourar VARCHAR 50)
        dados.acessCabeca,        // $15 (Número da base)

        // Pescoço
        dados.acessorioPescoco,   // $16
        dados.acessPescocoNum,    // $17

        // Roupa Cima (Torso)
        dados.roupaCima,          // $18
        dados.roupaCimaCorNum,    // $19 (Salva a COR do bloco)
        dados.roupaCimaVariante,  // $20
        parseInt(dados.roupaCimaVarPadrao) || 0, // $21 (Salva o padrão da variante)

        // Roupa Baixo (Pernas)
        dados.roupaBaixo,         // $22
        dados.roupaBaixoCorNum,   // $23
        dados.roupaBaixoVariante, // $24
        parseInt(dados.roupaBaixoVarPadrao) || 0, // $25

        // Sapato
        dados.sapato,             // $26
        dados.sapatoCorNum,       // $27
        dados.sapatoVariante,     // $28
        parseInt(dados.sapatoVarPadrao) || 0, // $29

        // Armas
        dados.armas,              // $30
        dados.armasCorNum || 7,   // $31 (7 = Nula se não tiver arma)

        // Base da Miniatura (Se não tiver no hook, usa padrão)
        dados.baseMini || 'Padrao', // $32
        1,                          // $33 (Número da base padrão)
        
        dados.historia || ''      // $34
    ];

    // ============================================================
    // 🔍 DEBUGGER VIZINHO: CHECKPOINT 3 (MODEL SQL)
    // ============================================================
    console.log("🛠️ PREPARANDO INSERT SQL:");

    const debugSQL = {
        'GENERO_NUM': values[4],
        'PELE_NUM': values[6],
        'CABELO_NUM': values[8],
        'COR_CABELO_NUM': values[10],
        
        'MARCAS_NUM': values[12],
        'ACESS_CABECA_NUM': values[14], // Base (Capacete, etc)
        'ACESS_PESCOCO_NUM': values[16],

        'ROUPA_CIMA_COR': values[18],
        'ROUPA_BAIXO_COR': values[22],
        'SAPATO_COR': values[26],
        'ARMA_COR': values[30]
    };

    console.log("🛠️ VALORES NUMÉRICOS FINAIS PARA O SQL:");
    console.table(debugSQL);

    // ALERTA DE ERRO: Se algum valor acima for undefined, o SQL vai falhar ou salvar errado.
    Object.keys(debugSQL).forEach(key => {
        if (debugSQL[key] === undefined) console.error(`🚨 ALERTA: ${key} ESTÁ UNDEFINED!`);
    });

    const query = `
        INSERT INTO personagens (
            id_usuario, img, nome,
            genero, generonum,
            corpele, corpelenum,
            cabelo, cabelonum, corcabelo, corcabelonum,
            marcas, marcasnum,
            acesscabeca, acesscabecanum,
            acesspescoco, acesspescoconum,
            roupacima, roupacimanum, roupacimavariante, roupacimavariantenum,
            roupabaixo, roupabaixonum, roupabaixovariante, roupabaixovariantenum,
            sapato, sapatonum, sapatovariante, sapatovariantenum,
            armas, armasnum,
            basemini, basemininum,
            historia
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
            $31, $32, $33, $34
        )
        RETURNING *;
    `;

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Erro no INSERT:", error);
        throw error;
    }
};

module.exports = { criar };

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