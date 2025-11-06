import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./PaginaCustomizaçao.css";
import html2canvas from 'html2canvas';

import Navbar from '../components/Navbar';
import MenuSecCabeca from '../components/MenuSecCabeca';
import MenuSecCorpo from '../components/MenuSecCorpo';
import MenuSecHistoria from '../components/MenuSecHistoria';

import { useGlobalContext } from '../context/GlobalContext';
import { useLogicaCustomizacao } from '../hooks/HookCustomizacao';

function PaginaCustomizaçao() {
    const { sessionId } = useGlobalContext(); // Pega o sessionId global
    
    // Pega a nova função do seu hook
    const { 
        personagem, 
        atualizarPersonagem, 
        adicionarPersonagemAoCarrinho, // <-- A NOVA FUNÇÃO DO HOOK
        caminhosDasImagens, 
        opcoesDoPersonagem 
    } = useLogicaCustomizacao();
    
    const [btnAtivo, setBtnAtivo] = useState('CORPO');
    const [zoomAtivo, setZoomAtivo] = useState(false);
    const characterRef = useRef(null);
    
    // Estado da UI para feedback
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
        if (!sessionId) return; // Garante que o session Id já foi carregado

        setIsAdding(true);
        setMessage('Adicionando ao carrinho...');
        setZoomAtivo(false);

        // Pequeno delay para a UI atualizar antes de capturar a imagem
        setTimeout(async () => {
            try {
                // Chama a função do hook, que agora faz todo o trabalho pesado
                await adicionarPersonagemAoCarrinho(characterRef, sessionId);

                setMessage('Personagem adicionado com sucesso! Redirecionando...');
                

                setIsAdding(false); // Libera o botão para nova tentativa
            } catch (error) {
                // Como o hook lança o erro, podemos pegá-lo aqui
                setMessage('Falha ao adicionar. Tente novamente.');
                setIsAdding(false); // Libera o botão para nova tentativa
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
          const canvas = await html2canvas(characterRef.current, { backgroundColor: null });
          const imageBase64 = canvas.toDataURL('image/png'); // Converte para Base64

          if (!imageBase64) {
             throw new Error("Falha ao capturar a imagem do personagem.");
          }

          // B. Chamar sua API do Backend
          const API_URL = 'https://forja-qvex.onrender.com/api/personagem/gerar-historia';
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
              imageBase64: imageBase64 // A imagem capturada!
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