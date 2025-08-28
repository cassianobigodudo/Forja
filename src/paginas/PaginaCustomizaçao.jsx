
import React, { useState } from 'react';
import "./PaginaCustomizaçao.css";
import Navbar from '../componentes/Navbar';
import MenuSecCabeca from '../componentes/MenuSecCabeca';
import MenuSecCorpo from '../componentes/MenuSecCorpo';
import MenuSecHistoria from '../componentes/MenuSecHistoria';

function PaginaCustomizaçao() {
const [btnAtivo, setBtnAtivo] = useState('CORPO');
const [ZoomAtivo, setZoomAtivo] = useState(false);

function handleButtonClick(nomeDoBotao) {
setBtnAtivo(prevBtnAtivo => prevBtnAtivo === nomeDoBotao ? null : nomeDoBotao);
}

return (
<div className="container-pagina">
  <div className="pagina-custom">
    <div className="navbar-container">
    <Navbar />
    </div>
    <div className="area-customizacao">

    <div className={`paperdoll-area ${ZoomAtivo ? 'zoomed' : ''}`}>
    <img src="./personagem-FEMININO/CORPO-FEMININO.png" alt="" />
    </div>

    <div className="menu-primario-custom-container">
      <div className="menu-primario-custom-top">
      <button className={btnAtivo === 'CORPO' ? 'btn-corpo-ativado' : 'btn-corpo'} onClick={() => handleButtonClick('CORPO')}>
        <label className='botaoLbl'>CORPO</label> <img className='img-btn-icon' src="./icones/Corpo.svg" alt="" />
      </button>
      <button className={btnAtivo === 'CABEÇA' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('CABEÇA')}>
        <label className='botaoLbl'>CABEÇA</label> <img className='img-btn-icon' src="./icones/Cabeça.svg" alt="" />
      </button>
      <button className={btnAtivo === 'TORSO' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('TORSO')}>
        <label className='botaoLbl'>TORSO</label> <img className='img-btn-icon' src="./icones/Torso.svg" alt="" />
      </button>
      <button className={btnAtivo === 'PERNA' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('PERNA')}>
        <label className='botaoLbl'>PERNA</label> <img className='img-btn-icon' src="./icones/Perna.svg" alt="" />
      </button>
      <button className={btnAtivo === 'SAPATO' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('SAPATO')}>
        <label className='botaoLbl'>SAPATO</label> <img className='img-btn-icon' src="./icones/Pé.svg" alt="" />
      </button>
      <button className={btnAtivo === 'BASE' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('BASE')}>
        <label className='botaoLbl'>BASE</label> <img className='img-btn-icon' src="./icones/Base.svg" alt="" />
      </button>
      <button className={btnAtivo === 'HISTÓRIA' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('HISTÓRIA')}>
        <label className='botaoLbl'>HISTÓRIA</label> <img className='img-btn-icon' src="./icones/História.svg" alt="" />
      </button>
      </div>
      <div className="menu-primario-custom-bottom">

      <button onClick={() => setZoomAtivo(true)} className='btn-zoom'></button>
      <button onClick={() => setZoomAtivo(false)} className='btn-tirar-zoom'></button>
      
      </div>
    </div>
    <div className="menu-secundario-custom">
      <div className="menu-secundario-fundo">
      {btnAtivo === 'CORPO' && <MenuSecCorpo />}
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
