import React from 'react';
import "./MenuSecCorpo.css";

function MenuSecCorpo({ onGeneroChange, generoAtual, tomsDePeles, onCorDePeleChange, corPeleAtual }) {

  return (
    <div className="container-menuSec-corpo">
      <div className="top-menuSec">
        <div className="label-container">
          <label className='lbl'>CORES DE PELE</label>
        </div>
        <div className="skin-colors">
          {tomsDePeles.map((tomDePele) => (
            <button
              key={tomDePele.nome}
              className={`cor-pele ${corPeleAtual === tomDePele.nome ? 'ativada' : ''}`}
              style={{ backgroundColor: tomDePele.color }}
              onClick={() => onCorDePeleChange(tomDePele.nome)}
            ></button>
          ))}
        </div>
      </div>

      <div className="bottom">
        <button 
          className={`btn-genero ${generoAtual === 'FEMININO' ? 'ativado' : ''}`}
          onClick={() => onGeneroChange('FEMININO')}
        >
          <img src="./icones/ICONE-CORPO-FEMININO.png" alt="Ícone corpo feminino" />
        </button>
        
        <button 
          className={`btn-genero ${generoAtual === 'MASCULINO' ? 'ativado' : ''}`}
          onClick={() => onGeneroChange('MASCULINO')}
        >
          <img src="./icones/ICONE-CORPO-MASCULINO.png" alt="Ícone corpo masculino" />
        </button>
      </div>
    </div>
  );
}

export default MenuSecCorpo;