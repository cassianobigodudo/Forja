import React, { useState } from 'react';
import "./MenuSecCabeca.css";
import MenuCabelos from './MenuCabelos';

function MenuSecCabeca({ onCabeloChange, onCorCabeloChange, cabeloAtual, corCabeloAtual }) {
 const [btnAtivo, setBtnAtivo] = useState('CABELOS');
 const [topEncolher, setEncolher] = useState('ENCOLHER');

 function handleButtonClick(nomeDoBotao) {
  if (btnAtivo === nomeDoBotao) {
   setBtnAtivo(null);
   setEncolher('');
  } else {
   setBtnAtivo(nomeDoBotao);
   setEncolher('ENCOLHER');
  }
 }

 return (
  <div className="container-menuSec-cabeca">
   <div className={topEncolher === 'ENCOLHER' ? 'div-top-encolhe' : 'div-top-normal'}>
    <button className={btnAtivo === 'CABELOS' ? 'btn-ativado' : 'btn-desativado'}
     onClick={() => handleButtonClick('CABELOS')}> CABELO
    </button>
    <button className={btnAtivo === 'ACESSORIOS' ? 'btn-ativado' : 'btn-desativado'}
     onClick={() => handleButtonClick('ACESSORIOS')}> ACESSORIOS
    </button>
    <button className={btnAtivo === 'MARCAS' ? 'btn-ativado' : 'btn-desativado'}
     onClick={() => handleButtonClick('MARCAS')}> MARCAS
    </button>
   </div>
   <div className="bottom">

    {btnAtivo === 'CABELOS' && <MenuCabelos
     onCabeloChange={onCabeloChange}
     onCorCabeloChange={onCorCabeloChange}
     cabeloAtual={cabeloAtual}
     corCabeloAtual={corCabeloAtual}
    />}
    
   </div>
  </div>
 );
}

export default MenuSecCabeca;