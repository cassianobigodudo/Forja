import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./PaginaPagamento.css";
import Navbar from '../components/Navbar';

function PaginaPagamento() {
    // Pegamos a função removerDoCarrinho do contexto para garantir sincronia global
    // Se o contexto não tiver essa função exposta ou se preferir fazer local, a gente faz local.
    // Vou fazer local para garantir que funcione com o estado 'cartItems' desta página.
    const { usuarioId } = useGlobalContext();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // --- 1. BUSCAR ITENS ---
    useEffect(() => {
        const idParaBuscar = usuarioId || localStorage.getItem('id_usuario'); // Use 'id_usuario' padronizado

        if (idParaBuscar) {
            fetchCartItems(idParaBuscar);
        } else {
            setIsLoading(false);
        }
    }, [usuarioId]);

    const fetchCartItems = async (idUser) => {
        try {
            const response = await axios.get(`https://forja-qvex.onrender.com/api/carrinho/${idUser}`);
            setCartItems(response.data);
        } catch (error) {
            console.error("Erro ao buscar o carrinho:", error);
            setStatusMessage("Não foi possível carregar seu carrinho.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. CALCULAR TOTAIS ---
    const totalCarrinho = cartItems.reduce((acc, item) => acc + Number(item.valor || 84.90), 0);
    const custoEnvio = 34.90;
    const totalFinal = totalCarrinho + custoEnvio;

    // --- 3. FUNÇÃO DE REMOVER ITEM ---
    const handleRemoveItem = async (idCarrinhoItem) => {
        // Remove visualmente primeiro (Optimistic Update)
        setCartItems(prev => prev.filter(item => item.id_carrinho_item !== idCarrinhoItem));

        try {
            // Chama a rota de delete
            await axios.delete(`https://forja-qvex.onrender.com/api/carrinho/${idCarrinhoItem}`);
            console.log("Item removido com sucesso.");
        } catch (error) {
            console.error("Erro ao remover item:", error);
            alert("Erro ao remover item. Atualizando carrinho...");
            // Se der erro, recarrega a lista original
            const idUser = usuarioId || localStorage.getItem('id_usuario');
            if(idUser) fetchCartItems(idUser);
        }
    };

    // --- 4. FINALIZAR COMPRA ---
    const handleFinalizarCompra = async () => {
        const idUsuario = usuarioId || localStorage.getItem('id_usuario');
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
                            
                            {isLoading ? (
                                <div className="loading-state">
                                    <p>Consultando inventário...</p>
                                </div>
                            ) : cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <article className="item" key={item.id_carrinho_item}>
                                        <div className="thumb-wrapper">
                                            <img src={item.img} className='thumb' alt={item.nome} />
                                        </div>
                                        
                                        <div className="detalhes-item">
                                            <h1>{item.nome || "Aventureiro"}</h1>
                                            <h2>
                                                {Number(item.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </h2>
                                        </div>

                                        {/* BOTÃO REMOVER (NOVO) */}
                                        <button 
                                            className="btn-remover-pagamento"
                                            onClick={() => handleRemoveItem(item.id_carrinho_item)}
                                            title="Remover este item"
                                        >
                                            X
                                        </button>

                                    </article>
                                ))
                            ) : (
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
                        {/* ... (Resumo e Botões de Pagamento iguais) ... */}
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