import React, { useState, useRef } from 'react';
import "./PaginaCustomizaçao.css";
import Navbar from '../components/Navbar';
import MenuSecCabeca from '../components/MenuSecCabeca';
import MenuSecCorpo from '../components/MenuSecCorpo';
import MenuSecHistoria from '../components/MenuSecHistoria';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useGlobalContext } from '../context/GlobalContext';

function PaginaCustomizaçao() {
  const { dadosPersonagem, setDadosDoPersonagem, setImagemPersonagem } = useGlobalContext();
  const [genero, setGenero] = useState('FEMININO')
  const [corPele, setCorPele] = useState('NEGRA')
  const [btnAtivo, setBtnAtivo] = useState('');
  const [ZoomAtivo, setZoomAtivo] = useState(false);
  const myPointer = useRef(null);
  const [personagem, setPersonagem] = useState({
    
    genero: '',
    generoNum:'',
    corPele: '',
    corPeleNum: '',
    marcas: '',
    marcasNum: '',
    cabelo: '',
    cabeloNum: '',
    corCabelo: '',
    corCabeloNum: '',
    acessCabeca: '',
    acessCabecaNum: '',
    acessPescoco: '',
    acessPescocoNum: '',
    roupaCima: '',
    roupaCimaNum: '',
    roupaCimaVariante: '',
    roupaCimaVarianteNum: '',
    armas: '',
    armasNum: '',
    baseMini: '',
    baseMiniNum: '',
    roupaBaixo: '',
    roupaBaixoNum: '',
    roupaBaixoVariante: '',
    roupaBaixoVarianteNum: '',
    sapato: '',
    sapatoNum: '',
    sapatoVariante: '',
    sapatoVarianteNum: '',
    img: '',
    historia: ''

  })

  const corDePeleData = [
    { nome: 'NEGRA', color: '#3b2010ff' },
    { nome: 'PARDA', color: '#8C5230' },
    { nome: 'LEITE', color: '#D2A17C' },
    { nome: 'BRANCA', color: '#F9E4D4' },
    { nome: 'VERDE', color: '#4d771eff' },
    { nome: 'LARANJA', color: '#c26632ff' },
    { nome: 'CINZA', color: '#99af9eff' },
  ];

  function handleButtonClick(nomeDoBotao) {
    setBtnAtivo(prevBtnAtivo => prevBtnAtivo === nomeDoBotao ? null : nomeDoBotao);
  }

  //escolhendo o gênero da personagem
  const handleGeneroChange = (novoGenero) => {
    setGenero(novoGenero);

    const mapeamentoGenero = {
      'FEMININO': 2,
      'MASCULINO': 3
    };

    setPersonagem(prev => {
      const atualizado = {
        ...prev,
        genero: novoGenero,
        generoNum: mapeamentoGenero[novoGenero]
      };

      console.log("➡️ Gênero atualizado:", atualizado); // debug
      return atualizado;
    });
  };

  //escolhendo a cor da pele do personagem
  const handleCorDePeleChange = (novaCorDePele) => {
    setCorPele(novaCorDePele);

    const mapeamentoCorPele = {
      'NEGRA': 0,
      'PARDA': 1,
      'LEITE': 2,
      'BRANCA': 3,
      'VERDE': 4,
      'LARANJA': 5,
      'CINZA': 6
    };

    setPersonagem(prev => {
      const atualizado = {
        ...prev,
        corPele: novaCorDePele,
        corPeleNum: mapeamentoCorPele[novaCorDePele]
      };

      console.log("➡️ Cor de pele atualizada:", atualizado); // debug
      return atualizado;
    });
  };

  //função para salvar o personagem após a customização
  const handleSalvarPersonagem = async () => {

    const options = {
      backgroundColor: null,
      scale: 0.45
    };

    const canvas = await html2canvas(myPointer.current, options);
    const base64image = canvas.toDataURL('image/png');

    setImagemPersonagem(base64image);

    setDadosDoPersonagem(dadosPersonagem);
    setBtnAtivo('SALVAR');

    // Cria o objeto com os dados que você quer enviar
    const dadosParaEnviar = {
      genero: personagem.genero,
      generonum: personagem.generoNum,
      corpele: personagem.corPele,
      corpelenum: personagem.corPeleNum,
      img: base64image
    };

    try {

      console.log("Enviando os seguintes dados:", dadosParaEnviar);
      const resposta = await axios.post('http://localhost:3000/pedidos', dadosParaEnviar);
      console.log("Personagem salvo com sucesso:", resposta.data);

    } catch (error) {

      console.error('Erro ao salvar o personagem:', error);
      
    }

  };

  return (
    <div className="container-pagina">
      <Navbar />

      <div className="pagina-custom">

        <div className="area-customizacao">

          <div className={`paperdoll-area ${ZoomAtivo ? 'zoomed' : ''}`}>
            <img ref={myPointer} src={`./personagem-${genero}/CORPO-${genero}-${corPele}.png`} alt="Personagem" />
          </div>

          <div className="menu-primario-custom-container">

            <div className="menu-primario-custom-top">

              <button className={btnAtivo === 'CORPO' ? 'btn-corpo-ativado' : 'btn-corpo'} onClick={() => handleButtonClick('CORPO')}>
                <label className='botaoLbl'>CORPO</label> <img className='img-btn-icon' src="./icones/Corpo.svg" alt="" />
              </button>

              <button className={btnAtivo === 'CABEÇA' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('CABEÇA')}>
                <label className='botaoLbl'>CABEÇA</label> <img className='img-btn-icon' src="./icones/Cabeça.svg" alt="" />
              </button>

            </div>

            <div className="menu-primario-custom-bottom">

              <button onClick={() => setZoomAtivo(true)} className='btn-zoom'></button>
              <button onClick={() => setZoomAtivo(false)} className='btn-tirar-zoom'></button>
              <button onClick={handleSalvarPersonagem} className='btn-tirar-zooms'>SALVAR</button>

            </div>

          </div>

          <div className="menu-secundario-custom">

            <div className="menu-secundario-fundo">

              {btnAtivo === 'CORPO' && <MenuSecCorpo
                onGeneroChange={handleGeneroChange}
                generoAtual={genero}
                tomsDePeles={corDePeleData}
                onCorDePeleChange={handleCorDePeleChange}
                corPeleAtual={corPele}
              />}

              {btnAtivo === 'CABEÇA' && <MenuSecCabeca />}
              {btnAtivo === 'HISTÓRIA' && <MenuSecHistoria />}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default PaginaCustomizaçao;