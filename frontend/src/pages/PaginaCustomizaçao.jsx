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
    const [genero, setGenero] = useState('MASCULINO');
    const [corPele, setCorPele] = useState('NEGRA'); 
    const [cabelo, setCabelo] = useState(null);
    const [corCabelo, setCorCabelo] = useState('PRETO');
    const myPointer = useRef(null);

    const cabeloOptions = {
      MASCULINO: ['CURTO', 'LONGO'],
      FEMININO: ['AFRO', 'CURTO', 'DREAD', 'LONGO', 'RABODECAVALO', 'RASPADO']
    };

    const corCabeloOptions = [
      { nome: 'PRETO', color: '#1a1a1a' },
      { nome: 'VERMELHO', color: '#c43a3a' },
      { nome: 'LOIRO', color: '#f5d453' },
      { nome: 'BRANCO', color: '#e0e0e0' },
    ];
    
    const estilosComCabeloFundo = ['LONGO', 'RABODECAVALO'];

    const corDePeleData = [
        { nome: 'NEGRA', color: '#3b2010ff' }, { nome: 'PARDA', color: '#8C5230' },
        { nome: 'LEITE', color: '#D2A17C' }, { nome: 'BRANCA', color: '#F9E4D4' },
        { nome: 'VERDE', color: '#4d771eff' }, { nome: 'LARANJA', color: '#c26632ff' },
        { nome: 'CINZA', color: '#99af9eff' },
    ];

    function handleButtonClick(nomeDoBotao) {
        setBtnAtivo(prevBtnAtivo => prevBtnAtivo === nomeDoBotao ? null : nomeDoBotao);
    }

    const handleGeneroChange = (novoGenero) => {
        setGenero(novoGenero);
        setCabelo(null);
    };

    const handleCorDePeleChange = (novaCorDePle) => {
        setCorPele(novaCorDePle);
    };

    const handleCabeloChange = (novoCabelo) => {
        setCabelo(prevCabelo => prevCabelo === novoCabelo ? null : novoCabelo);
    };

    const handleCorCabeloChange = (novaCor) => {
        setCorCabelo(novaCor);
    };

    const handleSalvarPersonagem = async () => {
        const options = { backgroundColor: null, scale: 0.45 };
        const canvas = await html2canvas(myPointer.current, options);
        const base64image = canvas.toDataURL('image/png');
        setImagemPersonagem(base64image);
    };
    
    const corpoPath = genero === 'MASCULINO'
      ? `./personagem-MASCULINO/CORPO-MASCULINO-PELE/CORPO-MASCULINO-${corPele}.png`
      : `./personagem-FEMININO/CORPO-FEMININO-PELES/CORPO-FEMININO-${corPele}.png`;

    const cabeloBasePath = `./personagem-${genero}/CABELOS-${genero}`;
    
    const cabeloFrenteSrc = genero === 'MASCULINO'
      ? `${cabeloBasePath}/CABELO-${cabelo}/CABELO-${genero}-${cabelo}-${corCabelo}.png`
      : `${cabeloBasePath}/CABELO-${cabelo}/CABELO-${cabelo}-${corCabelo}.png`;

    const cabeloFundoSrc = genero === 'MASCULINO'
      ? `${cabeloBasePath}/CABELO-FUNDO/CABELO-${genero}-FUNDO-${corCabelo}.png`
      : `${cabeloBasePath}/CABELO-FUNDO/CABELO-FUNDO-${corCabelo}.png`;

    return (
        <div className="container-pagina">
            <Navbar />
            <div className="pagina-custom">
                <div className="area-customizacao">
                    <div className={`paperdoll-area ${ZoomAtivo ? 'zoomed' : ''}`}>
                        <div ref={myPointer} className="character-container" style={{ position: 'relative' }}>
                            {estilosComCabeloFundo.includes(cabelo) && corCabelo && <img src={cabeloFundoSrc} alt="Cabelo Fundo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}
                            <img src={corpoPath} alt="Personagem" style={{ position: 'relative' }} />
                            {cabelo && corCabelo && <img src={cabeloFrenteSrc} alt="Cabelo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}
                        </div>
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
                            <button onClick={handleSalvarPersonagem} className='btn-tirar-zooms'>Adicionar ao carrinho</button>
                        </div>
                    </div>
                    <div className="menu-secundario-custom">
                        <div className="menu-secundario-fundo">
                            {btnAtivo === 'CORPO' && <MenuSecCorpo onGeneroChange={handleGeneroChange} generoAtual={genero} tomsDePeles={corDePeleData} onCorDePeleChange={handleCorDePeleChange} corPeleAtual={corPele} />}
                            {btnAtivo === 'CABEÇA' && <MenuSecCabeca onCabeloChange={handleCabeloChange} onCorCabeloChange={handleCorCabeloChange} cabeloAtual={cabelo} corCabeloAtual={corCabelo} cabelosDisponiveis={cabeloOptions[genero]} coresCabeloDisponiveis={corCabeloOptions} />}
                            {btnAtivo === 'HISTÓRIA' && <MenuSecHistoria />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaCustomizaçao;