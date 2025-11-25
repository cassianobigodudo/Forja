import { useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

const mapeamentosParaNumeros = {
    genero: { 'FEMININO': 2, 'MASCULINO': 3 },
    corPele: { 'NEGRA': 0, 'PARDA': 1, 'LEITE': 2, 'BRANCA': 3, 'VERDE': 4, 'LARANJA': 5, 'CINZA': 6 },
    cabelo: { 'CURTO': 0, 'LONGO': 1, 'AFRO': 2, 'DREAD': 3, 'RABODECAVALO': 4, 'RASPADO': 5 },
    corCabelo: { 'PRETO': '1', 'VERMELHO': '2', 'LOIRO': '3', 'BRANCO': '4' }
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

const estadoInicialDoPersonagem = {
    genero: 'FEMININO',
    generoNum: 2,
    corPele: 'NEGRA',
    corPeleNum: 0,
    cabelo: 'CURTO',
    cabeloNum: 0,
    corCabelo: 'PRETO',
    corCabeloNum: '1',
    img: '',
    historia: '',
    marcas: '',
    marcasNum: '',
    acessCabeca: '',
    acessCabeca1Num: '',
    acessCabeca2Num: '',
    acessPescoco: '',
    acessPescocoNum: '',
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
            }
            
            return novoEstado;
        });
    };

    const adicionarPersonagemAoCarrinho = async (referenciaDoElemento) => {
        
        try {
            // 1. Recuperar o ID do usuário logado
            const usuarioId = localStorage.getItem('usuario_id');

            // 2. Trava de segurança: Se não houver login, interrompe o processo.
            if (!usuarioId) {
                alert("Você precisa estar logado para salvar o personagem e adicionar ao carrinho.");
                // Opcional: window.location.href = '/login'; // Redirecionar se quiser
                throw new Error("Usuário não autenticado.");
            }

            // 3. Capturar a imagem
            const canvas = await html2canvas(referenciaDoElemento.current, { backgroundColor: null, scale: 0.45 });
            const imagemEmBase64 = canvas.toDataURL('image/png');
            
            // 4. Montar o objeto completo usando usuario_id
            const personagemCompleto = { 
                ...personagem, 
                img: imagemEmBase64,
                usuario_id: usuarioId // <--- Mudança aqui: usa o ID do usuário
            };
            
            console.log("Enviando os seguintes dados para /personagens:", personagemCompleto);

            // 5. Salvar o personagem no banco (API Call 1)
            const resposta = await axios.post('https://forja-qvex.onrender.com/api/personagens', personagemCompleto);
            const novoPersonagemSalvo = resposta.data;
            console.log("Personagem salvo com sucesso:", novoPersonagemSalvo);
            
            // 6. Adicionar o personagem recém-salvo ao carrinho (API Call 2)
            await axios.post('https://forja-qvex.onrender.com/api/carrinho', {
                usuario_id: usuarioId, // <--- Mudança aqui
                personagem_id: novoPersonagemSalvo.id
            });
            console.log(`Personagem ID ${novoPersonagemSalvo.id} adicionado ao carrinho.`);

            // 7. Retornar os dados do personagem salvo em caso de sucesso
            return novoPersonagemSalvo;

        } catch (erro) {
            console.error('Erro no processo de adicionar ao carrinho:', erro);
            // Verifica se foi erro do nosso "throw" manual ou erro de rede
            const mensagemErro = erro.response?.data?.message || erro.message || "Erro ao adicionar ao carrinho";
            alert(mensagemErro); 
            throw erro;
        }
    };
    
    const { genero, corPele, cabelo, corCabelo } = personagem;

    let caminhoBaseCorpo = '';
    if (genero === 'MASCULINO') {
        caminhoBaseCorpo = `./personagem-MASCULINO/CORPO-MASCULINO-PELE/CORPO-MASCULINO-${corPele}.png`;
    } else {
        caminhoBaseCorpo = `./personagem-FEMININO/CORPO-FEMININO-PELES/CORPO-FEMININO-${corPele}.png`;
    }

    const pastaBaseCabelo = `./personagem-${genero}/CABELOS-${genero}`;

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

    const caminhosDasImagens = {
        corpo: caminhoBaseCorpo,
        cabeloFrente: caminhoCabeloFrente,
        cabeloFundo: caminhoCabeloFundo
    };

    return { 
        personagem, 
        atualizarPersonagem, 
        adicionarPersonagemAoCarrinho, 
        caminhosDasImagens, 
        opcoesDoPersonagem,

    };
};