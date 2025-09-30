import React, { useState } from 'react';
import "./PaginaPagamento.css";
import Navbar from '../components/Navbar';
import { useGlobalContext } from '../context/GlobalContext';
import axios from 'axios';

function PaginaPagamento() {
    const { dadosDoPersonagem, imagemPersonagem } = useGlobalContext();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const genero = dadosDoPersonagem?.genero;
    const corPele = dadosDoPersonagem?.corPele;

    const handleEnviarPedidos = async () => {
        setIsProcessing(true);
        setStatusMessage('Enviando pedidos para a produção...');

        try {
            const response = await axios.post('http://localhost:3000/enviar-pedidos-pendentes');
            console.log('Resposta do servidor:', response.data);
            setStatusMessage(`Sucesso! ${response.data.sucessos?.length || 0} pedido(s) enviado(s).`);
        } catch (error) {
            console.error("Erro ao enviar pedidos:", error);
            setStatusMessage('Ocorreu um erro. Por favor, tente novamente.');
            setIsProcessing(false);
        }
    };

    if (!dadosDoPersonagem) {
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
                                <article className="item">
                                    <label>Nenhum pedido feito</label>
                                    <label></label>
                                </article>
                            </div>
                        </section>

                        <aside className='direita'>
                            <div className='metodos'>
                                <button className="metodo-pix" >Pix</button>
                                <button className="metodo-cartao" >Cartão</button>
                                <button className="metodo-boleto" >Boleto</button>
                            </div>
                            <aside className="resumo">
                                <p className="envio">Envio 0$</p>
                                <hr className='risco'/>
                                <p className="total-label">Total:</p>
                                <p className="total">0$</p>
                            </aside>
                            <button 
                                className="btn-prosseguir" 
                                onClick={handleEnviarPedidos}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'PROCESSANDO...' : 'PROSSEGUIR'}
                            </button>
                            {statusMessage && <p style={{ textAlign: 'center', marginTop: '10px' }}>{statusMessage}</p>}
                        </aside>
                    </main>
                </div>   
            </div>
        );
    }

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
                            <article className="item">
                                <label className=''>Sua Figura:</label>
                                <img src={imagemPersonagem} className='thumb' alt="Personagem" />
                                <label>
                                    <h1>Gênero: {genero}</h1>
                                    <h2>Tom de pele: {corPele}</h2>
                                </label>
                            </article>
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
                            onClick={handleEnviarPedidos}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'PROCESSANDO...' : 'PROSSEGUIR'}
                        </button>
                        {statusMessage && <p style={{ textAlign: 'center', marginTop: '10px' }}>{statusMessage}</p>}
                    </aside>
                </main>
            </div>
        </div>
    );
}

export default PaginaPagamento;