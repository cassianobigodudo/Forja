import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useGlobalContext } from '../../context/GlobalContext';


// =====================================================================
// 1. CONSTANTES INDUSTRIAIS (A LINGUAGEM DA MÁQUINA)
// =====================================================================

const COR = { BRANCO: 1, PRETO: 2, VERDE: 3, AMARELO: 4, AZUL: 5, VERMELHO: 6, NULA: 7 };
const PAD = { CASA: '1', BARCO: '2', ESTRELA: '3', NULO: '4' };

const DADOS_INDUSTRIAIS = {
  // --- DADOS CORPORAIS (Mapeamento Simples: Nome -> Inteiro) ---
  genero: { 'FEMININO': 2, 'MASCULINO': 3 },
  corPele: { 'NEGRA': 0, 'PARDA': 1, 'LEITE': 2, 'BRANCA': 3, 'VERDE': 4, 'LARANJA': 5, 'CINZA': 6 },
  cabelo: { 'CURTO': 0, 'LONGO': 1, 'AFRO': 2, 'DREAD': 3, 'LOCO': 4, 'RASPADO': 5 },
  corCabelo: { 'PRETO': '1', 'VERMELHO': '2', 'LOIRO': '3', 'BRANCO': '4' },
  
  // --- ACESSÓRIOS & MARCAS (Mapeamento Simples) ---
  marcas: { 'CICATRIZ-NARIZ': '1', 'CICATRIZ-OLHO': '2', 'SARDAS': '3' },
  acessorioPescoco: { 'COLAR': 0 },

  // Definições de Acessórios de Cabeça (Base = Numérico / Padrão = String)
  acessCabecaBase: {
    'CAPACETE-CAVALEIRO': 0, 'CAPACETE-DARK': 1, 'CAPACETE-TRIBAL-MASCARA': 2,
    'MASCARA': 3, 'CAPACETE-MADEIRA': 4, 'CAPACETE-TRIBAL': 5,
    'CHAPEU-SOL-TOPO': 6, 'CHAPEU-SOL-EMBAIXO': 6, 
  },
  acessCabecaPadrao: { 'ARGOLA': '1', 'OCULOS': '2' },

  // --- ROUPAS & ITENS (Mapeamento Complexo: Item -> { cor, padrao }) ---
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
    'Sandalia':    { cor: COR.AMARELO },
    'BotasAltas':  { cor: COR.PRETO },
    'BotasNeve':   { cor: COR.BRANCO },
    'Sapatilha':   { cor: COR.AZUL },
    'Sabatao':     { cor: COR.VERMELHO },
    'Aneis':       { cor: COR.VERDE },
    'DEFAULT':     { cor: COR.NULA }
  },
  armas: {
    'Espada':  { cor: COR.BRANCO,   padrao: PAD.ESTRELA }, 
    'Lanca':   { cor: COR.VERMELHO, padrao: PAD.BARCO },    
    'Machado': { cor: COR.PRETO,    padrao: PAD.CASA },     
    'DEFAULT': { cor: COR.NULA,     padrao: PAD.NULO }
  },
  variantes: {
    'top-1': PAD.CASA, '1': PAD.CASA,
    'top-2': PAD.BARCO, '2': PAD.BARCO,
    'top-3': PAD.ESTRELA, '3': PAD.ESTRELA,
    'top-4': PAD.NULO, '4': PAD.NULO,
  }
};

// =====================================================================
// 2. MAPEAMENTOS VISUAIS
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

//Helpers
const getPosicaoAcessorio = (nomeItem) => ACESSORIOS_CABECA_MAPEADOS[nomeItem]?.posicao || 'topo';

// --- FIXED FUNCTION: Forces all genders to use the FEMALE folder for accessories ---
const getCaminhoAcessorio = (nomeItem, genero) => {
  if (!nomeItem) return null; 
  const infoItem = ACESSORIOS_CABECA_MAPEADOS[nomeItem] || ACESSORIOS_PESCOCO_MAPEADOS[nomeItem] || MARCAS_MAPEADAS[nomeItem];
  
  // Hardcoded to FEMININO folder as requested, since files are shared
  return infoItem ? `/personagem-FEMININO/ACESSORIOS-FEMININOS/${infoItem.categoria}/${infoItem.nome}.png` : null;
};

