import { useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios'

// =====================================================================
// 1. CONSTANTES INDUSTRIAIS (A LINGUAGEM DA MÁQUINA)
// =====================================================================

// Cores (Inteiros)
const COR = { BRANCO: 1, PRETO: 2, VERDE: 3, AMARELO: 4, AZUL: 5, VERMELHO: 6, NULA: 7 };

// Padrões (Strings)
const PAD = { CASA: '1', BARCO: '2', ESTRELA: '3', NULO: '4' };

// Mapeamento: Nome do Item (Visual) -> Dados da Máquina
const DADOS_INDUSTRIAIS = {
  roupaCima: {
    'Bikini':    { cor: COR.AMARELO,  padrao: PAD.CASA },
    'Besourto':  { cor: COR.AZUL,     padrao: PAD.ESTRELA },
    'Guerreiro': { cor: COR.VERMELHO, padrao: PAD.BARCO },
    'Social':    { cor: COR.PRETO,    padrao: PAD.NULO },
    'Ladino':    { cor: COR.VERDE,    padrao: PAD.ESTRELA },
    'Monge':     { cor: COR.BRANCO,   padrao: PAD.NULO },
    'Grego':     { cor: COR.BRANCO,   padrao: PAD.CASA },
    'Marcial':   { cor: COR.VERMELHO, padrao: PAD.ESTRELA },
    'Limpo':     { cor: COR.BRANCO,   padrao: PAD.NULO },
    // Fallback para itens não listados explicitamente
    'DEFAULT':   { cor: COR.AZUL,     padrao: PAD.NULO } 
  },
  roupaBaixo: {
    'Grego':     { cor: COR.BRANCO,   padrao: PAD.CASA },
    'Jeans':     { cor: COR.AZUL,     padrao: PAD.NULO },
    'Leggings':  { cor: COR.PRETO,    padrao: PAD.ESTRELA },
    'Besouro':   { cor: COR.AZUL,     padrao: PAD.ESTRELA },
    'Social':    { cor: COR.PRETO,    padrao: PAD.NULO },
    'Marcial':   { cor: COR.VERMELHO, padrao: PAD.BARCO },
    'DEFAULT':   { cor: COR.AZUL,     padrao: PAD.NULO }
  },
  sapato: {
    // Sapatos definem a COR da faceta esquerda do 1º andar
    'Sandalia':    { cor: COR.AMARELO },
    'BotasAltas':  { cor: COR.PRETO },
    'BotasNeve':   { cor: COR.BRANCO },
    'Sapatilha':   { cor: COR.AZUL },
    'Sabatao':     { cor: COR.VERMELHO },
    'Aneis':       { cor: COR.VERDE },
    'DEFAULT':     { cor: COR.NULA }
  },
  variantes: {
    // Mapeia variantes (top-1, 1, etc) para Símbolos
    'top-1': PAD.CASA, '1': PAD.CASA,
    'top-2': PAD.BARCO, '2': PAD.BARCO,
    'top-3': PAD.ESTRELA, '3': PAD.ESTRELA,
    'top-4': PAD.NULO, '4': PAD.NULO,
  }
};

// =====================================================================
// 2. MAPEAMENTOS VISUAIS E REGRAS DE NEGÓCIO
// =====================================================================

const mapeamentosParaNumeros = {
  genero: { 'FEMININO': 2, 'MASCULINO': 3 },
  corPele: { 'NEGRA': 0, 'PARDA': 1, 'LEITE': 2, 'BRANCA': 3, 'VERDE': 4, 'LARANJA': 5, 'CINZA': 6 },
  cabelo: { 'CURTO': 0, 'LONGO': 1, 'AFRO': 2, 'DREAD': 3, 'LOCO': 4, 'RASPADO': 5 },
  corCabelo: { 'PRETO': '1', 'VERMELHO': '2', 'LOIRO': '3', 'BRANCO': '4' },
  marcas: { 'CICATRIZ-NARIZ': '1', 'CICATRIZ-OLHO': '2', 'SARDAS': '3' },
  acessCabecaBase: {
    'CAPACETE-CAVALEIRO': 0, 'CAPACETE-DARK': 1, 'CAPACETE-TRIBAL-MASCARA': 2,
    'MASCARA': 3, 'CAPACETE-MADEIRA': 4, 'CAPACETE-TRIBAL': 5,
    'CHAPEU-SOL-TOPO': 6, 'CHAPEU-SOL-EMBAIXO': 6, 
  },
  acessCabecaPadrao: { 'ARGOLA': '1', 'OCULOS': '2' },
  acessorioPescoco: { 'COLAR': 0 },
};

const ITENS_EXCLUSIVOS = { 'MASCARA': true, 'CAPACETE-TRIBAL-MASCARA': true, 'CAPACETE-CAVALEIRO': true, 'CAPACETE-DARK': true, 'CAPACETE-MADEIRA': true, 'CAPACETE-TRIBAL': true };
const ITENS_BASE = { 'CHAPEU-SOL-TOPO': true, ...ITENS_EXCLUSIVOS };
const ACESSORIOS_ESCONDEM_CABELO = { 'CAPACETE-CAVALEIRO': true, 'CAPACETE-DARK': true, 'CAPACETE-TRIBAL-MASCARA': true, 'MASCARA': true };

const ACESSORIOS_CABECA_MAPEADOS = {
 'CAPACETE-CAVALEIRO': { nome: 'CAPACETE-CAVALEIRO', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-DARK': { nome: 'CAPACETE-DARK', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-MADEIRA': { nome: 'CAPACETE-MADEIRA', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-TRIBAL-MASCARA': { nome: 'CAPACETE-TRIBAL-MASCARA', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-TRIBAL': { nome: 'CAPACETE-TRIBAL', categoria: 'CAPACETES', posicao: 'topo' },
 'MASCARA': { nome: 'MASCARA', categoria: 'CAPACETES', posicao: 'topo' },
 'ARGOLA': { nome: 'ARGOLA', categoria: 'REPETIVEIS', posicao: 'rosto' },
 'CHAPEU-SOL-EMBAIXO': { nome: 'CHAPEU-SOL-EMBAIXO', categoria: 'REPETIVEIS', itemPar: 'CHAPEU-SOL-EMBAIXO', posicao: 'fundo' },
 'CHAPEU-SOL-TOPO': { nome: 'CHAPEU-SOL-TOPO', categoria: 'REPETIVEIS', itemPar: 'CHAPEU-SOL-EMBAIXO', posicao: 'topo' },
 'OCULOS': { nome: 'OCULOS', categoria: 'REPETIVEIS', posicao: 'rosto' }
};

const ACESSORIOS_PESCOCO_MAPEADOS = { 'COLAR': { nome: 'COLAR', categoria: 'PESCOÇO' } };
const MARCAS_MAPEADAS = {
 'CICATRIZ-NARIZ': { nome: 'CICATRIZ-NARIZ', categoria: 'MARCAS' },
 'CICATRIZ-OLHO': { nome: 'CICATRIZ-OLHO', categoria: 'MARCAS' },
 'SARDAS': { nome: 'SARDAS', categoria: 'MARCAS' }
};

// --- Helpers de Caminho ---
const getPosicaoAcessorio = (nomeItem) => ACESSORIOS_CABECA_MAPEADOS[nomeItem]?.posicao || 'topo';

const getCaminhoAcessorio = (nomeItem, genero) => {
  if (!nomeItem) return null; 
  const infoItem = ACESSORIOS_CABECA_MAPEADOS[nomeItem] || ACESSORIOS_PESCOCO_MAPEADOS[nomeItem] || MARCAS_MAPEADAS[nomeItem];
  return infoItem ? `/personagem-${genero}/ACESSORIOS-${genero}S/${infoItem.categoria}/${infoItem.nome}.png` : null;
};

const getCaminhoRoupaCima = (nomeItem, variante, genero) => {
    if (!nomeItem) return null;
    let varSufixo = variante || 'top-1';
    if (genero === 'FEMININO') return `/personagem-FEMININO/ROUPAS-TORSO/${nomeItem}-top-1.png`;
    if (genero === 'MASCULINO') {
        if (nomeItem === 'Besourto' && varSufixo === 'top-1') varSufixo = 'Top-1';
        return `/personagem-MASCULINO/ROUPAS-TORSO/${nomeItem}-${varSufixo}.png`;
    }
    return null;
};

const getCaminhoRoupaBaixo = (nomeItem, variante, genero) => {
    if (!nomeItem) return null;
    if (genero === 'FEMININO') return `/personagem-FEMININO/ROUPAS-PERNAS/${nomeItem}-bottom-1.png`;
    if (genero === 'MASCULINO') {
        const itensSufixoCurto = ['Calca', 'Leggings', 'MeiaCalca'];
        if (itensSufixoCurto.includes(nomeItem)) return `/personagem-MASCULINO/ROUPAS-PERNA/${nomeItem}-1.png`;
        return `/personagem-MASCULINO/ROUPAS-PERNA/${nomeItem}-bottom-1.png`;
    }
    return null;
};

const getCaminhoSapato = (nomeItem, variante, genero) => {
    if (!nomeItem) return null;
    const varSufixo = variante || '1';
    return `/personagem-${genero}/SAPATOS/${nomeItem}-${varSufixo}.png`;
};

// --- Listas de Opções para UI ---
const opcoesDoPersonagem = {
 cabelo: { MASCULINO: ['AFRO', 'CURTO', 'DREAD', 'LONGO', 'LOCO', 'RASPADO'], FEMININO: ['AFRO', 'CURTO', 'DREAD', 'LONGO', 'LOCO', 'RASPADO'] },
 corCabelo: [ { nome: 'PRETO', color: '#1a1a1a' }, { nome: 'VERMELHO', color: '#c43a3a' }, { nome: 'LOIRO', color: '#f5d453' }, { nome: 'BRANCO', color: '#e0e0e0' } ],
 corPele: [ { nome: 'NEGRA', color: '#3b2010ff' }, { nome: 'PARDA', color: '#8C5230' }, { nome: 'LEITE', color: '#D2A17C' }, { nome: 'BRANCA', color: '#F9E4D4' }, { nome: 'VERDE', color: '#4d771eff' }, { nome: 'LARANJA', color: '#c26632ff' }, { nome: 'CINZA', color: '#99af9eff' } ],
 estilosComCabeloFundo: ['AFRO'],
 roupaCima: {
    MASCULINO: ['Besourto', 'Guerreiro', 'Ladino', 'Limpo', 'Marcial', 'Monge', 'Regalia', 'Social'],
    FEMININO: ['Besourto', 'Bikini', 'Camponesa', 'Guerreiro','Grego', 'Ladina','Marcial', 'Limpo', 'Mage', 'Monge', 'Regalia', 'Social']
 },
 roupaCimaVariantes: ['top-1', 'top-2', 'top-3'], 
 roupaBaixo: {
    MASCULINO: ['Besouro', 'Calca', 'Grego', 'Ladino', 'Leggings', 'Limpo', 'Marcial', 'MeiaCalca', 'Monge'],
    FEMININO: ['Besourto', 'Bikini', 'Camponesa', 'Ladina','Grego','Marcial', 'Leggings', 'Limpo', 'Monge', 'Refinado', 'Social']
 },
 roupaBaixoVariantes: ['1', '2', '3'], 
 sapato: ['Aneis', 'BotasAltas', 'BotasNeve', 'Sabatao', 'Sandalia', 'Sapatilha'],
 sapatoVariantes: ['1', '2', '3'],
};

// =====================================================================
// 3. ESTADO INICIAL DO PERSONAGEM
// =====================================================================

const estadoInicialDoPersonagem = {
  // --- CARACTERÍSTICAS FÍSICAS (3º Andar) ---
  genero: 'FEMININO', generoNum: 2, 
  corPele: 'NEGRA', corPeleNum: 0,
  cabelo: 'CURTO', cabeloNum: 0, 
  corCabelo: 'PRETO', corCabeloNum: '1', 
  
  acessoriosCabeca: ['null', 'ARGOLA'], 
  acessCabeca: 6, acessCabecapadrao: '1', // Numéricos
  
  acessorioPescoco: 'COLAR', acessPescocoNum: 0, // Cor do bloco 2º andar
  marcas: 'CICATRIZ-NARIZ', marcaspadrao: '1',

  // --- ROUPA DE CIMA (2º Andar) ---
  // Estilo (Faceta Frontal)
  roupaCima: 'Bikini', 
  roupaCimaCorNum: 4,      // 4: Amarelo
  roupaCimaPadrao: '1',    // '1': Casa
  
  // Variação (Faceta Direita)
  roupaCimaVariante: 'top-1', 
  roupaCimaVarPadrao: '1', // '1': Casa

  // --- ROUPA DE BAIXO (1º Andar) ---
  // Estilo (Faceta Frontal)
  roupaBaixo: 'Grego', 
  roupaBaixoCorNum: 1,     // 1: Branco
  roupaBaixoPadrao: '1',   // '1': Casa

  // Variação (Faceta Direita)
  roupaBaixoVariante: '1',
  roupaBaixoVarPadrao: '1',

  // --- SAPATOS (1º Andar) ---
  // Estilo e Variação (Faceta Esquerda)
  sapato: 'Sandalia', 
  sapatoCorNum: 4,         // 4: Amarelo
  
  sapatoVariante: '1', 
  sapatoVarPadrao: '1',

  // --- META DADOS ---
  img: '', historia: '', armas: '', baseMini: ''
};

// =====================================================================
// 4. O HOOK (LÓGICA)
// =====================================================================

export const useLogicaCustomizacao = () => {
 const [personagem, setPersonagem] = useState(estadoInicialDoPersonagem);

 const atualizarPersonagem = (caracteristica, novoValor) => {
  setPersonagem(prev => {
   
   // --- REGRA DE ROUPAS OBRIGATÓRIAS ---
   if (caracteristica === 'roupaCima' && !novoValor && prev.genero === 'FEMININO') return prev;
   if (caracteristica === 'roupaBaixo' && !novoValor) return prev;

   let novoEstado = { ...prev };
   let valorFinal = novoValor;
   
   // Toggle cabelo
   if (caracteristica === 'cabelo' && prev.cabelo === novoValor) valorFinal = null;
   novoEstado[caracteristica] = valorFinal;

   // --- ATUALIZAÇÃO AUTOMÁTICA DOS CÓDIGOS INDUSTRIAIS ---

   // 1. Atualizar Roupa Cima (Cor + Símbolo)
   if (caracteristica === 'roupaCima' && valorFinal) {
     const dados = DADOS_INDUSTRIAIS.roupaCima[valorFinal] || DADOS_INDUSTRIAIS.roupaCima['DEFAULT'];
     novoEstado.roupaCimaCorNum = dados.cor;
     novoEstado.roupaCimaPadrao = dados.padrao;
   }

   // 2. Atualizar Variante Roupa Cima (Símbolo apenas)
   if (caracteristica === 'roupaCimaVariante' && valorFinal) {
     novoEstado.roupaCimaVarPadrao = DADOS_INDUSTRIAIS.variantes[valorFinal] || '4';
   }

   // 3. Atualizar Roupa Baixo (Cor + Símbolo)
   if (caracteristica === 'roupaBaixo' && valorFinal) {
     const dados = DADOS_INDUSTRIAIS.roupaBaixo[valorFinal] || DADOS_INDUSTRIAIS.roupaBaixo['DEFAULT'];
     novoEstado.roupaBaixoCorNum = dados.cor;
     novoEstado.roupaBaixoPadrao = dados.padrao;
   }

   // 4. Atualizar Variante Roupa Baixo (Símbolo apenas)
   if (caracteristica === 'roupaBaixoVariante' && valorFinal) {
     novoEstado.roupaBaixoVarPadrao = DADOS_INDUSTRIAIS.variantes[valorFinal] || '4';
   }

   // 5. Atualizar Sapato (Cor apenas)
   if (caracteristica === 'sapato' && valorFinal) {
     const dados = DADOS_INDUSTRIAIS.sapato[valorFinal] || DADOS_INDUSTRIAIS.sapato['DEFAULT'];
     novoEstado.sapatoCorNum = dados.cor;
   }

   // 6. Atualizar Variante Sapato (Símbolo apenas)
   if (caracteristica === 'sapatoVariante' && valorFinal) {
     novoEstado.sapatoVarPadrao = DADOS_INDUSTRIAIS.variantes[valorFinal] || '4';
   }

   // --- FIM DA LÓGICA INDUSTRIAL ---

   // Mapeamento padrão (Pele, Cabelo, Genero)
   const keyNum = `${caracteristica}Num`;
   // Para corCabelo e Marcas, o sufixo é 'Num' mas o valor é string ('1'), o mapeamento cuida disso.
   if (mapeamentosParaNumeros[caracteristica]) {
       novoEstado[keyNum] = valorFinal ? mapeamentosParaNumeros[caracteristica][valorFinal] : null;
   }

   // Reset se acessório esconde cabelo
   if (caracteristica === 'cabelo' && valorFinal && prev.acessoriosCabeca.some(i => ACESSORIOS_ESCONDEM_CABELO[i])) {
       novoEstado.acessoriosCabeca = []; novoEstado.acessCabeca = null; novoEstado.acessCabecapadrao = null;
   }
   
   // Lógica de Troca de Gênero
   if (caracteristica === 'genero' && prev.genero !== novoValor) {
     novoEstado.cabelo = 'CURTO'; 
     novoEstado.cabeloNum = mapeamentosParaNumeros.cabelo['CURTO'];
     
     novoEstado.acessoriosCabeca = []; novoEstado.acessorioPescoco = null; novoEstado.marcas = null;
     novoEstado.acessCabeca = null; novoEstado.acessPescocoNum = null; novoEstado.marcaspadrao = null;
     
     // Reseta Roupas para os padrões do novo gênero
     novoEstado.roupaBaixo = 'Grego'; 
     novoEstado.roupaBaixoCorNum = DADOS_INDUSTRIAIS.roupaBaixo['Grego'].cor;
     novoEstado.roupaBaixoPadrao = DADOS_INDUSTRIAIS.roupaBaixo['Grego'].padrao;
     
     novoEstado.sapato = 'Sandalia'; 
     novoEstado.sapatoCorNum = DADOS_INDUSTRIAIS.sapato['Sandalia'].cor;

     if (novoValor === 'FEMININO') {
         novoEstado.roupaCima = 'Bikini';
         novoEstado.roupaCimaCorNum = DADOS_INDUSTRIAIS.roupaCima['Bikini'].cor;
         novoEstado.roupaCimaPadrao = DADOS_INDUSTRIAIS.roupaCima['Bikini'].padrao;
     } else {
         novoEstado.roupaCima = null;
         novoEstado.roupaCimaCorNum = null;
         novoEstado.roupaCimaPadrao = null;
     }
   }
   return novoEstado;
  });
 };

 const handleAcessoriosCabecaChange = (arr) => {
  setPersonagem(prev => {
    let base = null, padrao = null;
    arr.forEach(i => ITENS_BASE[i] ? base = i : padrao = i);
    const esconde = arr.some(i => ACESSORIOS_ESCONDEM_CABELO[i]);
    return { ...prev, 
        acessoriosCabeca: arr, 
        acessCabeca: base ? mapeamentosParaNumeros.acessCabecaBase[base] : null, 
        acessCabecapadrao: padrao ? mapeamentosParaNumeros.acessCabecaPadrao[padrao] : null, 
        cabelo: esconde ? null : prev.cabelo, 
        cabeloNum: esconde ? null : prev.cabeloNum 
    };
  });
 };

 const handleAcessorioPescocoChange = (n) => setPersonagem(p => ({...p, acessorioPescoco: n, acessPescocoNum: n ? mapeamentosParaNumeros.acessorioPescoco[n] : null }));
 const handleMarcasChange = (n) => setPersonagem(p => ({...p, marcas: n, marcaspadrao: n ? mapeamentosParaNumeros.marcas[n] : null }));

 const salvarPersonagem = async (ref, setDados, setImg) => {
  try {
    const canvas = await html2canvas(ref.current, { backgroundColor: null, scale: 0.45 });
    const b64 = canvas.toDataURL('image/png');
    // Salva o estado completo, agora incluindo todos os códigos industriais
    setImg(b64); setDados({ ...personagem, img: b64 });
    console.log("Salvo para Produção:", personagem);
  } catch (e) { console.error(e); }
 };
 
 const { genero, corPele, cabelo, corCabelo, acessoriosCabeca, acessorioPescoco, marcas, roupaCima, roupaCimaVariante, roupaBaixo, roupaBaixoVariante, sapato, sapatoVariante } = personagem;

 // --- GERAÇÃO DOS CAMINHOS DAS IMAGENS ---
 const caminhoBaseCorpo = genero === 'MASCULINO' 
    ? `/personagem-MASCULINO/CORPO-MASCULINO-PELE/CORPO-MASCULINO-${corPele}.png` 
    : `/personagem-FEMININO/CORPO-FEMININO-PELES/CORPO-FEMININO-${corPele}.png`;
 
 const pastaBaseCabelo = `/personagem-${genero}/CABELOS-${genero}`;
 const caminhoCabeloFrente = cabelo ? `${pastaBaseCabelo}/CABELO-${cabelo}/CABELO-${cabelo}-${corCabelo}.png` : null;
 const caminhoCabeloFundo = (cabelo && opcoesDoPersonagem.estilosComCabeloFundo.includes(cabelo)) ? `${pastaBaseCabelo}/CABELO-FUNDO/CABELO-FUNDO-${corCabelo}.png` : null;
 
 const caminhoRoupaCima = getCaminhoRoupaCima(roupaCima, roupaCimaVariante, genero);
 const caminhoRoupaBaixo = getCaminhoRoupaBaixo(roupaBaixo, roupaBaixoVariante, genero);
 const caminhoSapato = getCaminhoSapato(sapato, sapatoVariante, genero);

 const acessoriosCabecaFundo = [], acessoriosCabecaRosto = [], acessoriosCabecaTopo = [];
 acessoriosCabeca.forEach(nome => {
    const path = getCaminhoAcessorio(nome, genero);
    if(path) {
        const pos = getPosicaoAcessorio(nome);
        pos === 'fundo' ? acessoriosCabecaFundo.push(path) : pos === 'rosto' ? acessoriosCabecaRosto.push(path) : acessoriosCabecaTopo.push(path);
    }
    const info = ACESSORIOS_CABECA_MAPEADOS[nome];
    if(info?.itemPar) {
        const pathPar = getCaminhoAcessorio(info.itemPar, genero);
        if(pathPar) { const posP = getPosicaoAcessorio(info.itemPar); posP === 'fundo' ? acessoriosCabecaFundo.push(pathPar) : posP === 'rosto' ? acessoriosCabecaRosto.push(pathPar) : acessoriosCabecaTopo.push(pathPar); }
    }
 });

 const caminhosDasImagens = {
  corpo: caminhoBaseCorpo,
  roupaCima: caminhoRoupaCima,
  roupaBaixo: caminhoRoupaBaixo,
  sapato: caminhoSapato,
  cabeloFrente: caminhoCabeloFrente, cabeloFundo: caminhoCabeloFundo,
  acessoriosCabecaFundo, acessoriosCabecaRosto, acessoriosCabecaTopo,
  acessorioPescoco: getCaminhoAcessorio(acessorioPescoco, genero),
  marcas: getCaminhoAcessorio(marcas, genero)
 };

const adicionarPersonagemAoCarrinho = async (refElemento, dadosExtras = {}) => {
  // refElemento: a referência do React (useRef) para tirar o print
  // dadosExtras: objeto vindo da página { nome: "...", historia: "..." }

  const usuarioId = localStorage.getItem('usuario_id');
  
  if (!usuarioId) {
    throw new Error('Você precisa estar logado para salvar o personagem.');
  }

  try {
    // 1. Gera a Imagem (Snapshot)
    const canvas = await html2canvas(refElemento.current, { 
      backgroundColor: null, 
      scale: 0.5 // Scale menor para ficar leve no banco
    });
    const imgBase64 = canvas.toDataURL('image/png');

    // 2. Monta o Payload
    // O Axios converte esse objeto para JSON automaticamente
    const payload = {
      ...personagem, // Espalha todo o estado (roupaCima, generonum, etc.)
      usuario_id: usuarioId, // ID do localStorage
      img: imgBase64,
      nome: dadosExtras.nome || 'Aventureiro Sem Nome',
      historia: dadosExtras.historia || ''
    };

    // ============================================================
    // 🔍 DEBUGGER VIZINHO: CHECKPOINT 1 (FRONTEND)
    // ============================================================
    console.group("%c 🛠️ FORJA DEBUG: Enviando Dados", "color: orange; font-weight: bold; font-size: 14px;");
    console.log(`👤 ID Usuário: ${payload.usuario_id}`);
    console.log(`📝 Nome Personagem: ${payload.nome}`);

    console.log(`⚧️ Gênero: ${payload.genero} | Num: %c${payload.generoNum}`, "color: cyan; font-weight:bold");
    console.log(`🎨 Pele: ${payload.corPele} | Num: %c${payload.corPeleNum}`, "color: cyan; font-weight:bold");

    console.log("---------------- TORSO (Industrial) ----------------");
    console.log(`👕 Peça: ${payload.roupaCima}`);
    console.log(`🔢 Cor (Bloco): %c${payload.roupaCimaCorNum}`, "color: lime; font-weight:bold; font-size: 12px");
    console.log(`🔢 Padrão (Frente): %c${payload.roupaCimaPadrao}`, "color: lime; font-weight:bold; font-size: 12px");
    console.log(`🔢 Variante: ${payload.roupaCimaVariante} -> Padrão Var: %c${payload.roupaCimaVarPadrao}`, "color: lime; font-weight:bold");

    console.log("---------------- PERNAS (Industrial) ----------------");
    console.log(`👖 Peça: ${payload.roupaBaixo}`);
    console.log(`🔢 Cor (Bloco): %c${payload.roupaBaixoCorNum}`, "color: lime; font-weight:bold; font-size: 12px");
    console.log(`🔢 Padrão (Frente): %c${payload.roupaBaixoPadrao}`, "color: lime; font-weight:bold; font-size: 12px");
    console.log(`🔢 Variante: ${payload.roupaBaixoVariante} -> Padrão Var: %c${payload.roupaBaixoVarPadrao}`, "color: lime; font-weight:bold");

    console.log("---------------- PÉS & ARMAS ----------------");
    console.log(`👟 Sapato: ${payload.sapato} | CorNum: ${payload.sapatoCorNum} | VarPadrao: ${payload.sapatoVarPadrao}`);
    console.log(`⚔️ Arma: ${payload.armas} | CorNum: ${payload.armasCorNum} | Padrão: ${payload.armasPadrao}`);

    console.groupEnd();
    // ============================================================

    const url = 'https://forja-qvex.onrender.com/api/personagens';
    
    const response = await axios.post(url, payload);

    // Com Axios, a resposta já vem em response.data
    console.log("Salvo com sucesso! ID:", response.data.id);
    return response.data;

  } catch (error) {
    // Tratamento de erro específico do Axios
    console.error("Erro ao salvar:", error);
    
    // Se o servidor respondeu com erro (ex: 400, 500), pegamos a mensagem
    if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Erro no servidor ao salvar.');
    }
    
    throw new Error('Erro de conexão ou falha ao gerar imagem.');
  }
};

 return { 
  personagem, 
  atualizarPersonagem, 
  handleAcessoriosCabecaChange, 
  handleAcessorioPescocoChange, 
  handleMarcasChange, 
  salvarPersonagem, 
  caminhosDasImagens,
  opcoesDoPersonagem,
  adicionarPersonagemAoCarrinho
 };
};