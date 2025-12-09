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

function UserAccount() {
    const { usuarioId, logoutUsuario } = useGlobalContext();
    const navigate = useNavigate();

    // Estado para controlar qual aba está ativa
    const [ativo, setAtivo] = useState("dados");
    
    // Estado para armazenar os dados completos do usuário vindos do banco
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Buscar dados do usuário ao carregar a página
    useEffect(() => {
        const fetchUserData = async () => {
            const id = usuarioId || localStorage.getItem('id_usuario');
            
            if (!id) {
                navigate('/'); // Se não tiver ID, chuta pra home
                return;
            }

            try {
                const response = await axios.get(`https://forja-qvex.onrender.com/api/usuarios/${id}`);
                setUserData(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [usuarioId, navigate]);

    // 2. Função de Logout
    const handleLogout = () => {
        if (window.confirm("Tem certeza que deseja sair de sua conta?")) {
            logoutUsuario();
            navigate('/');
        }
    };

    // 3. Função para renderizar o componente correto
    const renderComponente = () => {
        switch (ativo) {
            case "dados": return <MeusDados dados={userData} />;
            case "personagens": return <MeusPersonagens />;
            // NOVO CASE
            case "admin": return <AdminEstoque />;
            default: return <MeusDados dados={userData} />;
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
                                    backgroundImage: userData?.foto ? `url(${userData.foto})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            ></div>
                            <label className='label-nome-usuario'>
                                {userData?.nome || "Aventureiro"}
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