import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext';

// Importação dos Componentes Filhos
import MeusDados from '../components/MeusDados';
// IMPORTANTE: Verifique se o arquivo está mesmo em components ou pages
import MeusPersonagens from '../components/MeusPersonagens'; 

// Componentes removidos desta branch: MeusPedidos, MeuHistorico

import Navbar from '../components/Navbar';
import './UserAccount.css';
import AdminEstoque from '../components/AdminEstoque';
import HistoricoPedidos from '../components/HistoricoPedidos';

function UserAccount() {
    const { usuarioId, logoutUsuario } = useGlobalContext();
    const navigate = useNavigate();

    const [ativo, setAtivo] = useState("dados");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. DEFINIR A FUNÇÃO DE BUSCA FORA DO USEEFFECT
    const carregarDadosDoUsuario = async () => {
        const id = usuarioId || localStorage.getItem('id_usuario');
        
        if (!id) {
            navigate('/');
            return;
        }

        try {
            // Buscando dados atualizados...
            const response = await axios.get(`https://forja-qvex.onrender.com/api/usuarios/${id}`);
            setUserData(response.data); // Atualiza o estado do Pai
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. USEEFFECT CHAMA ESSA FUNÇÃO
    useEffect(() => {
        carregarDadosDoUsuario();
    }, [usuarioId, navigate]);

    const handleLogout = () => { /* ...seu código igual... */ };

    // 3. PASSAR A FUNÇÃO COMO PROPS PARA O FILHO
    const renderComponente = () => {
        switch (ativo) {
            // NOVIDADE: Passamos a prop 'atualizarPai={carregarDadosDoUsuario}'
            case "dados": 
                return <MeusDados dados={userData} atualizarPai={carregarDadosDoUsuario} />;
            case "personagens": 
                return <MeusPersonagens />;
            case "historico": 
                return <HistoricoPedidos />;
            case "admin": 
                return <AdminEstoque />;
            default: 
                return <MeusDados dados={userData} atualizarPai={carregarDadosDoUsuario} />;
        }
    };

    if (loading) return <div className="container-user-account"><h2 style={{color:'white'}}>Carregando perfil...</h2></div>;

    return (
        <div className='container-user-account'>
            <Navbar/>

            <div className="container-principal">
                
                {/* --- MENU LATERAL --- */}
                <div className="container-principal-menu">
                    <div className="parte-menu">

                        <div className="menu-parte-foto">
                            <div 
                                className="parte-foto"
                                style={{ 
                                    backgroundImage: userData?.img ? `url(${userData.img})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            ></div>
                            <label className='label-nome-usuario'>
                                {userData.nome_usuario || "Aventureiro"}
                            </label>
                        </div>

                        <div className="menu-parte-botoes">
                            {/* Botão MEUS DADOS */}
                            <button 
                                className={`botoes-menu ${ativo === "dados" ? "ativo" : ""}`}
                                onClick={() => setAtivo("dados")}
                            >
                                Meus Dados
                            </button>

                            <button 
                                className={`botoes-menu ${ativo === "historico" ? "ativo" : ""}`}
                                onClick={() => setAtivo("historico")}
                            >
                                📜 Histórico de Pedidos
                            </button>

                            {/* Botão MEUS PERSONAGENS (NOVO) */}
                            <button 
                                className={`botoes-menu ${ativo === "personagens" ? "ativo" : ""}`}
                                onClick={() => setAtivo("personagens")}
                            >
                                Meus Personagens
                            </button>

                            {String(usuarioId) === '5' && (
                                <button 
                                    className={`botoes-menu ${ativo === "admin" ? "ativo" : ""}`}
                                    onClick={() => setAtivo("admin")}
                                    style={{ color: '#ff4444', borderColor: '#ff4444' }} // Destaque visual
                                >
                                    ⚙️ Gestão Industrial
                                </button>
                            )}

                            {/* Botões de Pedidos e Histórico removidos nesta branch */}
                        </div>

                        <div className="menu-parte-sair">
                            <button className="botao-deslogar" onClick={handleLogout}>
                                Sair
                            </button>
                        </div>

                    </div>
                </div>

                {/* --- ÁREA DO CONTEÚDO (DIREITA) --- */}
                <div className="container-principal-componente">
                    <div className="parte-componente">
                        {renderComponente()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAccount;