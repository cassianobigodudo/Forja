import { useState } from 'react';
import html2canvas from 'html2canvas';

// --- MAPEAMENTOS ---
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
  // IDs fictícios para roupas
  roupaCima: { 
    'Besourto': 1, 'Guerreiro': 2, 'Ladino': 3, 'Limpo': 4, 
    'Marcial': 5, 'Monge': 6, 'Regalia': 7, 'Social': 8 
  }
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
 'CHAPEU-SOL-EMBAIXO': { nome: 'CHAPEU-SOL-EMBAIXO', categoria: 'REPETIVEIS', posicao: 'fundo' },
 'CHAPEU-SOL-TOPO': { nome: 'CHAPEU-SOL-TOPO', categoria: 'REPETIVEIS', itemPar: 'CHAPEU-SOL-EMBAIXO', posicao: 'topo' },
 'OCULOS': { nome: 'OCULOS', categoria: 'REPETIVEIS', posicao: 'rosto' }
};

const ACESSORIOS_PESCOCO_MAPEADOS = { 'COLAR': { nome: 'COLAR', categoria: 'PESCOÇO' } };
const MARCAS_MAPEADAS = {
 'CICATRIZ-NARIZ': { nome: 'CICATRIZ-NARIZ', categoria: 'MARCAS' },
 'CICATRIZ-OLHO': { nome: 'CICATRIZ-OLHO', categoria: 'MARCAS' },
 'SARDAS': { nome: 'SARDAS', categoria: 'MARCAS' }
};

// --- Helper Caminhos ---
const getPosicaoAcessorio = (nomeItem) => ACESSORIOS_CABECA_MAPEADOS[nomeItem]?.posicao || 'topo';

const getCaminhoAcessorio = (nomeItem, genero) => {
  if (!nomeItem) return null; 
  const infoItem = ACESSORIOS_CABECA_MAPEADOS[nomeItem] || ACESSORIOS_PESCOCO_MAPEADOS[nomeItem] || MARCAS_MAPEADAS[nomeItem];
  return infoItem ? `/personagem-${genero}/ACESSORIOS-${genero}S/${infoItem.categoria}/${infoItem.nome}.png` : null;
};

// --- HELPER: Caminho Torso ---
const getCaminhoRoupaCima = (nomeItem, variante, genero) => {
    if (!nomeItem) return null;
    let varSufixo = variante || 'top-1';

    // Correção baseada na sua imagem (Besourto usa T maiúsculo)
    if (nomeItem === 'Besourto' && varSufixo === 'top-1') {
        varSufixo = 'Top-1';
    }

    // Estrutura de pasta: /personagem-MASCULINO/CORPO-MASCULINO-PELE/ROUPAS-TORSO/Nome-top-1.png
    return `/personagem-${genero}/CORPO-${genero}-PELE/ROUPAS-TORSO/${nomeItem}-${varSufixo}.png`;
};

// --- Opções ---
const opcoesDoPersonagem = {
 cabelo: { MASCULINO: ['AFRO', 'CURTO', 'DREAD', 'LONGO', 'LOCO', 'RASPADO'], FEMININO: ['AFRO', 'CURTO', 'DREAD', 'LONGO', 'LOCO', 'RASPADO'] },
 corCabelo: [ { nome: 'PRETO', color: '#1a1a1a' }, { nome: 'VERMELHO', color: '#c43a3a' }, { nome: 'LOIRO', color: '#f5d453' }, { nome: 'BRANCO', color: '#e0e0e0' } ],
 corPele: [ { nome: 'NEGRA', color: '#3b2010ff' }, { nome: 'PARDA', color: '#8C5230' }, { nome: 'LEITE', color: '#D2A17C' }, { nome: 'BRANCA', color: '#F9E4D4' }, { nome: 'VERDE', color: '#4d771eff' }, { nome: 'LARANJA', color: '#c26632ff' }, { nome: 'CINZA', color: '#99af9eff' } ],
 estilosComCabeloFundo: ['AFRO'],
 // Listas de Roupas
 roupaCima: ['Besourto', 'Guerreiro', 'Ladino', 'Limpo', 'Marcial', 'Monge', 'Regalia', 'Social'],
 roupaCimaVariantes: ['top-1'], // Adicione 'top-2' aqui se tiver variações de cor
};

// --- Estado Inicial ---
const estadoInicialDoPersonagem = {
 genero: 'FEMININO', generoNum: 2, corPele: 'NEGRA', corPeleNum: 0,
 cabelo: 'CURTO', cabeloNum: 0, corCabelo: 'PRETO', corCabeloNum: '1', 
 acessoriosCabeca: ['CHAPEU-SOL-TOPO', 'ARGOLA'], acessorioPescoco: 'COLAR', marcas: 'CICATRIZ-NARIZ',
 
 // Estados do Torso
 roupaCima: 'Guerreiro', 
 roupaCimaVariante: 'top-1', 
 roupaCima1Num: '', 

 acessCabeca: 6, acessCabecapadrao: '1', acessPescocoNum: 0, marcaspadrao: '1', 
 img: '', historia: '', armas: '', baseMini: '', roupaBaixo: '', sapato: ''
};

