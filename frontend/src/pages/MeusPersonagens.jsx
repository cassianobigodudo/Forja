import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

// Importamos o CSS específico desta página (que terá o Grid)
import './MeusPersonagens.css'; 
// Importamos o CSS do PreForjados para REUTILIZAR o estilo dos cards sem reescrever tudo
import './PreForjados.css'; 

function MeusPersonagens() {
    const { usuarioId, adicionarAoCarrinho, setDadosDoPersonagem } = useGlobalContext();
    const navigate = useNavigate();

    const [personagens, setPersonagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [personagemSelecionado, setPersonagemSelecionado] = useState(null);

    // --- 1. BUSCAR DO BANCO DE DADOS ---
    useEffect(() => {
        const fetchMeusPersonagens = async () => {
            const id = usuarioId || localStorage.getItem('id_usuario');
            if (!id) return;

            try {
                // Rota dinâmica que criamos no passo anterior
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

    // --- FUNÇÕES AUXILIARES ---
    
    // Corrige imagem Base64 se necessário
    const processarImagem = (img) => {
        if (!img) return null;
        if (img.startsWith('data:image')) return img;
        return `data:image/png;base64,${img}`;
    };

    const abrirModal = (personagem) => setPersonagemSelecionado(personagem);
    const fecharModal = () => setPersonagemSelecionado(null);

    const lidarComCompra = (item) => {
        // Como o objeto do banco pode ter nomes de propriedades diferentes do que o carrinho espera,
        // garantimos a imagem processada aqui
        const itemParaCarrinho = {
            ...item,
            img: processarImagem(item.img)
        };
        adicionarAoCarrinho(itemParaCarrinho);
        setPersonagemSelecionado(null);
    };

    const LevarParaForja = (personagem) => () => {
        setDadosDoPersonagem(personagem);
        navigate('/custom');
    };

    if (loading) return <div className="loading-msg">Invocando seus heróis...</div>;

    return (
        <div className="container-meus-personagens-wrapper">
            {/* Título da Seção */}
            <h2 className="titulo-secao-personagens">🛡️ Sala dos Heróis</h2>

            {personagens.length === 0 ? (
                <div className="sem-personagens-msg">
                    <p>Você ainda não forjou nenhuma lenda.</p>
                </div>
            ) : (
                /* AQUI É A MUDANÇA: Usamos um container de GRID, mas dentro os cards são iguais aos do PreForjados */
                <div className="grid-meus-personagens">
                    {personagens.map((personagem) => (
                        <div className='pre-forjados-container' key={personagem.id}>
                            <div className="espaco-trabalhado-pre-forjados">
                                
                                {/* IMAGEM */}
                                <div className="miniatura-container-pf">
                                    {personagem.img ? (
                                        <img 
                                            src={processarImagem(personagem.img)} 
                                            alt={personagem.nome} 
                                            className="img-personagem-render-preforjados" 
                                        />
                                    ) : (
                                        <div className="placeholder-img">?</div>
                                    )}
                                </div>

                                {/* NOME */}
                                <div className="nome-miniatura-container-pf">
                                    <label className='lbl-personagem-pre-forjados'>
                                        {personagem.nome || 'Sem Nome'}
                                    </label>
                                </div>

                                {/* PREÇO E BOTOES */}
                                <div className="valor-vermais-carrinho-pf">
                                    <div className="valor-miniatura-pf">
                                        <label className='valor-miniatura'>
                                            {Number(personagem.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </label>
                                    </div>
                                    
                                    <div className="vermais-carrinho-pf">
                                        <img 
                                            src="/fundo/verMais.png" 
                                            className='vermais' 
                                            alt="Ver Mais" 
                                            onClick={() => abrirModal(personagem)} 
                                        />
                                        <img 
                                            src="/fundo/colocarCarrinho.png" 
                                            className='colocarcarrinho' 
                                            alt="Carrinho" 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => lidarComCompra(personagem)} 
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- REUTILIZAÇÃO DO MODAL (IDÊNTICO AO PREFORJADOS) --- */}
            {personagemSelecionado && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        
                        <button className="btn-fechar-modal" onClick={fecharModal}>X</button>
                        
                        <div className="modal-header">
                            <h2>{personagemSelecionado.nome}</h2>
                        </div>

                        <div className="modal-body">
                            <div className="modal-img-wrapper">
                                <img src={processarImagem(personagemSelecionado.img)} alt={personagemSelecionado.nome} />
                            </div>
                            
                            <div className="modal-info">
                                <h3>História</h3>
                                <p className="texto-historia">
                                    {personagemSelecionado.historia || "Ainda sem história registrada."}
                                </p>
                                
                                <div className="modal-preco">
                                    Valor de Forja: <span>{Number(personagemSelecionado.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                                
                                <button 
                                    className="btn-comprar-modal"
                                    onClick={() => lidarComCompra(personagemSelecionado)}
                                >
                                    Adicionar ao Carrinho
                                </button>

                                <button className="btn-forjar-modal"
                                    onClick={LevarParaForja(personagemSelecionado)}>
                                    Editar na Forja
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MeusPersonagens;