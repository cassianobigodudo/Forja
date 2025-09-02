import React from 'react'
import "./PaginaPagamento.css"
import Navbar from '../components/Navbar'

function PaginaPagamento() {
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
                            <div className="thumb thumb-1" />
                            <div className="det">
                                
                                <h3> <span className="preco"> figura (x) 999,99$</span></h3>
                                <ul>
                                    <li>– cabelo (x) 99$</li>
                                    <li>– topo (x) 99$</li>
                                    <li>– pernas (x) 99$</li>
                                    <li>– acessório cabeça (x) 99$</li>
                                    <li>– acessório pescoço (x) 99$</li>
                                    <li>– arma (x) 99$</li>
                                    <li>– marcas (x) 99$</li>
                                    <li>– sapatos (x) 99$</li>
                                    <li>– sapatos (x) 99$</li>
                                    <li>– sapatos (x) 99$</li>
                                    <li>– sapatos (x) 99$</li>
                                </ul>
                            </div>
                        </article>
            
                    </div>
                </sectiom>


                {/* COLUNA DIREITA */}
                <aside className='direita'>
                    <div className='metodos'>
                            <div className='metodo1'>
                            <button>
                            <div className="metodo-ico metodo-pix" />
                                Pix
                            </button>
                            </div>

                            <div className='metodo2'>
                            <button>
                            <div className="metodo-ico metodo-cartao" />
                                Cartão
                            </button>
                            </div>

                            <div className='metodo3'>
                            <button>
                            <div className="metodo-ico metodo-boleto" />
                                Boleto
                            </button>
                            </div>
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