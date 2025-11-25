import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./PaginaCustomizaçao.css";
import html2canvas from 'html2canvas';

import Navbar from '../components/Navbar';
import MenuSecCabeca from '../components/MenuSecCabeca';
import MenuSecCorpo from '../components/MenuSecCorpo';
import MenuSecHistoria from '../components/MenuSecHistoria';

// Removido: import { useGlobalContext } ...
import { useLogicaCustomizacao } from '../hooks/HookCustomizacao';

function PaginaCustomizaçao() {
    // Removido: const { sessionId } = useGlobalContext(); 
    
    const { 
        personagem, 
        atualizarPersonagem, 
        adicionarPersonagemAoCarrinho, 
        caminhosDasImagens, 
        opcoesDoPersonagem 
    } = useLogicaCustomizacao();
    
    const [btnAtivo, setBtnAtivo] = useState('CORPO');
    const [zoomAtivo, setZoomAtivo] = useState(false);
    const characterRef = useRef(null);
    
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState('');

    // --- 2. ADICIONAR ESTADOS DA HISTÓRIA AQUI NO PAI ---
    const [nomePersonagem, setNomePersonagem] = useState("");
    const [inspiracaoUm, setInspiracaoUm] = useState("");
    const [inspiracaoDois, setInspiracaoDois] = useState("");
    const [enredoHistoria, setEnredoHistoria] = useState("");

    // Estados de controle da API da HISTÓRIA
    const [historiaGerada, setHistoriaGerada] = useState("");
    const [loadingHistoria, setLoadingHistoria] = useState(false);
    const [errorHistoria, setErrorHistoria] = useState(null);

    const handleAdicionarClick = async () => {
        // 1. MUDANÇA: Verifica o usuario_id no localStorage
        const usuarioId = localStorage.getItem('usuario_id');
        
        if (!usuarioId) {
            alert("Você precisa estar logado para adicionar ao carrinho!");
            // Opcional: navigate('/login');
            return; 
        }

        setIsAdding(true);
        setMessage('Adicionando ao carrinho...');
        setZoomAtivo(false);

        setTimeout(async () => {
            try {
                // 2. MUDANÇA: Chamamos a função SEM passar o ID (o hook já pega do localStorage)
                await adicionarPersonagemAoCarrinho(characterRef);

                setMessage('Personagem adicionado com sucesso!');
                setIsAdding(false); 
            } catch (error) {
                setMessage('Falha ao adicionar. Tente novamente.');
                setIsAdding(false); 
            }
        }, 200);
    };

    // --- 3. CRIAR A FUNÇÃO DE GERAR HISTÓRIA AQUI NO PAI ---
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
          // A. Capturar a Imagem usando html2canvas
          // A opção { backgroundColor: null } torna o fundo transparente
        //   const canvas = await html2canvas(characterRef.current, { backgroundColor: null, scale: 0.5 });
        //   const imageBase64 = canvas.toDataURL('image/jpeg', 0.6); // Converte para Base64

            const canvas = await html2canvas(document.getElementById("viewport"));
            const base64full = canvas.toDataURL("image/png"); // vem com prefixo data:
            const base64 = base64full.split(",")[1]; // remove o prefixo

          if (!base64) {
             throw new Error("Falha ao capturar a imagem do personagem.");
          }

          // B. Chamar sua API do Backend
          const API_URL = 'https://forja-qvex.onrender.com/api/personagens/gerar-historia';
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nome: nomePersonagem,
              inspiracao1: inspiracaoUm,
              inspiracao2: inspiracaoDois,
              tonalidade: enredoHistoria,
              imageBase64: base64 // A imagem capturada!
            }),
          });
    
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Falha no servidor ao gerar história.");
          }
    
          const data = await response.json();
          setHistoriaGerada(data.historia); // Sucesso!

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

    return (
        <div className="container-pagina">
            <Navbar />
            <div className="pagina-custom">
                <div className="area-customizacao">
                    <div className={`paperdoll-area ${zoomAtivo ? 'zoomed' : ''}`}>
                        <div ref={characterRef} className="character-container" style={{ position: 'relative' }}>
                            {caminhosDasImagens.cabeloFundo && <img src={caminhosDasImagens.cabeloFundo} alt="Cabelo Fundo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}
                            <img src={caminhosDasImagens.corpo} alt="Personagem" style={{ position: 'relative' }} />
                            {caminhosDasImagens.cabeloFrente && <img src={caminhosDasImagens.cabeloFrente} alt="Cabelo" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />}
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
                             <button className={btnAtivo === 'HISTÓRIA' ? 'btn-corpo-follow-ativado' : 'btn-corpo-follow'} onClick={() => handleButtonClick('HISTÓRIA')}>
                                 <label className='botaoLbl'>HISTÓRIA</label> <img className='img-btn-icon' src="./icones/Cabeça.svg" alt="" />
                             </button>
                         </div>
                         <div className="menu-primario-custom-bottom">
                             <button onClick={() => setZoomAtivo(true)} className='btn-zoom'></button>
                             <button onClick={() => setZoomAtivo(false)} className='btn-tirar-zoom'></button>
                             <button onClick={handleAdicionarClick} className='btn-tirar-zooms' disabled={isAdding}>
                                {isAdding ? 'ADICIONANDO...' : 'Adicionar ao carrinho'}
                            </button>
                          </div>
                    </div>
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
                            />}

                            {/* parte do botão para gerar história do personagem */}
                            {btnAtivo === 'HISTÓRIA' && <MenuSecHistoria 
                                // Estados do formulário
                                nomePersonagem={nomePersonagem}
                                setNomePersonagem={setNomePersonagem}
                                inspiracaoUm={inspiracaoUm}
                                setInspiracaoUm={setInspiracaoUm}
                                inspiracaoDois={inspiracaoDois}
                                setInspiracaoDois={setInspiracaoDois}
                                enredoHistoria={enredoHistoria}
                                setEnredoHistoria={setEnredoHistoria}
                                
                                // Estados da API
                                historiaGerada={historiaGerada}
                                setHistoriaGerada={setHistoriaGerada} // Para permitir edição
                                loading={loadingHistoria}
                                error={errorHistoria}
                                
                                // A Função de Ação
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