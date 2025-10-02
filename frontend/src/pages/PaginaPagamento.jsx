// seu-projeto/src/pages/PaginaPagamento.jsx - VERSÃO COMPLETA E ATUALIZADA

import React, { useState, useEffect } from 'react';
import "./PaginaPagamento.css";
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalContext'; // Para pegar o sessionId

function PaginaPagamento() {
    // 1. Pegar o sessionId do contexto global.
    const { sessionId } = useGlobalContext();

    // 2. Estados para gerenciar a página.
    const [cartItems, setCartItems] = useState([]); // Armazena os itens do carrinho vindos da API
    const [isLoading, setIsLoading] = useState(true); // Controla o feedback de "Carregando..." inicial
    const [isProcessing, setIsProcessing] = useState(false); // Controla o feedback do botão "Prosseguir"
    const [statusMessage, setStatusMessage] = useState(''); // Mensagens para o usuário (sucesso, erro, etc.)

    // 3. useEffect para buscar os itens do carrinho assim que a página carregar.
    useEffect(() => {
        // Só executa se o sessionId já estiver disponível.
        if (sessionId) {
            const fetchCartItems = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/carrinho/${sessionId}`);
                    setCartItems(response.data); // Salva os itens do carrinho no estado
                } catch (error) {
                    console.error("Erro ao buscar o carrinho:", error);
                    setStatusMessage("Não foi possível carregar seu carrinho. Tente recarregar a página.");
                } finally {
                    setIsLoading(false); // Termina o carregamento, mesmo que tenha dado erro
                }
            };

            fetchCartItems();
        }
    }, [sessionId]); // Depende do sessionId para ser executado.

    // 4. Função chamada pelo botão "PROSSEGUIR".
    const handleFinalizarCompra = async () => {
        setIsProcessing(true);
        setStatusMessage('Finalizando sua compra e enviando para produção...');

        try {
            const response = await axios.post('http://localhost:3000/finalizar-compra', {
                session_id: sessionId
            });
            
            const { sucessos, falhas } = response.data;
            setStatusMessage(`Compra finalizada! ${sucessos?.length || 0} item(ns) enviado(s) com sucesso.`);
            
            // Limpa o carrinho na tela após o sucesso, pois ele já foi processado.
            setCartItems([]); 

        } catch (error) {
            console.error("Erro ao finalizar a compra:", error);
            setStatusMessage('Ocorreu um erro no checkout. Por favor, tente novamente.');
        } finally {
            setIsProcessing(false); // Libera o botão
        }
    };

    // Feedback visual enquanto busca os dados do carrinho pela primeira vez.
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