const getCaminhoRoupaCima = (nomeItem, variante, genero) => { if (!nomeItem) return null; let varSufixo = variante || 'top-1'; if (genero === 'FEMININO') return `/personagem-FEMININO/ROUPAS-TORSO/${nomeItem}-top-1.png`; if (genero === 'MASCULINO') { if (nomeItem === 'Besourto' && varSufixo === 'top-1') varSufixo = 'Top-1'; return `/personagem-MASCULINO/ROUPAS-TORSO/${nomeItem}-${varSufixo}.png`; } return null; };
const getCaminhoRoupaBaixo = (nomeItem, variante, genero) => { if (!nomeItem) return null; if (genero === 'FEMININO') return `/personagem-FEMININO/ROUPAS-PERNAS/${nomeItem}-bottom-1.png`; if (genero === 'MASCULINO') { const itensSufixoCurto = ['Calca', 'Leggings', 'MeiaCalca']; if (itensSufixoCurto.includes(nomeItem)) return `/personagem-MASCULINO/ROUPAS-PERNA/${nomeItem}-1.png`; return `/personagem-MASCULINO/ROUPAS-PERNA/${nomeItem}-bottom-1.png`; } return null; };
const getCaminhoSapato = (nomeItem, variante, genero) => { if (!nomeItem) return null; const varSufixo = variante || '1'; return `/personagem-${genero}/SAPATOS/${nomeItem}-${varSufixo}.png`; };

// --- HELPER DE ARMAS ---
const getCaminhoArma = (nomeItem) => {
    if (!nomeItem) return null;
    return `/armas/${nomeItem}.png`;
};

// --- Listas de Opções ---
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
 armas: ['Espada', 'Lanca', 'Machado']
};

// =====================================================================
// 3. ESTADO INICIAL DO PERSONAGEM
// =====================================================================

const estadoInicialDoPersonagem = {
  genero: 'FEMININO', generoNum: 2, 
  corPele: 'NEGRA', corPeleNum: 0,
  cabelo: 'CURTO', cabeloNum: 0, 
  corCabelo: 'PRETO', corCabeloNum: '1', 
  
  acessoriosCabeca: ['null', 'ARGOLA'], 
  acessCabeca: 6, acessCabecapadrao: '1', 
  
  acessorioPescoco: 'COLAR', acessPescocoNum: 0,
  marcas: 'CICATRIZ-NARIZ', marcaspadrao: '1',

  // Roupas
  roupaCima: 'Bikini', roupaCimaCorNum: 4, roupaCimaPadrao: '1', 
  roupaCimaVariante: 'top-1', roupaCimaVarPadrao: '1', 

  roupaBaixo: 'Grego', roupaBaixoCorNum: 1, roupaBaixoPadrao: '1', 
  roupaBaixoVariante: '1', roupaBaixoVarPadrao: '1',

  sapato: 'Sandalia', sapatoCorNum: 4, 
  sapatoVariante: '1', sapatoVarPadrao: '1',
  
  armas: null,            
  armasCorNum: 7,         
  armasPadrao: '4',       

  img: '', historia: '', baseMini: ''
};

// =====================================================================
// 4. O HOOK
// =====================================================================

