import React, { useState } from 'react';
import "./MenuSecCabeca.css";
import MenuCabelos from './MenuCabelos';
import MenuAcessorios from './MenuAcessorios';

function MenuSecCabeca({ onCabeloChange, onCorCabeloChange, cabeloAtual, corCabeloAtual, cabelosDisponiveis, coresCabeloDisponiveis,
  onAcessorioChange, onVariacaoAcessorioChange, acessoriosAtuais, acessoriosMixDisponiveis, acessoriosExclusivosDisponiveis, variacaoAcessorioAtual, variacaoAcessoriosDisponiveis}) {
    
  const [btnAtivo, setBtnAtivo] = useState('');
  const [topEncolher, setEncolher] = useState('');

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



        {btnAtivo === 'ACESSORIOS' && <MenuAcessorios
          onAcessorioChange={onAcessorioChange}
          onVariacaoAcessorioChange={onVariacaoAcessorioChange}
          acessoriosAtuais={acessoriosAtuais}
          variacaoAcessorioAtual={variacaoAcessorioAtual}
          acessoriosMixDisponiveis={acessoriosMixDisponiveis}
          acessoriosExclusivosDisponiveis={acessoriosExclusivosDisponiveis}
          variacaoAcessoriosDisponiveis={variacaoAcessoriosDisponiveis}
          />}
      </div>
    </div>
  );
}

export default MenuSecCabeca;