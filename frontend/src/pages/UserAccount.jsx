import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext';

// Importação dos Componentes Filhos
import MeusDados from '../components/MeusDados';
import MeusPedidos from '../components/MeusPedidos';
import MeuHistorico from '../components/MeuHistorico';
import Navbar from '../components/Navbar';

// Importação do CSS
import './UserAccount.css';

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
                // Ajuste a rota conforme seu backend (ex: /api/usuarios/5)
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

    // 3. Função para renderizar o componente correto baseado na aba ativa
    const renderComponente = () => {
        switch (ativo) {
            case "dados":
                // Passamos userData como prop para MeusDados
                return <MeusDados dados={userData} />;
            case "pedidos":
                return <MeusPedidos />;
            case "historico":
                return <MeuHistorico />;
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
                            {/* Se tiver foto no banco usa ela, senão usa um placeholder */}
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
                            <button 
                                className={`botoes-menu ${ativo === "dados" ? "ativo" : ""}`}
                                onClick={() => setAtivo("dados")}
                            >
                                Meus Dados
                            </button>

                            <button 
                                className={`botoes-menu ${ativo === "pedidos" ? "ativo" : ""}`}
                                onClick={() => setAtivo("pedidos")}
                            >
                                Pedidos
                            </button>

                            <button 
                                className={`botoes-menu ${ativo === "historico" ? "ativo" : ""}`}
                                onClick={() => setAtivo("historico")}
                            >
                                Histórico
                            </button>
                        </div>

                        <div className="menu-parte-sair">
                            <button className="botao-deslogar" onClick={handleLogout}>
                                Sair
                            </button>
                        </div>

                    </div>
                </div>

                {/* --- ÁREA DO CONTEÚDO --- */}
                <div className="container-principal-componente">
                    <div className="parte-componente">
                        {/* Aqui renderizamos o conteúdo dinâmico */}
                        {renderComponente()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAccount;