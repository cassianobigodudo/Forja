import React from 'react'
import "./PaginaPagamento.css"
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext';


function PaginaPagamento() {
    const { dadosDoPersonagem, imagemPersonagem } = useGlobalContext();
    
  const genero = dadosDoPersonagem?.genero
  const corPele = dadosDoPersonagem?.corPele

    if (!dadosDoPersonagem) {
        return (

            <div className="container-pagina"> 

                <Navbar/>

            <div className="container">             


                <main className='conteudo'>
            
                    {/* COLUNA ESQUERDA */}
                    <aside className='esquerda'>
                        <p className='continue'>Continuar comprando?</p>
                        <hr className='risco' />
                        <button className='btn-voltar'>VOLTAR<br/>PARA<br/>A FORJA</button>
                        <div className="figurina" />
                    </aside>

                    {/* COLUNA CENTRAL */}
                
                    <sectiom className='Checkout'>

                        <h2 className='titulo'>Pagamento:</h2>

                        <div className='lista'>
                            <article className="item">                            
   
                                <label>Nenhum pedido feito</label>

                                <label>
                                    
                                </label>
                            </article>
            
                        </div>

                    </sectiom>


                    {/* COLUNA DIREITA */}
                    <aside className='direita'>
                        <div className='metodos'>

                                <button className="metodo-pix" >
                                    Pix
                                </button>



                                <button className="metodo-cartao" >
                                    Cartão
                                </button>



                                <button className="metodo-boleto" >
                                    Boleto
                                </button>

                        </div>

                        <aside className="resumo">
                            <p className="envio">Envio 0$</p>
                            <hr className='risco'/>
                            <p className="total-label">Total:</p>
                            <p className="total">0$</p>
                        </aside>
                        <button className="btn-prosseguir">PROSSEGUIR</button>
                    </aside>
                </main>

          </div>   
        </div>
        )
    }

        return (

            <div className="container-pagina"> 
                <Navbar/>

                <div className="container">             


                    <main className='conteudo'>
            
                    {/* COLUNA ESQUERDA */}
                    <aside className='esquerda'>
                        <p className='continue'>Continuar comprando?</p>
                        <hr className='risco' />
                        <button className='btn-voltar'>VOLTAR<br/>PARA<br/>A FORJA</button>
                        <div className="figurina" />
                    </aside>

                   {/* COLUNA CENTRAL */}
                
                    <sectiom className='Checkout'>

                        <h2 className='titulo'>Pagamento:</h2>
                            
                        <div className='lista'>
                            <article className="item">                            
                                <label className=''>Sua Figura:</label>
                                <img src={imagemPersonagem} className='thumb' />

                                <label>
                                    <h1>Gênero: {genero}</h1>
                                
                                    <h2>Tom de pele: {corPele}</h2>

                                </label>
                            </article>
            
                        </div>

                    </sectiom>


                    {/* COLUNA DIREITA */}
                    <aside className='direita'>
                        <div className='metodos'>

                                <button className="metodo-pix" >
                                    Pix
                                </button>



                                <button className="metodo-cartao" >
                                    Cartão
                                </button>



                                <button className="metodo-boleto" >
                                    Boleto
                                </button>

                        </div>

                        <aside className="resumo">
                            <p className="envio">Envio 99,99$</p>
                            <hr className='risco'/>
                            <p className="total-label">Total:</p>
                            <p className="total">99.999,99$</p>
                        </aside>
                        <button className="btn-prosseguir">PROSSEGUIR</button>
                    </aside>
                </main>

          </div>
        </div>
    )
  
}

export default PaginaPagamento