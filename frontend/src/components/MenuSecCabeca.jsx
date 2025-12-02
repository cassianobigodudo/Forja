import React, { useState } from 'react';
import "./MenuSecCabeca.css";
import MenuCabelos from './MenuCabelos';
import MenuAcessorios from './MenuAcessorios';
import MenuMarcas from './MenuMarcas';

function MenuSecCabeca({ 
  onCabeloChange, onCorCabeloChange, cabeloAtual, corCabeloAtual, cabelosDisponiveis, coresCabeloDisponiveis,
  genero,
  acessoriosCabecaAtuais,
  acessorioPescocoAtual,
  onAcessoriosCabecaChange,
  onAcessorioPescocoChange,
  marcasAtual,
  onMarcasChange
}) {
  
  // --- CHANGE 1: Start with 'ENCOLHER' ---
  // This ensures the menu starts as the small top bar, NOT the big blocks.
  const [topEncolher, setEncolher] = useState('ENCOLHER'); 
  
  // Start with no active button (content hidden)
  const [btnAtivo, setBtnAtivo] = useState(null);

  function handleButtonClick(nomeDoBotao) {
    if (btnAtivo === nomeDoBotao) {
      // If clicking the active button again, just close the content
      setBtnAtivo(null);
      // WE REMOVED "setEncolher('')" HERE so it doesn't go back to the big blocks
    } else {
      // Open new content
      setBtnAtivo(nomeDoBotao);
      setEncolher('ENCOLHER');
    }
  }

  return (
    <div className="container-menuSec-cabeca">
      
      {/* This will now always stay 'div-top-encolhe' based on our state */}
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

      {/* Only show the bottom box if a button is selected */}
      {btnAtivo && (
        <div className="bottom">
          {btnAtivo === 'CABELOS' && <MenuCabelos
            onCabeloChange={onCabeloChange}
            onCorCabeloChange={onCorCabeloChange}
            cabeloAtual={cabeloAtual}
            corCabeloAtual={corCabeloAtual}
            cabelosDisponiveis={cabelosDisponiveis}
            coresCabeloDisponiveis={coresCabeloDisponiveis}
          />}

          {btnAtivo === 'ACESSORIOS' && <MenuAcessorios
            genero={genero}
            acessoriosCabecaAtuais={acessoriosCabecaAtuais}
            acessorioPescocoAtual={acessorioPescocoAtual}
            onAcessoriosCabecaChange={onAcessoriosCabecaChange}
            onAcessorioPescocoChange={onAcessorioPescocoChange}
          />}

          {btnAtivo === 'MARCAS' && <MenuMarcas
            genero={genero}
            marcasAtual={marcasAtual}
            onMarcasChange={onMarcasChange}
          />}
        </div>
      )}
    </div>
  );
}

export default MenuSecCabeca;