import React, { useState, useRef, useEffect } from 'react';
import "./PaginaCustomizaçao.css";
import Navbar from '../components/Navbar';
import MenuSecCabeca from '../components/MenuSecCabeca';
import MenuSecCorpo from '../components/MenuSecCorpo';
import MenuSecHistoria from '../components/MenuSecHistoria';
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
    handleMarcasChange // <-- Importado do Hook
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
  		  <div className={`paperdoll-area ${zoomAtivo ? 'zoomed' : ''}`}>
  			
  			<div ref={characterRef} className="character-container" style={{ position: 'relative' }}>
  			  
                {/* --- ORDEM DE CAMADAS CORRETA --- */}

                {/* Camada 1: Cabelo Fundo */}
  			  {caminhosDasImagens.cabeloFundo && <img src={caminhosDasImagens.cabeloFundo} alt="Cabelo Fundo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}
  			  
                {/* Camada 2: Acessórios de Fundo (Chapéu-sol-embaixo) */}
                {caminhosDasImagens.acessoriosCabecaFundo.map((caminho, index) => (
                  <img key={`fundo-${index}`} src={caminho} alt="Acessório Fundo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
                ))}

  			  {/* Camada 3: Corpo (Base) */}
  			  <img src={caminhosDasImagens.corpo} alt="Personagem" style={{ position: 'relative' }} />
  			  
                {/* Camada 4: Marcas (Cicatriz/Sardas) */}
                {caminhosDasImagens.marcas && <img src={caminhosDasImagens.marcas} alt="Marcas" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}

  			  {/* Camada 5: Pescoço (Colar) */}
  			  {caminhosDasImagens.acessorioPescoco && <img src={caminhosDasImagens.acessorioPescoco} alt="Pescoço" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}
  			  
  			  {/* Camada 6: Cabelo Frente */}
  			  {caminhosDasImagens.cabeloFrente && <img src={caminhosDasImagens.cabeloFrente} alt="Cabelo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}
  			  
  			  {/* Camada 7: Acessórios Rosto (Óculos/Argola) */}
                {caminhosDasImagens.acessoriosCabecaRosto.map((caminho, index) => (
                  <img key={`rosto-${index}`} src={caminho} alt="Acessório Rosto" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
                ))}

  			  {/* Camada 8: Acessórios Topo (Chapéu/Capacete) */}
                {caminhosDasImagens.acessoriosCabecaTopo.map((caminho, index) => (
                  <img key={`topo-${index}`} src={caminho} alt="Acessório Topo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
                ))}
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
  			  <button onClick={handleSaveClick} className='btn-tirar-zooms'>Adicionar ao carrinho</button>
  			</div>
  		  </div>
  		  <div className="menu-secundario-custom">
  			<div className="menu-secundario-fundo">
  			  
              {/* Menu CORPO (Sem props de Marcas) */}
              {btnAtivo === 'CORPO' && <MenuSecCorpo
  				onGeneroChange={(v) => atualizarPersonagem('genero', v)}
  				generoAtual={personagem.genero}
  				tomsDePeles={opcoesDoPersonagem.corPele}
  				onCorDePeleChange={(v) => atualizarPersonagem('corPele', v)}
  				corPeleAtual={personagem.corPele}
  			  />}

              {/* Menu CABEÇA (Com props de Marcas) */}
  			  {btnAtivo === 'CABEÇA' && (
  				<>
  				  <MenuSecCabeca
  					// Props de Cabelo
  					onCabeloChange={(v) => atualizarPersonagem('cabelo', v)}
  					onCorCabeloChange={(v) => atualizarPersonagem('corCabelo', v)}
  					cabeloAtual={personagem.cabelo}
  					corCabeloAtual={personagem.corCabelo}
  					cabelosDisponiveis={opcoesDoPersonagem.cabelo[personagem.genero]}
  					coresCabeloDisponiveis={opcoesDoPersonagem.corCabelo}

  					// Props de Acessórios
  					genero={personagem.genero}
  					acessoriosCabecaAtuais={personagem.acessoriosCabeca}
  					acessorioPescocoAtual={personagem.acessorioPescoco}
  					onAcessoriosCabecaChange={handleAcessoriosCabecaChange}
  					onAcessorioPescocoChange={handleAcessorioPescocoChange}

                    // Props de Marcas
                    marcasAtual={personagem.marcas}
                    onMarcasChange={handleMarcasChange}
  				  />
  				</>
  			  )}
  			  {btnAtivo === 'HISTÓRIA' && <MenuSecHistoria />}
  			</div>
  		  </div>
  		</div>
  	  </div>
  	</div>
  );
}

export default PaginaCustomizaçao;