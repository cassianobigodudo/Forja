import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./PaginaPagamento.css";
import Navbar from '../components/Navbar';

function PaginaPagamento() {
    const { usuarioId } = useGlobalContext(); // Ou pegue do localStorage se preferir
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // --- 1. BUSCAR ITENS DO CARRINHO ---
    useEffect(() => {
        // Se não tiver no contexto, tenta do localStorage
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
                    setIsLoading(false);
                }
            };
            fetchCartItems();
        } else {
            setIsLoading(false);
        }
    }, [usuarioId]);

    // --- 2. CALCULAR TOTAL ---
    // Soma todos os valores. Se não tiver valor, assume 84.90
    const totalCarrinho = cartItems.reduce((acc, item) => acc + Number(item.valor || 84.90), 0);
    const custoEnvio = 99.90; // Valor fixo do envio conforme seu layout
    const totalFinal = totalCarrinho + custoEnvio;

    // --- 3. FINALIZAR COMPRA ---
    const handleFinalizarCompra = async () => {
        const idUsuario = usuarioId || localStorage.getItem('usuario_id');
        if (!idUsuario) return alert("Erro de login.");

        setIsProcessing(true);
        setStatusMessage('Forjando seu pedido...');

        try {
            // Chama a rota de Pedidos (que limpa o carrinho no banco)
            const response = await axios.post('https://forja-qvex.onrender.com/api/pedidos', {
                id_usuario: idUsuario
            });
            
            const { sucessos } = response.data;
            setStatusMessage(`Sucesso! ${sucessos?.length || 0} itens enviados para produção.`);
            setCartItems([]); // Limpa visualmente
            
            // Opcional: Redirecionar para uma tela de sucesso
            // setTimeout(() => navigate('/sucesso'), 2000);

        } catch (error) {
            console.error(error);
            setStatusMessage('Erro ao processar o pagamento.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className="container-loading">Carregando forja...</div>;

    return (
        <div className="container-paginaz"> 
            <Navbar/>
            <div className="container">
                <main className='conteudo'>
                    
                    {/* ESQUERDA: VOLTAR E DECORAÇÃO */}
                    <aside className='esquerda'>
                        <p className='continue'>Continuar comprando?</p>
                        <hr className='risco' />
                        <button className='btn-voltar' onClick={() => navigate('/loja')}>
                            VOLTAR<br/>PARA<br/>A FORJA
                        </button>
                        <div className="figurina" /> {/* Se tiver imagem de fundo aqui */}
                    </aside>

                    {/* CENTRO: LISTA DE ITENS */}
                    <section className='Checkout'>
                        <h2 className='titulo'>Itens na Forja:</h2>
                        <div className='lista'>
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <article className="item" key={item.id}>
                                        {/* Imagem do Personagem */}
                                        <div className="thumb-wrapper">
                                            <img src={item.img} className='thumb' alt={item.nome} />
                                        </div>
                                        
                                        {/* Dados do Personagem */}
                                        <div className="detalhes-item">
                                            <h1>{item.nome || "Aventureiro"}</h1>
                                            <h2>
                                                {Number(item.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </h2>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <article className="item">
                                    <label style={{width:'100%', textAlign:'center'}}>
                                        {statusMessage || 'Seu carrinho está vazio.'}
                                    </label>
                                </article>
                            )}
                        </div>
                    </section>
                    
                    {/* DIREITA: PAGAMENTO E RESUMO */}
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
                                {totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </aside>
                        
                        <button 
                            className="btn-prosseguir" 
                            onClick={handleFinalizarCompra}
                            disabled={isProcessing || cartItems.length === 0}
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