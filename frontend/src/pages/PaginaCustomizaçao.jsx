import React, { useState, useRef, useEffect } from 'react';
import "./PaginaCustomizaçao.css";
import Navbar from '../components/Navbar';

// Menus Originais
import MenuSecCabeca from '../components/MenuSecCabeca';
import MenuSecCorpo from '../components/MenuSecCorpo';
import MenuSecHistoria from '../components/MenuSecHistoria';

// Menus de Peças Individuais (Diretos)
import MenuTorso from '../components/MenuTorso';
import MenuPernas from '../components/MenuPernas'; 
import MenuSapatos from '../components/MenuSapatos'; 

import { useGlobalContext } from '../context/GlobalContext';
import { useLogicaCustomizacao } from './Hook/HookCustomizacao.js';

function PaginaCustomizaçao() {
 
  const { setDadosDoPersonagem, setImagemPersonagem } = useGlobalContext();
  
  const { 
    personagem, 
    atualizarPersonagem, 
    salvarPersonagem, 
    caminhosDasImagens, 
    opcoesDoPersonagem,
    handleAcessoriosCabecaChange, 
    handleAcessorioPescocoChange,
    handleMarcasChange
  } = useLogicaCustomizacao();
  
  const [btnAtivo, setBtnAtivo] = useState('CORPO');
  const [zoomAtivo, setZoomAtivo] = useState(false);
  const characterRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isSaving && !zoomAtivo) {
      const captureAndSave = async () => {
        await salvarPersonagem(characterRef, setDadosDoPersonagem, setImagemPersonagem);
        setBtnAtivo('SALVAR');
        setIsSaving(false);
      };
      const timer = setTimeout(captureAndSave, 100);
      return () => clearTimeout(timer);
    }
  }, [isSaving, zoomAtivo, salvarPersonagem, setDadosDoPersonagem, setImagemPersonagem, characterRef]);

  const handleButtonClick = (nomeDoBotao) => {
    setBtnAtivo(prev => prev === nomeDoBotao ? null : nomeDoBotao);
  };

  const handleSaveClick = () => {
    setIsSaving(true); 
    setZoomAtivo(false);
  };

  return (
    <div className="container-paginas">
      <Navbar />
      <div className="pagina-customs">
      <div className="area-customizacao">
        
        {/* ÁREA DO PAPERDOLL */}
        <div className={`paperdoll-area ${zoomAtivo ? 'zoomed' : ''}`}>
          <div ref={characterRef} className="character-container" style={{ position: 'relative' }}>
            
            {/* 1. FUNDO */}
            {caminhosDasImagens.cabeloFundo && <img src={caminhosDasImagens.cabeloFundo} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />}
            {caminhosDasImagens.acessoriosCabecaFundo.map((c, i) => <img key={`bg-${i}`} src={c} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />)}

            {/* 2. CORPO BASE */}
            <img src={caminhosDasImagens.corpo} alt="Corpo" style={{ position: 'relative' }} />
            
            {/* 3. MARCAS */}
            {caminhosDasImagens.marcas && <img src={caminhosDasImagens.marcas} alt="Marcas" style={{ position: 'absolute', top: 0, left: 0 }} />}

            {/* 4. PERNAS */}
            {caminhosDasImagens.roupaBaixo && (
               <img src={caminhosDasImagens.roupaBaixo} alt="Pernas" style={{ position: 'absolute', top: 0, left: 0 }} />
            )}

            {/* 5. TORSO */}
            {caminhosDasImagens.roupaCima && (
               <img src={caminhosDasImagens.roupaCima} alt="Torso" style={{ position: 'absolute', top: 0, left: 0 }} />
            )}

            {/* 6. SAPATOS */}
            {caminhosDasImagens.sapato && (
               <img src={caminhosDasImagens.sapato} alt="Sapatos" style={{ position: 'absolute', top: 0, left: 0 }} />
            )}

            {/* 7. ACESSÓRIOS TOPO */}
            {caminhosDasImagens.acessorioPescoco && <img src={caminhosDasImagens.acessorioPescoco} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />}
            {caminhosDasImagens.cabeloFrente && <img src={caminhosDasImagens.cabeloFrente} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />}
            {caminhosDasImagens.acessoriosCabecaRosto.map((c, i) => <img key={`face-${i}`} src={c} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />)}
            {caminhosDasImagens.acessoriosCabecaTopo.map((c, i) => <img key={`top-${i}`} src={c} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />)}

          </div>
        </div>

        {/* MENU PRIMÁRIO */}
        <div className="menu-primario-custom-container">
            <div className="menu-primario-custom-top">
              <button className={btnAtivo === 'CORPO' ? 'btn-corpo-ativado' : 'btn-corpo'} onClick={() => handleButtonClick('CORPO')}>
                  <label className='botaoLbl'>CORPO</label> <img className='img-btn-icon' src="./icones/Corpo.svg" alt="" />
              </button>
              <button className={btnAtivo === 'CABEÇA' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('CABEÇA')}>
                  <label className='botaoLbl'>CABEÇA</label> <img className='img-btn-icon' src="./icones/Cabeça.svg" alt="" />
              </button>
              <button className={btnAtivo === 'TORSO' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('TORSO')}>
                  <label className='botaoLbl'>TORSO</label> <img className='img-btn-icon' src="./icones/Torso.svg" alt="" onError={(e)=>e.target.style.display='none'}/>
              </button>
              <button className={btnAtivo === 'PERNAS' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('PERNAS')}>
                  <label className='botaoLbl'>PERNAS</label> <img className='img-btn-icon' src="./icones/Pernas.svg" alt="" onError={(e)=>e.target.style.display='none'}/>
              </button>
              <button className={btnAtivo === 'SAPATOS' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('SAPATOS')}>
                  <label className='botaoLbl'>SAPATOS</label> <img className='img-btn-icon' src="./icones/Sapatos.svg" alt="" onError={(e)=>e.target.style.display='none'}/>
              </button>
            </div>
            
            <div className="menu-primario-custom-bottom">
              <button onClick={() => setZoomAtivo(true)} className='btn-zoom'></button>
              <button onClick={() => setZoomAtivo(false)} className='btn-tirar-zoom'></button>
              <button onClick={handleSaveClick} className='btn-tirar-zooms'>Adicionar ao carrinho</button>
            </div>
        </div>

        {/* MENU SECUNDÁRIO */}
        <div className="menu-secundario-custom">
          <div className="menu-secundario-fundo">
            
            {btnAtivo === 'CORPO' && <MenuSecCorpo
              onGeneroChange={(v) => atualizarPersonagem('genero', v)}
              generoAtual={personagem.genero}
              tomsDePeles={opcoesDoPersonagem.corPele}
              onCorDePeleChange={(v) => atualizarPersonagem('corPele', v)}
              corPeleAtual={personagem.corPele}
            />}

            {btnAtivo === 'CABEÇA' && <MenuSecCabeca
              onCabeloChange={(v) => atualizarPersonagem('cabelo', v)}
              onCorCabeloChange={(v) => atualizarPersonagem('corCabelo', v)}
              cabeloAtual={personagem.cabelo}
              corCabeloAtual={personagem.corCabelo}
              cabelosDisponiveis={opcoesDoPersonagem.cabelo[personagem.genero]}
              coresCabeloDisponiveis={opcoesDoPersonagem.corCabelo}
              genero={personagem.genero}
              acessoriosCabecaAtuais={personagem.acessoriosCabeca}
              acessorioPescocoAtual={personagem.acessorioPescoco}
              onAcessoriosCabecaChange={handleAcessoriosCabecaChange}
              onAcessorioPescocoChange={handleAcessorioPescocoChange}
              marcasAtual={personagem.marcas}
              onMarcasChange={handleMarcasChange}
            />}

            {/* 3. MENU TORSO */}
            {btnAtivo === 'TORSO' && <MenuTorso
              onTorsoChange={(v) => atualizarPersonagem('roupaCima', v)}
              onVarianteChange={(v) => atualizarPersonagem('roupaCimaVariante', v)}
              torsoAtual={personagem.roupaCima}
              varianteAtual={personagem.roupaCimaVariante}
              
              /* Seleciona lista por gênero */
              torsosDisponiveis={
                opcoesDoPersonagem.roupaCima && opcoesDoPersonagem.roupaCima[personagem.genero]
                ? opcoesDoPersonagem.roupaCima[personagem.genero]
                : []
              }
              
              variantesDisponiveis={opcoesDoPersonagem.roupaCimaVariantes}
            />}

            {/* 4. MENU PERNAS */}
            {btnAtivo === 'PERNAS' && <MenuPernas
              onPernaChange={(v) => atualizarPersonagem('roupaBaixo', v)}
              onVarianteChange={(v) => atualizarPersonagem('roupaBaixoVariante', v)}
              pernaAtual={personagem.roupaBaixo}
              varianteAtual={personagem.roupaBaixoVariante}
              
              /* Seleciona lista por gênero */
              pernasDisponiveis={
                opcoesDoPersonagem.roupaBaixo && opcoesDoPersonagem.roupaBaixo[personagem.genero] 
                ? opcoesDoPersonagem.roupaBaixo[personagem.genero] 
                : []
              }
              
              variantesDisponiveis={opcoesDoPersonagem.roupaBaixoVariantes}
            />}
            
            {btnAtivo === 'SAPATOS' && <MenuSapatos
              onSapatoChange={(v) => atualizarPersonagem('sapato', v)}
              onVarianteChange={(v) => atualizarPersonagem('sapatoVariante', v)}
              sapatoAtual={personagem.sapato}
              varianteAtual={personagem.sapatoVariante}
              sapatosDisponiveis={opcoesDoPersonagem.sapato}
              variantesDisponiveis={opcoesDoPersonagem.sapatoVariantes}
            />}

            {btnAtivo === 'HISTÓRIA' && <MenuSecHistoria />}

          </div>
        </div>

      </div>
      </div>
    </div>
  );
}

export default PaginaCustomizaçao;