// --- HOOK ---
export const useLogicaCustomizacao = () => {
 const [personagem, setPersonagem] = useState(estadoInicialDoPersonagem);

 const atualizarPersonagem = (caracteristica, novoValor) => {
  setPersonagem(prev => {
   let novoEstado = { ...prev };
   let valorFinal = novoValor;
   
   if (caracteristica === 'cabelo' && prev.cabelo === novoValor) valorFinal = null;
   novoEstado[caracteristica] = valorFinal;

   // Lógica Numérica Genérica
   const keyNum = `${caracteristica}Num`;
   if (mapeamentosParaNumeros[caracteristica]) novoEstado[keyNum] = valorFinal ? mapeamentosParaNumeros[caracteristica][valorFinal] : null;

   // Regras Cabelo
   if (caracteristica === 'cabelo' && valorFinal && prev.acessoriosCabeca.some(i => ACESSORIOS_ESCONDEM_CABELO[i])) {
       novoEstado.acessoriosCabeca = []; novoEstado.acessCabeca = null; novoEstado.acessCabecapadrao = null;
   }
   // Regras Gênero
   if (caracteristica === 'genero' && prev.genero !== novoValor) {
     novoEstado.cabelo = null; novoEstado.cabeloNum = null; 
     novoEstado.acessoriosCabeca = []; novoEstado.acessorioPescoco = null; novoEstado.marcas = null;
     // novoEstado.roupaCima = null; // (Opcional) resetar roupa
   }
   return novoEstado;
  });
 };

 const handleAcessoriosCabecaChange = (arr) => {
  setPersonagem(prev => {
    let base = null, padrao = null;
    arr.forEach(i => ITENS_BASE[i] ? base = i : padrao = i);
    const esconde = arr.some(i => ACESSORIOS_ESCONDEM_CABELO[i]);
    return { ...prev, acessoriosCabeca: arr, acessCabeca: base ? mapeamentosParaNumeros.acessCabecaBase[base] : null, acessCabecapadrao: padrao ? mapeamentosParaNumeros.acessCabecaPadrao[padrao] : null, cabelo: esconde ? null : prev.cabelo, cabeloNum: esconde ? null : prev.cabeloNum };
  });
 };

 const handleAcessorioPescocoChange = (n) => setPersonagem(p => ({...p, acessorioPescoco: n, acessPescocoNum: n ? mapeamentosParaNumeros.acessorioPescoco[n] : null }));
 const handleMarcasChange = (n) => setPersonagem(p => ({...p, marcas: n, marcaspadrao: n ? mapeamentosParaNumeros.marcas[n] : null }));

 const salvarPersonagem = async (ref, setDados, setImg) => {
  try {
    const canvas = await html2canvas(ref.current, { backgroundColor: null, scale: 0.45 });
    const b64 = canvas.toDataURL('image/png');
    setImg(b64); setDados({ ...personagem, img: b64 });
    console.log("Salvo:", personagem);
  } catch (e) { console.error(e); }
 };
 
 const { genero, corPele, cabelo, corCabelo, acessoriosCabeca, acessorioPescoco, marcas, roupaCima, roupaCimaVariante } = personagem;

 // --- Geração dos Caminhos ---
 const caminhoBaseCorpo = genero === 'MASCULINO' ? `/personagem-MASCULINO/CORPO-MASCULINO-PELE/CORPO-MASCULINO-${corPele}.png` : `/personagem-FEMININO/CORPO-FEMININO-PELES/CORPO-FEMININO-${corPele}.png`;
 const pastaBaseCabelo = `/personagem-${genero}/CABELOS-${genero}`;
 const caminhoCabeloFrente = cabelo ? `${pastaBaseCabelo}/CABELO-${cabelo}/CABELO-${cabelo}-${corCabelo}.png` : null;
 const caminhoCabeloFundo = (cabelo && opcoesDoPersonagem.estilosComCabeloFundo.includes(cabelo)) ? `${pastaBaseCabelo}/CABELO-FUNDO/CABELO-FUNDO-${corCabelo}.png` : null;
 
 // Caminho Torso
 const caminhoRoupaCima = getCaminhoRoupaCima(roupaCima, roupaCimaVariante, genero);

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
  roupaCima: caminhoRoupaCima, // <-- Novo
  cabeloFrente: caminhoCabeloFrente, cabeloFundo: caminhoCabeloFundo,
  acessoriosCabecaFundo, acessoriosCabecaRosto, acessoriosCabecaTopo,
  acessorioPescoco: getCaminhoAcessorio(acessorioPescoco, genero),
  marcas: getCaminhoAcessorio(marcas, genero)
 };

 return { personagem, atualizarPersonagem, handleAcessoriosCabecaChange, handleAcessorioPescocoChange, handleMarcasChange, salvarPersonagem, caminhosDasImagens, opcoesDoPersonagem };
};