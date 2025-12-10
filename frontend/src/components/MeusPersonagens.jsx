import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import './MeusPersonagens.css';

function MeusPersonagens() {
    const { usuarioId, adicionarAoCarrinho, setDadosDoPersonagem } = useGlobalContext();
    const navigate = useNavigate();

    const [personagens, setPersonagens] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados do Modal
    const [historiaAberta, setHistoriaAberta] = useState(null);
    const [personagemFocado, setPersonagemFocado] = useState(null);

    // --- BUSCAR DADOS ---
    useEffect(() => {
        const fetchMeusPersonagens = async () => {
            const id = usuarioId || localStorage.getItem('id_usuario');
            if (!id) return;
            try {
                const response = await axios.get(`https://forja-qvex.onrender.com/api/personagens/usuario/${id}`);
                setPersonagens(response.data);
            } catch (error) {
                console.error("Erro ao buscar personagens:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeusPersonagens();
    }, [usuarioId]);

    // --- FUNÇÕES ---
    const handleExcluir = async (idPersonagem) => {
        // Confirmação simples do navegador (rápida e funcional)
        const confirmar = window.confirm("Deseja realmente descartar este herói? Esta ação não pode ser desfeita.");
        
        if (confirmar) {
            try {
                await axios.delete(`https://forja-qvex.onrender.com/api/personagens/${idPersonagem}`);
                
                // Remove visualmente da lista sem precisar recarregar a página
                setPersonagens(prev => prev.filter(p => p.id !== idPersonagem));
                
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Falha ao descartar personagem.");
            }
        }
    };

    const processarImagem = (img) => {
        if (!img) return null;
        return img.startsWith('data:image') ? img : `data:image/png;base64,${img}`;
    };

    const formatarData = (dataString) => {
        if (!dataString) return "";
        try {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        } catch (e) {
            return "";
        }
    };

    // ... (handleComprar, handleEditar, abrirHistoria mantêm iguais) ...
    const handleComprar = (char) => {
        const itemCarrinho = { ...char, img: processarImagem(char.img) };
        adicionarAoCarrinho(itemCarrinho);
    };

    const handleEditar = (char) => {
        setDadosDoPersonagem(char);
        navigate('/custom');
    };

    const abrirHistoria = (char) => {
        setPersonagemFocado(char);
        setHistoriaAberta(char.historia || "Ainda não há registros sobre este herói nos arquivos da forja.");
    };

    if (loading) return <div className="loading-rpg">Consultando arquivos...</div>;

    return (
        <div className="galeria-container">
            <div className="galeria-header">
                <h2>Galeria de Criações</h2>
            </div>

            {personagens.length === 0 ? (
                <div className="galeria-vazia">
                    <p>O salão está vazio.</p>
                    <button onClick={() => navigate('/custom')}>Forjar novo herói</button>
                </div>
            ) : (
                <div className="galeria-grid">
                    {personagens.map((char) => (
                        <div key={char.id} className="card-heroi">
                            
                            <div className="card-visual">
                                {char.img ? (
                                    <img 
                                        src={processarImagem(char.img)} 
                                        alt={char.nome} 
                                        className="img-foco-rosto"
                                    />
                                ) : (
                                    <div className="placeholder-char">?</div>
                                )}
                                
                                {/* OVERLAY COM AÇÃO DE EXCLUIR */}
                                <div className="card-overlay-hover">
                                    <h3 className="card-nome">{char.nome}</h3>
                                    
                                    <span className="card-data">
                                        Criado em: {formatarData(char.data_personagem_criado)}
                                    </span>
                                    
                                    {/* AQUI ESTÁ A MUDANÇA: Botão de Excluir no lugar da Classe */}
                                    <button 
                                        className="btn-descartar"
                                        onClick={() => handleExcluir(char.id)}
                                    >
                                        <img src="/icones/deletar.svg" alt="" /> Descartar
                                    </button>
                                </div>
                            </div>

                            <div className="card-actions-bar">
                                <button onClick={() => abrirHistoria(char)} title="Ler História">
                                    <img src="/icones/historia.svg" alt="" />
                                </button>
                                <button onClick={() => handleEditar(char)} title="Reforjar">
                                    <img src="/icones/ir-para-forja.svg" alt="" />
                                </button>
                                <button onClick={() => handleComprar(char)} title="Adicionar ao Carrinho">
                                    <img src="/icones/carrinho-2.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL HISTÓRIA */}
            {historiaAberta && (
                <div className="modal-backdrop" onClick={() => setHistoriaAberta(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-top">
                            <h3>{personagemFocado?.nome}</h3>
                            <button className="btn-fechar-modal-historia" onClick={() => setHistoriaAberta(null)}>×</button>
                        </div>
                        <div className="modal-text">
                            <p>{historiaAberta}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MeusPersonagens;