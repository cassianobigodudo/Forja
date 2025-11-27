    // seu-projeto/src/pages/PaginaPagamento.jsx - VERSÃO COMPLETA E ATUALIZADA

    import React, { useState, useEffect } from 'react';
    import { useGlobalContext } from '../context/GlobalContext';
    import "./PaginaPagamento.css";
    import Navbar from '../components/Navbar';
    import axios from 'axios';
    
    function PaginaPagamento() {
        const { usuarioId, isLoadingAuth } = useGlobalContext();
        // 1. MUDANÇA: Pegar o id_usuario do localStorage em vez do con

        // 2. Estados para gerenciar a página.
        const [cartItems, setCartItems] = useState([]); 
        const [isLoading, setIsLoading] = useState(true); 
        const [isProcessing, setIsProcessing] = useState(false); 
        const [statusMessage, setStatusMessage] = useState(''); 

        // 3. useEffect para buscar os itens do carrinho.
        useEffect(() => {
            if (isLoadingAuth) return;
            if (usuarioId) {
                const fetchCartItems = async () => {
                    try {
                        const response = await axios.get(`https://forja-qvex.onrender.com/api/carrinho/${usuarioId}`);
                        setCartItems(response.data); 
                    } catch (error) {
                        console.error("Erro ao buscar o carrinho:", error);
                        setStatusMessage("Não foi possível carregar seu carrinho. Tente recarregar a página.");
                    } finally {
                        setIsLoading(false); 
                    }
                };

                fetchCartItems();
            } else {
                // Se não tiver id_usuario, para de carregar e avisa
                setIsLoading(false);
                setStatusMessage("Você precisa estar logado para ver o carrinho.");
            }
        }, [usuarioId, isLoadingAuth]); 

        // 4. Função chamada pelo botão "PROSSEGUIR".
        const handleFinalizarCompra = async () => {
            if (!usuarioId) {
                alert("Erro de autenticação. Faça login novamente.");
                return;
            }

            setIsProcessing(true);
            setStatusMessage('Finalizando sua compra e enviando para produção...');

            try {
                // MUDANÇA: Envia id_usuario no corpo da requisição
                const response = await axios.post('https://forja-qvex.onrender.com/api/pedidos', {
                    id_usuario: usuarioId 
                });
                
                const { sucessos, falhas } = response.data;
                setStatusMessage(`Compra finalizada! ${sucessos?.length || 0} item(ns) enviado(s) com sucesso.`);
                
                // Limpa o carrinho na tela
                setCartItems([]); 

            } catch (error) {
                console.error("Erro ao finalizar a compra:", error);
                setStatusMessage('Ocorreu um erro no checkout. Por favor, tente novamente.');
            } finally {
                setIsProcessing(false); 
            }
        };

        if (isLoading) {
            return (
                <div className="container-pagina">
                    <Navbar />
                    <div className="container-loading">
                        <h2>Carregando seu carrinho...</h2>
                    </div>
                </div>
            );
        }

        // 5. O JSX final que renderiza o carrinho e o botão de checkout.
        return (
            <div className="container-pagina"> 
                <Navbar/>
                <div className="container">
                    <main className='conteudo'>
                        <aside className='esquerda'>
                            <p className='continue'>Continuar comprando?</p>
                            <hr className='risco' />
                            <button className='btn-voltar'>VOLTAR<br/>PARA<br/>A FORJA</button>
                            <div className="figurina" />
                        </aside>

                        <section className='Checkout'>
                            <h2 className='titulo'>Pagamento:</h2>
                            <div className='lista'>
                                {cartItems.length > 0 ? (
                                    // Mapeia e exibe cada item do carrinho
                                    cartItems.map((item) => (
                                        <article className="item" key={item.id}>
                                            <label className=''>Sua Figura:</label>
                                            <img src={item.img} className='thumb' alt={`Personagem ${item.id}`} />
                                            <label>
                                                <h1>Gênero: {item.genero}</h1>
                                                <h2>Tom de pele: {item.corpele}</h2>
                                            </label>
                                        </article>
                                    ))
                                ) : (
                                    // Mensagem exibida se o carrinho estiver vazio
                                    <article className="item">
                                        <label>
                                            {statusMessage ? '' : 'Seu carrinho está vazio.'}
                                        </label>
                                    </article>
                                )}
                            </div>
                        </section>
                        
                        <aside className='direita'>
                            <div className='metodos'>
                                <button className="metodo-pix" >Pix</button>
                                <button className="metodo-cartao" >Cartão</button>
                                <button className="metodo-boleto" >Boleto</button>
                            </div>
                            <aside className="resumo">
                                <p className="envio">Envio 99,99$</p>
                                <hr className='risco'/>
                                <p className="total-label">Total:</p>
                                <p className="total">99.999,99$</p>
                            </aside>
                            <button 
                                className="btn-prosseguir" 
                                onClick={handleFinalizarCompra}
                                // O botão é desabilitado se estiver processando OU se o carrinho estiver vazio
                                disabled={isProcessing || cartItems.length === 0}
                            >
                                {isProcessing ? 'PROCESSANDO...' : 'PROSSEGUIR'}
                            </button>
                            {/* Exibe mensagens de status para o usuário */}
                            {statusMessage && <p style={{ textAlign: 'center', marginTop: '10px' }}>{statusMessage}</p>}
                        </aside>
                    </main>
                </div>
            </div>
        );
    }

    export default PaginaPagamento;