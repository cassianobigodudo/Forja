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
  const { setDadosDoPersonagem, setImagemPersonagem } = useGlobalContext();

  const [btnAtivo, setBtnAtivo] = useState('');
  const [ZoomAtivo, setZoomAtivo] = useState(false);
  const myPointer = useRef(null);
  const [personagem, setPersonagem] = useState({
    
    genero: '',
    generoNun:'',
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

  const handleGeneroChange = (novoGenero) => {
    setGenero(novoGenero);
  };

  const handleCorDePeleChange = (novaCorDePele) => {
    setCorPele(novaCorDePele);
  };

  const handleSalvarPersonagem = async () => {
    const options = {
      backgroundColor: null,
      scale: 0.45
    };

    const canvas = await html2canvas(myPointer.current, options);
    const base64image = canvas.toDataURL('image/png');

    setImagemPersonagem(base64image);

    const mapeamentoGenero = {
      'FEMININO': 2,
      'MASCULINO': 3
    };

    const mapeamentoCorPele = {
      'NEGRA': 0,
      'PARDA': 1,
      'LEITE': 2,
      'BRANCA': 3,
      'VERDE': 4,
      'LARANJA': 5,
      'CINZA': 6
    };


    setDadosDoPersonagem(dadosPersonagem);
    setBtnAtivo('SALVAR');

    try {
      console.log("Enviando os seguintes IDs:", dadosPersonagem);
      const resposta = await axios.post('http://localhost:3000/enviar-caixa', dadosPersonagem);
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