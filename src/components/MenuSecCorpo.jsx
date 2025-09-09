import React, { useState } from 'react';
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
              // 4. Determine if this button is 'ativada' by comparing its name with the prop
              className={`cor-pele ${corPeleAtual === tomDePele.nome ? 'ativada' : ''}`}
              style={{ backgroundColor: tomDePele.color }}
              // 5. Correct onClick: Call 'onSkinChange' and pass the tone's NAME back to the parent
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
          FEMININO
        </button>
        
         
        <button 
          className={`btn-genero ${generoAtual === 'MASCULINO' ? 'ativado' : ''}`}
          onClick={() => onGeneroChange('MASCULINO')}
        >
          MASCULINO
        </button>
      </div>
    </div>
  );
}

export default MenuSecCorpo;