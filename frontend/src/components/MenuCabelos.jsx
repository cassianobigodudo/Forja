import React from 'react';
import './MenuCabelos.css';

function MenuCabelos({ onCabeloChange, onCorCabeloChange, cabeloAtual, corCabeloAtual }) {
 const cabelosData = [
  { nome: 'afro' },
  { nome: 'curto' },
  { nome: 'dreads' },
  { nome: 'longo' },
  { nome: 'rabo de cavalo' },
  { nome: 'raspado' },
 ];

 const coresCabeloData = [
  { nome: 'PRETO', color: '#1a1a1a' },
  { nome: 'VERMELHO', color: '#c43a3a' },
  { nome: 'LOIRO', color: '#f5d453' },
  { nome: 'CINZA', color: '#b0b0b0' },
 ];

 return (
  <div className="container-menu-cabelos">
   <div className="cabelos-grid">
    {cabelosData.map((cabelo) => (
     <button
      key={cabelo.nome}
      className={`cabelo-opcao ${cabeloAtual === cabelo.nome ? 'ativada' : ''}`}
      onClick={() => onCabeloChange(cabelo.nome)}
     >
      <img src={`./icones/cabelos/${cabelo.nome}.png`} alt={cabelo.nome} />
     </button>
    ))}
    <button
     className={`cabelo-opcao ${!cabeloAtual ? 'ativada' : ''}`}
     onClick={() => onCabeloChange(null)}
    >
    </button>
   </div>
   <div className="cores-cabelo-container">
    <label className='lbl-cabelo'>CORES DE CABELO</label>
    <div className="cores-cabelo">
     {coresCabeloData.map((cor) => (
      <button
       key={cor.nome}
       className={`cor-cabelo ${corCabeloAtual === cor.nome ? 'ativada' : ''}`}
       style={{ backgroundColor: cor.color }}
       onClick={() => onCorCabeloChange(cor.nome)}
      ></button>
     ))}
    </div>
   </div>
  </div>
 );
}

export default MenuCabelos;