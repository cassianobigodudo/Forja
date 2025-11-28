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

    // Vamos mapear os índices do array 'values' para os nomes das colunas
    // Lembre-se: Array começa em 0, mas no SQL ($1) começa em 1.
    const mapaDeDados = {
        '01_UsuarioID': values[0],
        '04_GeneroNome': values[3],
        '05_GeneroNUM': values[4],       // <--- VERIFIQUE SE É NÚMERO
        '18_RoupaCima': values[17],
        '19_RoupaCimaCOR_NUM': values[18], // <--- IMPORTANTE
        '20_RoupaCimaPADRAO': values[19],
        '22_RoupaBaixo': values[21],
        '23_RoupaBaixoCOR_NUM': values[22], // <--- IMPORTANTE
        '30_ArmaNome': values[29],
        '31_ArmaCOR_NUM': values[30]
    };

    console.table(mapaDeDados); 
    // Se aparecer algum "undefined" ou "NaN" na tabela acima, 
    // o erro está no mapeamento da const values.
    // ============================================================

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