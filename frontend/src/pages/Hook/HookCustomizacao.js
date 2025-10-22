import { useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

// --- MAPEAMENTOS ATUALIZADOS ---
const mapeamentosParaNumeros = {
 genero: { 'FEMININO': 2, 'MASCULINO': 3 },
 corPele: { 'NEGRA': 0, 'PARDA': 1, 'LEITE': 2, 'BRANCA': 3, 'VERDE': 4, 'LARANJA': 5, 'CINZA': 6 },
 cabelo: { 'CURTO': 0, 'LONGO': 1, 'AFRO': 2, 'DREAD': 3, 'RABODECAVALO': 4, 'RASPADO': 5 },
 corCabelo: { 'PRETO': '1', 'VERMELHO': '2', 'LOIRO': '3', 'BRANCO': '4' },
 acessorios: {
  // Cabeça
  'CAPACETE-CAVALEIRO': 0,
  'CAPACETE-DARK': 1,
  'CAPACETE-MADEIRA': 2,
  'CAPACETE-TRIBAL-MASCARA': 3,
  'CAPACETE-TRIBAL': 4,
  'MASCARA': 5,
  'ARGOLA': 6,
  'CHAPEU-SOL-EMBAIXO': 7,
  'CHAPEU-SOL-TOPO': 8,
  'OCULOS': 9,
  // Pescoço
  'COLAR': 0 
 }
};

// --- INFORMAÇÕES DOS ACESSÓRIOS ---
const ACESSORIOS_CABECA_MAPEADOS = {
 'CAPACETE-CAVALEIRO': { nome: 'CAPACETE-CAVALEIRO', categoria: 'CAPACETES' },
 'CAPACETE-DARK': { nome: 'CAPACETE-DARK', categoria: 'CAPACETES' },
 'CAPACETE-MADEIRA': { nome: 'CAPACETE-MADEIRA', categoria: 'CAPACETES' },
 'CAPACETE-TRIBAL-MASCARA': { nome: 'CAPACETE-TRIBAL-MASCARA', categoria: 'CAPACETES' },
 'CAPACETE-TRIBAL': { nome: 'CAPACETE-TRIBAL', categoria: 'CAPACETES' },
 'MASCARA': { nome: 'MASCARA', categoria: 'CAPACETES' },
 'ARGOLA': { nome: 'ARGOLA', categoria: 'REPETIVEIS' },
 'CHAPEU-SOL-EMBAIXO': { nome: 'CHAPEU-SOL-EMBAIXO', categoria: 'REPETIVEIS' },
 'CHAPEU-SOL-TOPO': { nome: 'CHAPEU-SOL-TOPO', categoria: 'REPETIVEIS' },
 'OCULOS': { nome: 'OCULOS', categoria: 'REPETIVEIS' }
};

const ACESSORIOS_PESCOCO_MAPEADOS = {
 'COLAR': { nome: 'COLAR', categoria: 'PESCOCO' }
};

// Helper para gerar caminhos (CORRIGIDO com caminho absoluto '/')
const getCaminhoAcessorio = (nomeItem, genero) => {
  if (!nomeItem) return null; 
  
  const infoItem = ACESSORIOS_CABECA_MAPEADOS[nomeItem] || ACESSORIOS_PESCOCO_MAPEADOS[nomeItem];
  if (!infoItem) return null;
  
  // CORRIGIDO: Removido o '.' do início
  return `/personagem-${genero}/ACESSORIOS-${genero}S/${infoItem.categoria}/${infoItem.nome}.png`;
};

const opcoesDoPersonagem = {
 cabelo: {
  MASCULINO: ['CURTO', 'LONGO'],
  FEMININO: ['AFRO', 'CURTO', 'DREAD', 'LONGO', 'RABODECAVALO', 'RASPADO']
 },
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

// --- ESTADO INICIAL ATUALIZADO ---
const estadoInicialDoPersonagem = {
 genero: 'FEMININO',
 generoNum: 2,
 corPele: 'NEGRA',
 corPeleNum: 0,
 cabelo: 'CURTO',
 cabeloNum: 0,
 corCabelo: 'PRETO',
 corCabeloNum: '1',

 acessoriosCabeca: [], // Usa array
 acessorioPescoco: null, // Usa null
  
 acessCabeca1Num: null,
 acessCabeca2Num: null,
 acessPescocoNum: null,

 img: '',
 historia: '',
 marcas: '',
 marcasNum: '',
 roupaCima: '',
 roupaCima1Num: '',
 roupaCima2Num: '',
 roupaCimaVariante: '',
 roupaCimaVariante1Num: 6,
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

export const useLogicaCustomizacao = () => {
 const [personagem, setPersonagem] = useState(estadoInicialDoPersonagem);

 const atualizarPersonagem = (caracteristica, novoValor) => {
  setPersonagem(estadoAnterior => {
   let novoEstado = { ...estadoAnterior };
   let valorFinal = novoValor;
   
   const estaDesmarcandoCabelo = caracteristica === 'cabelo' && estadoAnterior.cabelo === novoValor;
   if (estaDesmarcandoCabelo) {
    valorFinal = null;
   }

   novoEstado[caracteristica] = valorFinal;

   const caracteristicaNumerica = `${caracteristica}Num`;
   const temMapeamento = mapeamentosParaNumeros[caracteristica] && valorFinal;

   if (temMapeamento) {
    novoEstado[caracteristicaNumerica] = mapeamentosParaNumeros[caracteristica][valorFinal];
   } else {
    novoEstado[caracteristicaNumerica] = null;
   }

   const mudouDeGenero = caracteristica === 'genero' && estadoAnterior.genero !== novoValor;
   if (mudouDeGenero) {
    novoEstado.cabelo = null;
    novoEstado.cabeloNum = null;
    novoEstado.acessoriosCabeca = [];
    novoEstado.acessorioPescoco = null;
    novoEstado.acessCabeca1Num = null;
    novoEstado.acessCabeca2Num = null;
    novoEstado.acessPescocoNum = null;
   }
   
   return novoEstado;
  });
 };

  // --- HANDLER DE CABEÇA (ADICIONADO) ---
 const handleAcessoriosCabecaChange = (novoArray) => {
  setPersonagem(estadoAnterior => {
   const item1 = novoArray[0] || null;
   const item2 = novoArray[1] || null;

   const num1 = item1 ? mapeamentosParaNumeros.acessorios[item1] : null;
   const num2 = item2 ? mapeamentosParaNumeros.acessorios[item2] : null;

   return {
    ...estadoAnterior,
    acessoriosCabeca: novoArray, 
    acessCabeca1Num: num1,
    acessCabeca2Num: num2
   };
  });
 };

  // --- HANDLER DE PESCOÇO (ADICIONADO) ---
 const handleAcessorioPescocoChange = (novoItem) => {
  setPersonagem(estadoAnterior => {
        // --- CORREÇÃO AQUI ---
   const num = novoItem ? mapeamentosParaNumeros.acessorios[novoItem] : null;

   return {
    ...estadoAnterior,
    acessorioPescoco: novoItem, 
    acessPescocoNum: num
   };
  });
 };

 const salvarPersonagem = async (referenciaDoElemento, setDadosDoPersonagem, setImagemPersonagem) => {
  try {
   const canvas = await html2canvas(referenciaDoElemento.current, { backgroundColor: null, scale: 0.45 });
   const imagemEmBase64 = canvas.toDataURL('image/png');
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
 
 const { 
    genero, 
    corPele, 
    cabelo, 
    corCabelo, 
    acessoriosCabeca, 
    acessorioPescoco 
  } = personagem;

  // --- CAMINHOS DE IMAGEM CORRIGIDOS (sem './') ---
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

 const caminhoAcessorioCabeca1 = getCaminhoAcessorio(acessoriosCabeca[0], genero);
 const caminhoAcessorioCabeca2 = getCaminhoAcessorio(acessoriosCabeca[1], genero);
 const caminhoAcessorioPescoco = getCaminhoAcessorio(acessorioPescoco, genero);


 const caminhosDasImagens = {
  corpo: caminhoBaseCorpo,
  cabeloFrente: caminhoCabeloFrente,
  cabeloFundo: caminhoCabeloFundo,
  acessorioCabeca1: caminhoAcessorioCabeca1,
  acessorioCabeca2: caminhoAcessorioCabeca2,
  acessorioPescoco: caminhoAcessorioPescoco
 };

 return { 
  personagem, 
  atualizarPersonagem, 
    handleAcessoriosCabecaChange,
    handleAcessorioPescocoChange,
  salvarPersonagem, 
  caminhosDasImagens, 
  opcoesDoPersonagem 
 };
};
