import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext';

// --- IMPORTAÇÕES ATUALIZADAS ---
import MeusDados from '../components/MeusDados';
// Importamos APENAS o novo componente unificado
import HistoricoPedidos from '../components/HistoricoPedidos'; 
import Navbar from '../components/Navbar';

import './UserAccount.css';

function UserAccount() {
    const { usuarioId, logoutUsuario } = useGlobalContext();
    const navigate = useNavigate();

    // Estado para controlar qual aba está ativa
    const [ativo, setAtivo] = useState("dados");
    
    // Estado para armazenar os dados completos do usuário
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Buscar dados do usuário
    useEffect(() => {
        const fetchUserData = async () => {
            // Tenta pegar do Contexto ou do LocalStorage
            const id = usuarioId || localStorage.getItem('id_usuario');
            
            if (!id) {
                navigate('/'); 
                return;
            }

            try {
                // Ajuste a rota se necessário
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

    // 3. Renderização Condicional
    const renderComponente = () => {
        switch (ativo) {
            case "dados":
                return <MeusDados dados={userData} />;
            
            // AGORA: O caso "pedidos" chama o HistoricoPedidos (que tem tudo)
            case "pedidos":
                return <HistoricoPedidos />;
            
            default:
                return <MeusDados dados={userData} />;
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
                                    backgroundColor: '#333', // Fallback visual
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* Se não tiver foto, mostra inicial ou ícone */}
                                {!userData?.foto && <span style={{fontSize: '2rem'}}>🛡️</span>}
                            </div>
                            <label className='label-nome-usuario'>
                                {userData?.nome || "Aventureiro"}
                            </label>
                        </div>

                        <div className="menu-parte-botoes">
                            {/* BOTÃO 1: MEUS DADOS */}
                            <button 
                                className={`botoes-menu ${ativo === "dados" ? "ativo" : ""}`}
                                onClick={() => setAtivo("dados")}
                            >
                                📜 Meus Dados
                            </button>

                            {/* BOTÃO 2: DIÁRIO / PEDIDOS (Unificado) */}
                            <button 
                                className={`botoes-menu ${ativo === "pedidos" ? "ativo" : ""}`}
                                onClick={() => setAtivo("pedidos")}
                            >
                                🎒 Pedidos & Mochila
                            </button>

                            {/* REMOVI O BOTÃO "HISTÓRICO" POIS O NOVO COMPONENTE JÁ FAZ ISSO */}
                        </div>

                        <div className="menu-parte-sair">
                            <button className="botao-deslogar" onClick={handleLogout}>
                                🚪 Sair
                            </button>
                        </div>

                    </div>
                </div>

                {/* --- ÁREA DO CONTEÚDO --- */}
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