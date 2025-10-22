import React, { useState } from 'react';
import "./MenuSecCabeca.css";
import MenuCabelos from './MenuCabelos';
import MenuAcessorios from './MenuAcessorios';
import MenuMarcas from './MenuMarcas';

// --- CORREÇÃO 1: Recebendo todas as props ---
function MenuSecCabeca({ 
  // Props de Cabelo
  onCabeloChange, onCorCabeloChange, cabeloAtual, corCabeloAtual, cabelosDisponiveis, coresCabeloDisponiveis,
  // Props de Acessórios
  genero,
  acessoriosCabecaAtuais,
  acessorioPescocoAtual,
  onAcessoriosCabecaChange,
  onAcessorioPescocoChange
  // Props de Marcas (se houver, adicionar aqui)
}) {
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
          cabelosDisponiveis={cabelosDisponiveis}
          coresCabeloDisponiveis={coresCabeloDisponiveis}
        />}

        {/* --- CORREÇÃO 2: Passando as props para MenuAcessorios --- */}
        {btnAtivo === 'ACESSORIOS' && <MenuAcessorios
          genero={genero}
          acessoriosCabecaAtuais={acessoriosCabecaAtuais}
          acessorioPescocoAtual={acessorioPescocoAtual}
          onAcessoriosCabecaChange={onAcessoriosCabecaChange}
          onAcessorioPescocoChange={onAcessorioPescocoChange}
        />}
        {btnAtivo === 'MARCAS' && <MenuMarcas
        />}

      </div>
    </div>
  );
}

export default MenuSecCabeca;