export const useLogicaCustomizacao = () => {
  // 1. Pegar dados vindos da Loja (Contexto)
  const { dadosDoPersonagem, setDadosDoPersonagem, adicionarAoCarrinho } = useGlobalContext();

  // 2. Definir estado inicial com MAPEAMENTO INTELIGENTE
  const [personagem, setPersonagem] = useState(() => {
      
      // Se tiver dados vindos do banco (via Loja), fazemos o DE-PARA
      if (dadosDoPersonagem && Object.keys(dadosDoPersonagem).length > 0) {
          console.log("🛠️ Carregando dados da Forja:", dadosDoPersonagem);
          
          // Função auxiliar para evitar quebra se o array vier como string do banco
          const parseArray = (str) => {
              try { return typeof str === 'string' ? JSON.parse(str) : str; } 
              catch (e) { return []; }
          };

          return {
              ...estadoInicialDoPersonagem, // Mantém defaults para o que faltar

              // --- CORPO ---
              genero:      dadosDoPersonagem.genero,
              generoNum:   dadosDoPersonagem.generonum,
              
              corPele:     dadosDoPersonagem.corpele,
              corPeleNum:  dadosDoPersonagem.corpelenum,
              
              cabelo:      dadosDoPersonagem.cabelo,
              cabeloNum:   dadosDoPersonagem.cabelonum,
              
              corCabelo:    dadosDoPersonagem.corcabelo,
              corCabeloNum: dadosDoPersonagem.corcabelonum, // String '1','2'...

              // --- ACESSÓRIOS ---
              // Banco salva como String JSON, React precisa de Array
              acessoriosCabeca: parseArray(dadosDoPersonagem.acesscabeca),
              acessCabeca:      dadosDoPersonagem.acesscabecanum,
              // Nota: O banco não tem 'acesscabecapadrao' explícito na lista que vc mandou,
              // então ele vai pegar do estadoInicialDoPersonagem ou ser null.
              
              acessorioPescoco: dadosDoPersonagem.acesspescoco,
              acessPescocoNum:  dadosDoPersonagem.acesspescoconum,

              marcas:       dadosDoPersonagem.marcas,
              marcaspadrao: dadosDoPersonagem.marcasnum, // Mapeado para marcasnum do banco

              // --- ROUPA CIMA (TORSO) ---
              roupaCima:           dadosDoPersonagem.roupacima,
              roupaCimaCorNum:     dadosDoPersonagem.roupacimanum,
              roupaCimaVariante:   dadosDoPersonagem.roupacimavariante,
              roupaCimaVarPadrao:  dadosDoPersonagem.roupacimavariantenum,
              // O 'roupaCimaPadrao' (ilustração frontal) não tem coluna dedicada no seu banco atual,
              // então ele ficará como padrão ou você precisará recalcular se necessário.

              // --- ROUPA BAIXO (PERNAS) ---
              roupaBaixo:          dadosDoPersonagem.roupabaixo,
              roupaBaixoCorNum:    dadosDoPersonagem.roupabaixonum,
              roupaBaixoVariante:  dadosDoPersonagem.roupabaixovariante,
              roupaBaixoVarPadrao: dadosDoPersonagem.roupabaixovariantenum,

              // --- SAPATOS ---
              sapato:          dadosDoPersonagem.sapato,
              sapatoCorNum:    dadosDoPersonagem.sapatonum,
              sapatoVariante:  dadosDoPersonagem.sapatovariante,
              sapatoVarPadrao: dadosDoPersonagem.sapatovariantenum,

              // --- ARMAS ---
              armas:        dadosDoPersonagem.armas,
              armasCorNum:  dadosDoPersonagem.armasnum,
              // Idem: armasPadrao não tem coluna, usará default.

              // --- EXTRAS ---
              baseMini: dadosDoPersonagem.basemini,
              
              // Mantém a imagem e história se quiser mostrar, mas o hook gera novos ao salvar
              historia: dadosDoPersonagem.historia || '',
          };
      }
      
      // Se não veio nada da loja, começa do zero
      return estadoInicialDoPersonagem;
  });

  useEffect(() => {
      if (dadosDoPersonagem) {
          setDadosDoPersonagem(null);
      }
  }, []);

 const atualizarPersonagem = (caracteristica, novoValor) => {
  setPersonagem(prev => {
   
   if (caracteristica === 'roupaCima' && !novoValor && prev.genero === 'FEMININO') return prev;
   if (caracteristica === 'roupaBaixo' && !novoValor) return prev;

   let novoEstado = { ...prev };
   let valorFinal = novoValor;
   
   if (caracteristica === 'cabelo' && prev.cabelo === novoValor) valorFinal = null;
   
   if (caracteristica === 'armas' && prev.armas === novoValor) valorFinal = null;

   novoEstado[caracteristica] = valorFinal;

   // --- ATUALIZAÇÃO INDUSTRIAL ---
   if (caracteristica === 'roupaCima' && valorFinal) { const dados = DADOS_INDUSTRIAIS.roupaCima[valorFinal] || DADOS_INDUSTRIAIS.roupaCima['DEFAULT']; novoEstado.roupaCimaCorNum = dados.cor; novoEstado.roupaCimaPadrao = dados.padrao; }
   if (caracteristica === 'roupaCimaVariante' && valorFinal) { novoEstado.roupaCimaVarPadrao = DADOS_INDUSTRIAIS.variantes[valorFinal] || '4'; }
   
   if (caracteristica === 'roupaBaixo' && valorFinal) { const dados = DADOS_INDUSTRIAIS.roupaBaixo[valorFinal] || DADOS_INDUSTRIAIS.roupaBaixo['DEFAULT']; novoEstado.roupaBaixoCorNum = dados.cor; novoEstado.roupaBaixoPadrao = dados.padrao; }
   if (caracteristica === 'roupaBaixoVariante' && valorFinal) { novoEstado.roupaBaixoVarPadrao = DADOS_INDUSTRIAIS.variantes[valorFinal] || '4'; }
   
   if (caracteristica === 'sapato' && valorFinal) { const dados = DADOS_INDUSTRIAIS.sapato[valorFinal] || DADOS_INDUSTRIAIS.sapato['DEFAULT']; novoEstado.sapatoCorNum = dados.cor; }
   if (caracteristica === 'sapatoVariante' && valorFinal) { novoEstado.sapatoVarPadrao = DADOS_INDUSTRIAIS.variantes[valorFinal] || '4'; }

   if (caracteristica === 'armas') {
      if (valorFinal) {
          const dados = DADOS_INDUSTRIAIS.armas[valorFinal] || DADOS_INDUSTRIAIS.armas['DEFAULT'];
          novoEstado.armasCorNum = dados.cor;
          novoEstado.armasPadrao = dados.padrao;
      } else {
          novoEstado.armasCorNum = COR.NULA;
          novoEstado.armasPadrao = PAD.NULO;
      }
   }

   const keyNum = `${caracteristica}Num`;
   if (mapeamentosParaNumeros[caracteristica]) { novoEstado[keyNum] = valorFinal ? mapeamentosParaNumeros[caracteristica][valorFinal] : null; }

   if (caracteristica === 'cabelo' && valorFinal && prev.acessoriosCabeca.some(i => ACESSORIOS_ESCONDEM_CABELO[i])) { novoEstado.acessoriosCabeca = []; novoEstado.acessCabeca = null; novoEstado.acessCabecapadrao = null; }
   
   // Troca de Gênero
   if (caracteristica === 'genero' && prev.genero !== novoValor) {
     novoEstado.cabelo = 'CURTO'; novoEstado.cabeloNum = mapeamentosParaNumeros.cabelo['CURTO'];
     novoEstado.acessoriosCabeca = []; novoEstado.acessorioPescoco = null; novoEstado.marcas = null;
     novoEstado.acessCabeca = null; novoEstado.acessPescocoNum = null; novoEstado.marcaspadrao = null;
     
     novoEstado.roupaBaixo = 'Grego'; novoEstado.roupaBaixoCorNum = DADOS_INDUSTRIAIS.roupaBaixo['Grego'].cor; novoEstado.roupaBaixoPadrao = DADOS_INDUSTRIAIS.roupaBaixo['Grego'].padrao;
     novoEstado.sapato = 'Sandalia'; novoEstado.sapatoCorNum = DADOS_INDUSTRIAIS.sapato['Sandalia'].cor;
     
     novoEstado.armas = null; novoEstado.armasCorNum = COR.NULA; novoEstado.armasPadrao = PAD.NULO;

     if (novoValor === 'FEMININO') { novoEstado.roupaCima = 'Bikini'; novoEstado.roupaCimaCorNum = DADOS_INDUSTRIAIS.roupaCima['Bikini'].cor; novoEstado.roupaCimaPadrao = DADOS_INDUSTRIAIS.roupaCima['Bikini'].padrao; } 
     else { novoEstado.roupaCima = null; novoEstado.roupaCimaCorNum = null; novoEstado.roupaCimaPadrao = null; }
   }
   return novoEstado;
  });
 };

 const handleAcessoriosCabecaChange = (arr) => { setPersonagem(prev => { let base = null, padrao = null; arr.forEach(i => ITENS_BASE[i] ? base = i : padrao = i); const esconde = arr.some(i => ACESSORIOS_ESCONDEM_CABELO[i]); return { ...prev, acessoriosCabeca: arr, acessCabeca: base ? mapeamentosParaNumeros.acessCabecaBase[base] : null, acessCabecapadrao: padrao ? mapeamentosParaNumeros.acessCabecaPadrao[padrao] : null, cabelo: esconde ? null : prev.cabelo, cabeloNum: esconde ? null : prev.cabeloNum }; }); };
 const handleAcessorioPescocoChange = (n) => setPersonagem(p => ({...p, acessorioPescoco: n, acessPescocoNum: n ? mapeamentosParaNumeros.acessorioPescoco[n] : null }));
 const handleMarcasChange = (n) => setPersonagem(p => ({...p, marcas: n, marcaspadrao: n ? mapeamentosParaNumeros.marcas[n] : null }));

 const salvarPersonagem = async (ref, setDados, setImg) => { try { const canvas = await html2canvas(ref.current, { backgroundColor: null, scale: 0.45 }); const b64 = canvas.toDataURL('image/png'); setImg(b64); setDados({ ...personagem, img: b64 }); console.log("Salvo:", personagem); } catch (e) { console.error(e); } };
 
 const { genero, corPele, cabelo, corCabelo, acessoriosCabeca, acessorioPescoco, marcas, roupaCima, roupaCimaVariante, roupaBaixo, roupaBaixoVariante, sapato, sapatoVariante, armas } = personagem;

 const caminhosDasImagens = {
  corpo: genero === 'MASCULINO' ? `/personagem-MASCULINO/CORPO-MASCULINO-PELE/CORPO-MASCULINO-${corPele}.png` : `/personagem-FEMININO/CORPO-FEMININO-PELES/CORPO-FEMININO-${corPele}.png`,
  roupaCima: getCaminhoRoupaCima(roupaCima, roupaCimaVariante, genero),
  roupaBaixo: getCaminhoRoupaBaixo(roupaBaixo, roupaBaixoVariante, genero),
  sapato: getCaminhoSapato(sapato, sapatoVariante, genero),
  cabeloFrente: cabelo ? `/personagem-${genero}/CABELOS-${genero}/CABELO-${cabelo}/CABELO-${cabelo}-${corCabelo}.png` : null,
  cabeloFundo: (cabelo && opcoesDoPersonagem.estilosComCabeloFundo.includes(cabelo)) ? `/personagem-${genero}/CABELOS-${genero}/CABELO-FUNDO/CABELO-FUNDO-${corCabelo}.png` : null,
  
  acessoriosCabecaFundo: acessoriosCabeca.map(n => {
    if (getPosicaoAcessorio(n) === 'fundo') return getCaminhoAcessorio(n, genero);
    const info = ACESSORIOS_CABECA_MAPEADOS[n];
    if (info && info.itemPar) {
        const infoPar = ACESSORIOS_CABECA_MAPEADOS[info.itemPar];
        if (infoPar && infoPar.posicao === 'fundo') {
            return getCaminhoAcessorio(info.itemPar, genero);
        }
    }
    return null;
  }).filter(Boolean),

  acessoriosCabecaRosto: acessoriosCabeca.map(n => { const p = getCaminhoAcessorio(n, genero); return (p && getPosicaoAcessorio(n) === 'rosto') ? p : null }).filter(Boolean),
  acessoriosCabecaTopo: acessoriosCabeca.map(n => { const p = getCaminhoAcessorio(n, genero); return (p && getPosicaoAcessorio(n) === 'topo') ? p : null }).filter(Boolean),
  
  acessorioPescoco: getCaminhoAcessorio(acessorioPescoco, genero),
  marcas: getCaminhoAcessorio(marcas, genero),
  armas: getCaminhoArma(armas)
 };

const salvarPersonagemAdicionarCarrinho = async (refElemento, dadosExtras = {}) => {
  // refElemento: a referência do React (useRef) para tirar o print
  // dadosExtras: objeto vindo da página { nome: "...", historia: "..." }

  const usuarioId = localStorage.getItem('id_usuario');
  
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
      id_usuario: usuarioId, // ID do localStorage
      img: imgBase64,
      nome: dadosExtras.nome || 'Aventureiro Sem Nome',
      historia: dadosExtras.historia || ''
    };

    // ============================================================
    // 🔍 DEBUGGER VIZINHO: CHECKPOINT 1 (FRONTEND)
    // ============================================================
    console.group("%c 🛠️ FORJA DEBUG: Validação Industrial", "color: orange; font-weight: bold; font-size: 14px;");

    console.log(`👤 Identificação:`);
    console.log(`   Nome: ${payload.nome} | ID User: ${payload.id_usuario}`);

    console.log(`\n🧬 Genética (Base):`);
    console.log(`   Gênero:    "${payload.genero}"  -> Industrial: %c${payload.generoNum}`, "color: cyan; font-weight:bold");
    console.log(`   Pele:      "${payload.corPele}" -> Industrial: %c${payload.corPeleNum}`, "color: cyan; font-weight:bold");
    console.log(`   Cabelo:    "${payload.cabelo}"  -> Industrial: %c${payload.cabeloNum}`, "color: cyan; font-weight:bold");
    console.log(`   Cor Cabelo:"${payload.corCabelo}"-> Industrial: %c${payload.corCabeloNum}`, "color: cyan; font-weight:bold");

    console.log(`\n🧢 Acessórios & Detalhes:`);
    console.log(`   Marcas:    "${payload.marcas}" -> Padrão ID: %c${payload.marcaspadrao}`, "color: yellow; font-weight:bold");
    console.log(`   Pescoço:   "${payload.acessorioPescoco}" -> ID: %c${payload.acessPescocoNum}`, "color: yellow; font-weight:bold");
    console.log(`   Cabeça Lista: [${payload.acessoriosCabeca}]`);
    console.log(`   > Cabeça Base ID:   %c${payload.acessCabeca}`, "color: magenta; font-weight:bold");
    console.log(`   > Cabeça Padrão ID: %c${payload.acessCabecapadrao}`, "color: magenta; font-weight:bold");

    console.log(`\n👕 Torso (Indústria 4.0):`);
    console.log(`   Peça:      "${payload.roupaCima}"`);
    console.log(`   > Cor Bloco:    %c${payload.roupaCimaCorNum}`, "color: lime; font-weight:bold");
    console.log(`   > Padrão Face:  %c${payload.roupaCimaPadrao}`, "color: lime; font-weight:bold");
    console.log(`   > Var Símbolo:  %c${payload.roupaCimaVarPadrao} (Variante: ${payload.roupaCimaVariante})`, "color: lime; font-weight:bold");

    console.log(`\n👖 Pernas (Indústria 4.0):`);
    console.log(`   Peça:      "${payload.roupaBaixo}"`);
    console.log(`   > Cor Bloco:    %c${payload.roupaBaixoCorNum}`, "color: lime; font-weight:bold");
    console.log(`   > Padrão Face:  %c${payload.roupaBaixoPadrao}`, "color: lime; font-weight:bold");
    console.log(`   > Var Símbolo:  %c${payload.roupaBaixoVarPadrao} (Variante: ${payload.roupaBaixoVariante})`, "color: lime; font-weight:bold");

    console.log(`\n👟 Pés & ⚔️ Armas:`);
    console.log(`   Sapato:    "${payload.sapato}" -> CorNum: %c${payload.sapatoCorNum}`, "color: white; background: blue");
    console.log(`   Arma:      "${payload.armas}"  -> CorNum: %c${payload.armasCorNum} | Padrão: %c${payload.armasPadrao}`, "color: white; background: red");

    console.groupEnd();
    // ============================================================

    const url = 'https://forja-qvex.onrender.com/api/personagens';
    
    const response = await axios.post(url, payload);

    const novoPersonagemSalvo = response.data;

    console.log("Novo personagem salvo com sucesso! ID:", response.data.id);
    // Com Axios, a resposta já vem em response.data

    await adicionarAoCarrinho(novoPersonagemSalvo);
    return novoPersonagemSalvo;

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
  handleAcessoriosCabecaChange,
  handleAcessorioPescocoChange,
  handleMarcasChange,
  salvarPersonagemAdicionarCarrinho
 };
};