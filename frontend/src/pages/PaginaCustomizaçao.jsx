import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./PaginaCustomizaçao.css";

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
                            {btnAtivo === 'HISTÓRIA' && <MenuSecHistoria />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaCustomizaçao;