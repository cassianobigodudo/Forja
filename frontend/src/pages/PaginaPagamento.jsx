import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./PaginaPagamento.css";
import Navbar from '../components/Navbar';

function PaginaPagamento() {
    const { usuarioId } = useGlobalContext();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    
    // Inicia como TRUE, mas não vamos usar para bloquear a tela inteira
    const [isLoading, setIsLoading] = useState(true); 
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // --- 1. BUSCAR ITENS ---
    useEffect(() => {
        const idParaBuscar = usuarioId || localStorage.getItem('usuario_id');

        if (idParaBuscar) {
            const fetchCartItems = async () => {
                try {
                    const response = await axios.get(`https://forja-qvex.onrender.com/api/carrinho/${idParaBuscar}`);
                    setCartItems(response.data);
                } catch (error) {
                    console.error("Erro ao buscar o carrinho:", error);
                    setStatusMessage("Não foi possível carregar seu carrinho.");
                } finally {
                    setIsLoading(false); // Só aqui os dados aparecem
                }
            };
            fetchCartItems();
        } else {
            setIsLoading(false);
        }
    }, [usuarioId]);

    // --- 2. CALCULAR TOTAIS ---
    // Enquanto carrega, cartItems é [], então total é 0. O layout não quebra.
    const totalCarrinho = cartItems.reduce((acc, item) => acc + Number(item.valor || 84.90), 0);
    const custoEnvio = 99.90;
    const totalFinal = totalCarrinho + custoEnvio;

    // --- 3. FINALIZAR COMPRA ---
    const handleFinalizarCompra = async () => {
        const idUsuario = usuarioId || localStorage.getItem('usuario_id');
        if (!idUsuario) return alert("Erro de login.");

        setIsProcessing(true);
        setStatusMessage('Forjando seu pedido...');

        try {
            const response = await axios.post('https://forja-qvex.onrender.com/api/pedidos', {
                id_usuario: idUsuario
            });
            const { sucessos } = response.data;
            setStatusMessage(`Sucesso! Itens enviados para produção.`);
            setCartItems([]); 
        } catch (error) {
            console.error(error);
            setStatusMessage('Erro ao processar o pagamento.');
        } finally {
            setIsProcessing(false);
        }
    };

    // REMOVI O IF (ISLOADING) RETURN AQUI.
    // Agora o site renderiza direto.

    return (
        <div className="container-paginaz"> 
            <Navbar/>
            <div className="container">
                <main className='conteudo'>
                    
                    {/* ESQUERDA */}
                    <aside className='esquerda'>
                        <p className='continue'>Continuar comprando?</p>
                        <hr className='risco' />
                        <button className='btn-voltar' onClick={() => navigate('/loja')}>
                            VOLTAR<br/>PARA<br/>A FORJA
                        </button>
                        <div className="figurina" />
                    </aside>

                    {/* CENTRO: LISTA DE ITENS */}
                    <section className='Checkout'>
                        <h2 className='titulo'>Itens na Forja:</h2>
                        <div className='lista'>
                            
                            {/* AQUI ESTÁ A MÁGICA: */}
                            {/* Renderização Condicional DENTRO do container */}
                            
                            {isLoading ? (
                                /* ESTADO DE CARREGAMENTO (SÓ NA LISTA) */
                                <div className="loading-state">
                                    <p>Consultando inventário...</p>
                                </div>
                            ) : cartItems.length > 0 ? (
                                /* ESTADO COM ITENS */
                                cartItems.map((item) => (
                                    <article className="item" key={item.id}>
                                        <div className="thumb-wrapper">
                                            <img src={item.img} className='thumb' alt={item.nome} />
                                        </div>
                                        <div className="detalhes-item">
                                            <h1>{item.nome || "Aventureiro"}</h1>
                                            <h2>
                                                {Number(item.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </h2>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                /* ESTADO VAZIO */
                                <article className="item-vazio">
                                    <label>
                                        {statusMessage || 'Seu carrinho está vazio.'}
                                    </label>
                                </article>
                            )}

                        </div>
                    </section>
                    
                    {/* DIREITA */}
                    <aside className='direita'>
                        <div className='metodos'>
                            <button className="metodo-pix">Pix</button>
                            <button className="metodo-cartao">Cartão</button>
                            <button className="metodo-boleto">Boleto</button>
                        </div>
                        
                        <aside className="resumo">
                            <p className="envio">
                                Envio: {custoEnvio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                            <hr className='risco'/>
                            <p className="total-label">Total:</p>
                            <p className="total">
                                {isLoading 
                                    ? "..." 
                                    : totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                }
                            </p>
                        </aside>
                        
                        <button 
                            className="btn-prosseguir" 
                            onClick={handleFinalizarCompra}
                            disabled={isProcessing || cartItems.length === 0 || isLoading}
                        >
                            {isProcessing ? 'FORJANDO...' : 'PAGAR'}
                        </button>
                        
                        {statusMessage && <p className="msg-status">{statusMessage}</p>}
                    </aside>
                </main>
            </div>
        </div>
    );
}

export default PaginaPagamento;