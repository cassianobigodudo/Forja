import { useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

// --- CORREÇÃO 1: MAPEAMENTOS ATUALIZADOS ---
// Organizado como você pediu (Base, Padrão, etc.)
const mapeamentosParaNumeros = {
 genero: { 'FEMININO': 2, 'MASCULINO': 3 },
 corPele: { 'NEGRA': 0, 'PARDA': 1, 'LEITE': 2, 'BRANCA': 3, 'VERDE': 4, 'LARANJA': 5, 'CINZA': 6 },
 cabelo: { 'CURTO': 0, 'LONGO': 1, 'AFRO': 2, 'DREAD': 3, 'RABODECAVALO': 4, 'RASPADO': 5 },
 corCabelo: { 'PRETO': '1', 'VERMELHO': '2', 'LOIRO': '3', 'BRANCO': '4' },
 marcas: { // Marcas agora usam STRING
    'CICATRIZ-NARIZ': '1',
    'CICATRIZ-OLHO': '2',
    'SARDAS': '3',
  },
  // Acessórios de Cabeça divididos em Base (Number) e Padrão (String)
 acessCabecaBase: {
   'CAPACETE-CAVALEIRO': 0,
   'CAPACETE-DARK': 1,
   'CAPACETE-TRIBAL-MASCARA': 2,
   'MASCARA': 3,
   'CAPACETE-MADEIRA': 4,
   'CAPACETE-TRIBAL': 5,
   // 'CHAPEU-SOL-TOPO' e 'CHAPEU-SOL-EMBAIXO' são tratados como o mesmo item Base
   'CHAPEU-SOL-TOPO': 6,
   'CHAPEU-SOL-EMBAIXO': 6, 
  },
 acessCabecaPadrao: {
   'ARGOLA': '1',
   'OCULOS': '2',
  },
 acessorioPescoco: {
   'COLAR': 0, 
  }
};

// --- (Lógica interna do Hook, baseada nos Nomes) ---
const ITENS_EXCLUSIVOS = {
  'MASCARA': true,
  'CAPACETE-TRIBAL-MASCARA': true,
  'CAPACETE-CAVALEIRO': true,
  'CAPACETE-DARK': true,
  'CAPACETE-MADEIRA': true,
  'CAPACETE-TRIBAL': true
};
const ITENS_BASE = { // Itens que são "Base"
  'CHAPEU-SOL-TOPO': true,
  ...ITENS_EXCLUSIVOS
};


// --- CONSTANTE DE ACESSÓRIOS QUE ESCONDEM CABELO ---
const ACESSORIOS_ESCONDEM_CABELO = {
  'CAPACETE-CAVALEIRO': true,
  'CAPACETE-DARK': true,
  'CAPACETE-TRIBAL-MASCARA': true,
  'MASCARA': true
};

// --- (Mapeamentos de Imagem - Inalterados) ---
const ACESSORIOS_CABECA_MAPEADOS = {
 'CAPACETE-CAVALEIRO': { nome: 'CAPACETE-CAVALEIRO', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-DARK': { nome: 'CAPACETE-DARK', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-MADEIRA': { nome: 'CAPACETE-MADEIRA', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-TRIBAL-MASCARA': { nome: 'CAPACETE-TRIBAL-MASCARA', categoria: 'CAPACETES', posicao: 'topo' },
 'CAPACETE-TRIBAL': { nome: 'CAPACETE-TRIBAL', categoria: 'CAPACETES', posicao: 'topo' },
 'MASCARA': { nome: 'MASCARA', categoria: 'CAPACETES', posicao: 'topo' },
 'ARGOLA': { nome: 'ARGOLA', categoria: 'REPETIVEIS', posicao: 'rosto' },
 'CHAPEU-SOL-EMBAIXO': { nome: 'CHAPEU-SOL-EMBAIXO', categoria: 'REPETIVEIS', posicao: 'fundo' },
 'CHAPEU-SOL-TOPO': { 
     nome: 'CHAPEU-SOL-TOPO', 
     categoria: 'REPETIVEIS', 
     itemPar: 'CHAPEU-SOL-EMBAIXO',
     posicao: 'topo'
  },
 'OCULOS': { nome: 'OCULOS', categoria: 'REPETIVEIS', posicao: 'rosto' }
};

const ACESSORIOS_PESCOCO_MAPEADOS = {
 'COLAR': { nome: 'COLAR', categoria: 'PESCOÇO' }
};

const MARCAS_MAPEADAS = {
 'CICATRIZ-NARIZ': { nome: 'CICATRIZ-NARIZ', categoria: 'MARCAS' },
 'CICATRIZ-OLHO': { nome: 'CICATRIZ-OLHO', categoria: 'MARCAS' },
 'SARDAS': { nome: 'SARDAS', categoria: 'MARCAS' }
};

// --- Helpers (Inalterados) ---
const getPosicaoAcessorio = (nomeItem) => {
  if (!nomeItem) return null;
  const infoItem = ACESSORIOS_CABECA_MAPEADOS[nomeItem]; 
  if (infoItem && infoItem.posicao) {
    return infoItem.posicao;
  }
  return 'topo'; 
};

const getCaminhoAcessorio = (nomeItem, genero) => {
  if (!nomeItem) return null; 
  const infoItem = ACESSORIOS_CABECA_MAPEADOS[nomeItem] || 
                   ACESSORIOS_PESCOCO_MAPEADOS[nomeItem] ||
                   MARCAS_MAPEADAS[nomeItem];
  if (!infoItem) return null;
  return `/personagem-${genero}/ACESSORIOS-${genero}S/${infoItem.categoria}/${infoItem.nome}.png`;
};

// --- Opções do Personagem (Inalterado) ---
const opcoesDoPersonagem = {
 cabelo: {
  MASCULINO: ['CURTO', 'LONGO'],
  FEMININO: ['AFRO', 'CURTO', 'DREAD', 'LONGO', 'RABODECAVALO', 'RASPADO']
 },
// ... (resto das opções)
 corCabelo: [
  { nome: 'PRETO', color: '#1a1a1a' },
  { nome: 'VERMELHO', color: '#c43a3a' },
  { nome: 'LOIRO', color: '#f5d453' },
  { nome: 'BRANCO', color: '#e0e0e0' },
 ],
 corPele: [
  { nome: 'NEGRA', color: '#3b2010ff' }, { nome: 'PARDA', color: '#8C5230' },
  { nome: 'LEITE', color: '#D2A17C' }, { nome: 'BRANCA', color: '#F9E4D4' },
  { nome: 'VERDE', color: '#4d771eff' }, { nome: 'LARANJA', color: '#c26632ff' },
  { nome: 'CINZA', color: '#99af9eff' },
 ],
 estilosComCabeloFundo: ['LONGO', 'RABODECAVALO'],
};

// --- CORREÇÃO 2: ESTADO INICIAL ATUALIZADO ---
// Mantém os nomes (para UI) E os novos IDs (para o Backend)
const estadoInicialDoPersonagem = {
 genero: 'FEMININO',
 generoNum: 2,
 corPele: 'NEGRA',
 corPeleNum: 0,
 cabelo: 'CURTO', 
 cabeloNum: 0, 
 corCabelo: 'PRETO', 
 corCabeloNum: '1', 

  // Variáveis para a UI (Menus)
 acessoriosCabeca: ['CHAPEU-SOL-TOPO', 'ARGOLA'], // Nomes para o MenuAcessorios
 acessorioPescoco: 'COLAR', // Nome para o MenuAcessorios
 marcas: 'CICATRIZ-NARIZ', // Nome para o MenuMarcas

  // Variáveis para o Backend (Novos Nomes e Tipos)
 acessCabeca: 6, // ID Base (Number) - CHAPEU-SOL-TOPO
 acessCabecapadrao: '1', // ID Padrão (String) - ARGOLA
 acessPescocoNum: 0, // ID Pescoco (Number) - COLAR
 marcaspadrao: '1', // ID Marcas (String) - CICATRIZ-NARIZ

 img: '',
 historia: '',
 roupaCima: '',
 roupaCima1Num: '',
 roupaCima2Num: '',
 roupaCimaVariante: '',
 roupaCimaVariante1Num: '',
 roupaCimaVariante2Num: '',
 armas: '',
 armas1Num: '',
 armas2Num: '',
 baseMini: '',
 baseMiniNum: '',
 roupaBaixo: '',
 roupaBaixo1Num: '',
 roupaBaixo2Num: '',
 roupaBaixoVariante: '',
 roupaBaixoVariante1Num: 6,
 roupaBaixoVariante2Num: '',
 sapato: '',
 sapatoNum: '',
 sapatoVariante: '',
 sapatoVarianteNum: '',
};

// --- HOOK ---
export const useLogicaCustomizacao = () => {

 const [personagem, setPersonagem] = useState(estadoInicialDoPersonagem);

 // --- ATUALIZAR PERSONAGEM (Cabelo/Gênero) ---
 const atualizarPersonagem = (caracteristica, novoValor) => {
  setPersonagem(estadoAnterior => {
    let novoEstado = { ...estadoAnterior };
    let valorFinal = novoValor;
    
    const estaDesmarcandoCabelo = caracteristica === 'cabelo' && estadoAnterior.cabelo === novoValor;
    if (estaDesmarcandoCabelo) {
     valorFinal = null;
    }

    novoEstado[caracteristica] = valorFinal;

    // Lógica para Cabelo e CorCabelo (que já funcionava)
    const caracteristicaNumerica = `${caracteristica}Num`;
    if (mapeamentosParaNumeros[caracteristica] && valorFinal) { 
     novoEstado[caracteristicaNumerica] = mapeamentosParaNumeros[caracteristica][valorFinal];
    } else if (mapeamentosParaNumeros[caracteristica]) {
     novoEstado[caracteristicaNumerica] = null;
    }

    // Lógica para remover acessório se escolher cabelo
    if (caracteristica === 'cabelo' && valorFinal) {
      const acessoriosAtuais = estadoAnterior.acessoriosCabeca;
      const temAcessorioIncompativel = acessoriosAtuais.some(item => ACESSORIOS_ESCONDEM_CABELO[item]);
      
      if (temAcessorioIncompativel) {
        novoEstado.acessoriosCabeca = [];
        novoEstado.acessCabeca = null;
        novoEstado.acessCabecapadrao = null;
      }
    }

    // Lógica para resetar ao mudar de gênero
    const mudouDeGenero = caracteristica === 'genero' && estadoAnterior.genero !== novoValor;
    if (mudouDeGenero) {
     novoEstado.cabelo = null;
     novoEstado.cabeloNum = null;
     novoEstado.acessoriosCabeca = [];
     novoEstado.acessorioPescoco = null;
     novoEstado.marcas = null;
     novoEstado.acessCabeca = null;
     novoEstado.acessCabecapadrao = null;
     novoEstado.acessPescocoNum = null;
     novoEstado.marcaspadrao = null;
    }
    
    return novoEstado;
  });
 };

  // --- CORREÇÃO 3: HANDLER DE ACESSÓRIOS CABEÇA (Nova Lógica) ---
 const handleAcessoriosCabecaChange = (novoArray) => {
  setPersonagem(estadoAnterior => {

    let itemBase = null;
    let itemPadrao = null;
    
    // 1. Interpreta o array de Nomes vindo do Menu
    novoArray.forEach(item => {
      if (ITENS_BASE[item]) {
        itemBase = item; // É um item "Base" (Capacete, Chapéu)
      } else {
        itemPadrao = item; // É um item "Padrão" (Óculos, Argola)
      }
    });

    // 2. Converte Nomes para IDs (com os tipos corretos)
  	const numBase = itemBase ? mapeamentosParaNumeros.acessCabecaBase[itemBase] : null; // <-- NUMBER
  	const strPadrao = itemPadrao ? mapeamentosParaNumeros.acessCabecaPadrao[itemPadrao] : null; // <-- STRING

    const escondeCabelo = novoArray.some(item => ACESSORIOS_ESCONDEM_CABELO[item]);
    let novoCabelo = estadoAnterior.cabelo;
    let novoCabeloNum = estadoAnterior.cabeloNum;

    if (escondeCabelo) {
      novoCabelo = null;
      novoCabeloNum = null;
    }

    return {
     ...estadoAnterior,
     acessoriosCabeca: novoArray, // <-- Salva Nomes para a UI
     acessCabeca: numBase, // <-- Salva ID Base (Number)
     acessCabecapadrao: strPadrao, // <-- Salva ID Padrão (String)
     cabelo: novoCabelo,
     cabeloNum: novoCabeloNum
    };
  });
 };

  // --- CORREÇÃO 4: HANDLER DE PESCOÇO (Nova Lógica) ---
 const handleAcessorioPescocoChange = (novoItem) => {
  setPersonagem(estadoAnterior => {
    // Busca o ID no mapeamento correto
    const num = novoItem ? mapeamentosParaNumeros.acessorioPescoco[novoItem] : null; // <-- NUMBER

    return {
     ...estadoAnterior,
     acessorioPescoco: novoItem, // <-- Salva Nome para a UI
     acessPescocoNum: num // <-- Salva ID (Number)
    };
  });
 };

  // --- CORREÇÃO 5: HANDLER DE MARCAS (Nova Lógica) ---
  const handleMarcasChange = (novoItem) => {
    setPersonagem(estadoAnterior => {
      // O MenuMarcas só envia um item (a "Marca")
      // O seu mapeamento de 'marcas' agora retorna STRING
      const strMarca = novoItem ? mapeamentosParaNumeros.marcas[novoItem] : null; // <-- STRING
  
      return {
       ...estadoAnterior,
       marcas: novoItem, // <-- Salva Nome para a UI
       marcaspadrao: strMarca // <-- Salva ID (String)
      };
    });
  };
 
  // --- Salvar Personagem (Inalterado) ---
 const salvarPersonagem = async (referenciaDoElemento, setDadosDoPersonagem, setImagemPersonagem) => {
  try {
    const canvas = await html2canvas(referenciaDoElemento.current, { backgroundColor: null, scale: 0.45 });
    const imagemEmBase64 = canvas.toDataURL('image/png');
    // 'personagem' já contém 'acessCabeca', 'acessCabecapadrao', 'marcaspadrao', etc.
    const personagemCompleto = { ...personagem, img: imagemEmBase64 };

    setImagemPersonagem(imagemEmBase64);
    setDadosDoPersonagem(personagemCompleto);

    console.log("Enviando os seguintes dados:", personagemCompleto);
    const resposta = await axios.post('http://localhost:3000/pedidos', personagemCompleto);
    console.log("Personagem salvo com sucesso:", resposta.data);

  } catch (erro) {
    console.error('Erro ao salvar o personagem:', erro);
  }
 };
 
  // --- Destructuring (Nomes para a UI/Render) ---
 const { 
    genero, 
    corPele, 
    cabelo, 
    corCabelo, 
    acessoriosCabeca, // <-- O array de Nomes
    acessorioPescoco, // <-- O Nome
    marcas // <-- O Nome
  } = personagem;

 // --- Caminhos de Corpo e Cabelo (Inalterados) ---
 let caminhoBaseCorpo = '';
 if (genero === 'MASCULINO') {
  caminhoBaseCorpo = `/personagem-MASCULINO/CORPO-MASCULINO-PELE/CORPO-MASCULINO-${corPele}.png`;
 } else {
  caminhoBaseCorpo = `/personagem-FEMININO/CORPO-FEMININO-PELES/CORPO-FEMININO-${corPele}.png`;
 } 

 const pastaBaseCabelo = `/personagem-${genero}/CABELOS-${genero}`;

 let caminhoCabeloFrente = null;
 if (cabelo) {
  if (genero === 'MASCULINO') { 
    caminhoCabeloFrente = `${pastaBaseCabelo}/CABELO-${cabelo}/CABELO-${genero}-${cabelo}-${corCabelo}.png`;
  } else {
    caminhoCabeloFrente = `${pastaBaseCabelo}/CABELO-${cabelo}/CABELO-${cabelo}-${corCabelo}.png`;
  }
 }
 
 let caminhoCabeloFundo = null;
 const precisaDeCabeloFundo = opcoesDoPersonagem.estilosComCabeloFundo.includes(cabelo);
 
 if (precisaDeCabeloFundo) {
  if (genero === 'MASCULINO') {
    caminhoCabeloFundo = `${pastaBaseCabelo}/CABELO-FUNDO/CABELO-${genero}-FUNDO-${corCabelo}.png`;
  } else {
    caminhoCabeloFundo = `${pastaBaseCabelo}/CABELO-FUNDO/CABELO-FUNDO-${corCabelo}.png`;
  }
 }

  // --- Lógica de Renderização (Inalterada) ---
  // Esta lógica usa o array 'acessoriosCabeca' de Nomes,
  // por isso não precisamos mudá-la.
  const acessoriosCabecaFundo = [];
  const acessoriosCabecaRosto = [];
  const acessoriosCabecaTopo = [];

  acessoriosCabeca.forEach(nomeItem => {
    const infoItem = ACESSORIOS_CABECA_MAPEADOS[nomeItem];
    if (!infoItem) return; 

    const caminhoPrincipal = getCaminhoAcessorio(nomeItem, genero);
    if (caminhoPrincipal) {
      const posicao = getPosicaoAcessorio(nomeItem);
      
      if (posicao === 'fundo') {
        acessoriosCabecaFundo.push(caminhoPrincipal);
      } else if (posicao === 'rosto') {
        acessoriosCabecaRosto.push(caminhoPrincipal);
      } else { // 'topo'
        acessoriosCabecaTopo.push(caminhoPrincipal);
      }
    }
    
    if (infoItem.itemPar) {
        const nomeItemPar = infoItem.itemPar; 
        const caminhoPar = getCaminhoAcessorio(nomeItemPar, genero);
        
        if (caminhoPar) {
            const posicaoPar = getPosicaoAcessorio(nomeItemPar);
            if (posicaoPar === 'fundo') {
                acessoriosCabecaFundo.push(caminhoPar);
            } else if (posicaoPar === 'rosto') {
                acessoriosCabecaRosto.push(caminhoPar);
            } else {
                acessoriosCabecaTopo.push(caminhoPar);
            }
        }
    }
  });

  const caminhoAcessorioPescoco = getCaminhoAcessorio(acessorioPescoco, genero);
  const caminhoMarcas = getCaminhoAcessorio(marcas, genero);


 const caminhosDasImagens = {
  corpo: caminhoBaseCorpo,
  cabeloFrente: caminhoCabeloFrente,
  cabeloFundo: caminhoCabeloFundo,
  acessoriosCabecaFundo: acessoriosCabecaFundo,
  acessoriosCabecaRosto: acessoriosCabecaRosto,
  acessoriosCabecaTopo: acessoriosCabecaTopo,
  acessorioPescoco: caminhoAcessorioPescoco,
  marcas: caminhoMarcas
 };

 return { 
  personagem, 
  atualizarPersonagem, 
    handleAcessoriosCabecaChange,
    handleAcessorioPescocoChange,
    handleMarcasChange,
  salvarPersonagem, 
  caminhosDasImagens, 
  opcoesDoPersonagem 
 };
};