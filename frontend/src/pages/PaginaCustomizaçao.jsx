import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./PaginaCustomizaçao.css";
import html2canvas from 'html2canvas';

import Navbar from '../components/Navbar';

// --- MENUS ORIGINAIS ---
import MenuSecCabeca from '../components/MenuSecCabeca';
import MenuSecCorpo from '../components/MenuSecCorpo';
import MenuSecHistoria from '../components/MenuSecHistoria';

// --- MENUS DE PEÇAS INDIVIDUAIS ---
import MenuTorso from '../components/MenuTorso';
import MenuPernas from '../components/MenuPernas';
import MenuSapatos from '../components/MenuSapatos';
import MenuArmas from '../components/MenuArmas';

// --- CONTEXTOS E HOOKS ---
import { useGlobalContext } from '../context/GlobalContext';
import { useLogicaCustomizacao } from './Hook/HookCustomizacao.js';

function PaginaCustomizaçao() {

  const { setDadosDoPersonagem, setImagemPersonagem } = useGlobalContext();

  const { 
    personagem, 
    atualizarPersonagem, 
    salvarPersonagem,
    adicionarPersonagemAoCarrinho,
    caminhosDasImagens, 
    opcoesDoPersonagem,
    handleAcessoriosCabecaChange, 
    handleAcessorioPescocoChange,
    handleMarcasChange
  } = useLogicaCustomizacao();
  
  const [btnAtivo, setBtnAtivo] = useState('CORPO');
  const [zoomAtivo, setZoomAtivo] = useState(false);
  const characterRef = useRef(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADOS DA HISTÓRIA ---
  const [nomePersonagem, setNomePersonagem] = useState("");
  const [inspiracaoUm, setInspiracaoUm] = useState("");
  const [inspiracaoDois, setInspiracaoDois] = useState("");
  const [enredoHistoria, setEnredoHistoria] = useState("");

  const [historiaGerada, setHistoriaGerada] = useState("");
  const [loadingHistoria, setLoadingHistoria] = useState(false);
  const [errorHistoria, setErrorHistoria] = useState(null);

  // Auto-save effect
  useEffect(() => {
    if (isSaving && !zoomAtivo) {
      const captureAndSave = async () => {
        if(salvarPersonagem) {
            await salvarPersonagem(characterRef, setDadosDoPersonagem, setImagemPersonagem);
        }
        setBtnAtivo('SALVAR');
        setIsSaving(false);
      };
      const timer = setTimeout(captureAndSave, 100);
      return () => clearTimeout(timer);
    }
  }, [isSaving, zoomAtivo, salvarPersonagem, setDadosDoPersonagem, setImagemPersonagem, characterRef]);

  const handleAdicionarClick = async () => {
    const usuarioId = localStorage.getItem('usuario_id');
    
    if (!usuarioId) {
        alert("Você precisa estar logado para adicionar ao carrinho!");
        return; 
    }

    setIsAdding(true);
    setMessage('Adicionando ao carrinho...');
    setZoomAtivo(false); // Ensure zoom is off before capturing
    setIsSaving(true); 

    setTimeout(async () => {
        try {
            await adicionarPersonagemAoCarrinho(characterRef);
            setMessage('Personagem adicionado com sucesso!');
        } catch (error) {
            setMessage('Falha ao adicionar. Tente novamente.');
        } finally {
            setIsAdding(false);
        }
    }, 200);
  };

  const handleGerarHistoria = async () => {
    if (!nomePersonagem || !inspiracaoUm || !inspiracaoDois || !enredoHistoria) {
      setErrorHistoria("Por favor, preencha todos os campos da história.");
      return;
    }
  
    if (!characterRef.current) {
      setErrorHistoria("Erro: Não foi possível encontrar a referência do personagem.");
      return;
    }

    setLoadingHistoria(true);
    setErrorHistoria(null);
    setHistoriaGerada("");
  
    try {
       // Capture logic
       const canvas = await html2canvas(characterRef.current, {
           backgroundColor: null,
           scale: 1,
           useCORS: true // Added for better image handling
       });
       const base64full = canvas.toDataURL("image/jpeg", 0.8);
       const base64 = base64full.split(",")[1];

       if (!base64) {
         throw new Error("Falha ao capturar a imagem do personagem.");
       }

       const API_URL = 'https://forja-qvex.onrender.com/api/personagens/gerar-historia';
       const response = await fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           nome: nomePersonagem,
           inspiracao1: inspiracaoUm,
           inspiracao2: inspiracaoDois,
           tonalidade: enredoHistoria,
           imageBase64: base64 
         }),
       });
  
       if (!response.ok) {
         const errData = await response.json();
         throw new Error(errData.error || "Falha no servidor ao gerar história.");
       }
  
       const data = await response.json();
       setHistoriaGerada(data.historia);

    } catch (err) {
      console.error(err);
      setErrorHistoria(err.message);
    } finally {
      setLoadingHistoria(false);
    }
  };

  const handleButtonClick = (nomeDoBotao) => {
    setBtnAtivo(prev => prev === nomeDoBotao ? null : nomeDoBotao);
  };

  const isLeggings = personagem.roupaBaixo === 'Leggings';

  return (
    <div className="container-paginas">
      <Navbar />
      <div className="pagina-customs">
      <div className="area-customizacao">
        
        {/* --- ÁREA DO PAPERDOLL --- */}
        <div className={`paperdoll-area ${zoomAtivo ? 'zoomed' : ''}`}>
          <div ref={characterRef} className="character-container">
            
            {/* 1. FUNDO */}
            {caminhosDasImagens.cabeloFundo && <img src={caminhosDasImagens.cabeloFundo} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />}
            {caminhosDasImagens.acessoriosCabecaFundo && caminhosDasImagens.acessoriosCabecaFundo.map((c, i) => <img key={`bg-${i}`} src={c} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />)}

            {/* 2. CORPO BASE */}
            <img src={caminhosDasImagens.corpo} alt="Corpo" style={{ position: 'relative' }} />
            
            {/* 3. MARCAS */}
            {caminhosDasImagens.marcas && <img src={caminhosDasImagens.marcas} alt="Marcas" style={{ position: 'absolute', top: 0, left: 0 }} />}

            {/* --- LÓGICA DE CAMADAS: SAPATOS VS BOTTOMS --- */}
            {!isLeggings && caminhosDasImagens.sapato && (
               <img src={caminhosDasImagens.sapato} alt="Sapatos" style={{ position: 'absolute', top: 0, left: 0 }} />
            )}

            {caminhosDasImagens.roupaBaixo && (
               <img src={caminhosDasImagens.roupaBaixo} alt="Pernas" style={{ position: 'absolute', top: 0, left: 0 }} />
            )}

            {isLeggings && caminhosDasImagens.sapato && (
               <img src={caminhosDasImagens.sapato} alt="Sapatos" style={{ position: 'absolute', top: 0, left: 0 }} />
            )}

            {/* 6. TORSO */}
            {caminhosDasImagens.roupaCima && (
               <img src={caminhosDasImagens.roupaCima} alt="Torso" style={{ position: 'absolute', top: 0, left: 0 }} />
            )}

            {/* 7. ACESSÓRIOS TOPO */}
            {caminhosDasImagens.acessorioPescoco && <img src={caminhosDasImagens.acessorioPescoco} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />}
            {caminhosDasImagens.cabeloFrente && <img src={caminhosDasImagens.cabeloFrente} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />}
            {caminhosDasImagens.acessoriosCabecaRosto && caminhosDasImagens.acessoriosCabecaRosto.map((c, i) => <img key={`face-${i}`} src={c} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />)}
            {caminhosDasImagens.acessoriosCabecaTopo && caminhosDasImagens.acessoriosCabecaTopo.map((c, i) => <img key={`top-${i}`} src={c} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />)}

            {/* 8. ARMAS  */}
            {caminhosDasImagens.armas && (
                <img src={caminhosDasImagens.armas} alt="Arma" style={{ position: 'absolute', top: 0, left: 0, zIndex: -100 }} />
            )}

          </div>
        </div>

        {/* --- MENU PRIMÁRIO --- */}
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
              <button className={btnAtivo === 'ARMAS' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('ARMAS')}>
                  <label className='botaoLbl'>ARMAS</label> <img className='img-btn-icon' src="./icones/Armas.svg" alt="" onError={(e)=>e.target.style.display='none'}/>
              </button>

              <button className={btnAtivo === 'HISTÓRIA' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('HISTÓRIA')}>
                  <label className='botaoLbl'>HISTÓRIA</label> <img className='img-btn-icon' src="./icones/Historia.svg" alt="" onError={(e)=>e.target.style.display='none'}/>
              </button>
            </div>
            
            <div className="menu-primario-custom-bottom">
              <button onClick={() => setZoomAtivo(true)} className='btn-zoom'></button>
              <button onClick={() => setZoomAtivo(false)} className='btn-tirar-zoom'></button>
              <button onClick={handleAdicionarClick} className='btn-tirar-zooms' disabled={isAdding}>
                 {isAdding ? 'ADICIONANDO...' : 'Adicionar ao carrinho'}
              </button>
              {message && <span style={{fontSize: '0.8rem', marginLeft: '10px'}}>{message}</span>}
            </div>
        </div>

        {/* --- MENU SECUNDÁRIO --- */}
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

            {btnAtivo === 'TORSO' && <MenuTorso
              onTorsoChange={(v) => atualizarPersonagem('roupaCima', v)}
              onVarianteChange={(v) => atualizarPersonagem('roupaCimaVariante', v)}
              torsoAtual={personagem.roupaCima}
              varianteAtual={personagem.roupaCimaVariante}
              torsosDisponiveis={
                opcoesDoPersonagem.roupaCima && opcoesDoPersonagem.roupaCima[personagem.genero]
                ? opcoesDoPersonagem.roupaCima[personagem.genero]
                : []
              }
              variantesDisponiveis={opcoesDoPersonagem.roupaCimaVariantes}
            />}

            {btnAtivo === 'PERNAS' && <MenuPernas
              onPernaChange={(v) => atualizarPersonagem('roupaBaixo', v)}
              onVarianteChange={(v) => atualizarPersonagem('roupaBaixoVariante', v)}
              pernaAtual={personagem.roupaBaixo}
              varianteAtual={personagem.roupaBaixoVariante}
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

            {btnAtivo === 'ARMAS' && <MenuArmas
              onArmaChange={(v) => atualizarPersonagem('armas', v)}
              armaAtual={personagem.armas}
              armasDisponiveis={opcoesDoPersonagem.armas}
            />}

            {btnAtivo === 'HISTÓRIA' && <MenuSecHistoria 
                nomePersonagem={nomePersonagem}
                setNomePersonagem={setNomePersonagem}
                inspiracaoUm={inspiracaoUm}
                setInspiracaoUm={setInspiracaoUm}
                inspiracaoDois={inspiracaoDois}
                setInspiracaoDois={setInspiracaoDois}
                enredoHistoria={enredoHistoria}
                setEnredoHistoria={setEnredoHistoria}
                historiaGerada={historiaGerada}
                setHistoriaGerada={setHistoriaGerada}
                loading={loadingHistoria}
                error={errorHistoria}
                onGerarHistoria={handleGerarHistoria}     
            />}

          </div>
        </div>

      </div>
      </div>
    </div>
  );
}

export default PaginaCustomizaçao;