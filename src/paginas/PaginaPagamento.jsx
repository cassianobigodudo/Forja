import React from 'react'
import "./PaginaPagamento.css"


function PaginaPagamento() {
  return (

    <div className="container-pagina"> 
            
      <div className="container">
             <header className="nav">
              <div className='logo-texto'>FORJA</div>
                

                    <nav className='navbar-links'>
                     <a href='#'>Início</a>
                     <a href='#'>Loja</a>
                     <a href='#'>Forjar</a>
                    </nav>

                <div className='nav-icons'>
                    <button className='ico1' aria-label='conta'>
                        {/* Trocar por Usuario.svg */}
                    </button>
            
                    <button className='ico2' aria-label='Carrinho'>
                      {/* Trocar por Carrinho.svg */}
                    </button>
                </div>
            </header>

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
                                <h3> <span className="preco">999,99$</span></h3>
                                <ul>
                                    <li>– cabelo (x) 99$</li>
                                    <li>– topo (x) 99$</li>
                                    <li>– pernas (x) 99$</li>
                                    <li>– acessório cabeça (x) 99$</li>
                                    <li>– acessório pescoço (x) 99$</li>
                                    <li>– arma (x) 99$</li>
                                    <li>– marcas (x) 99$</li>
                                    <li>– sapatos (x) 99$</li>
                                </ul>
                            </div>
                        </article>
            
                    </div>
                </sectiom>


                {/* COLUNA DIREITA */}
                <aside className='direita'>
                    <div className='metodos'>
                        <button className='Pix'>Pix</button>
                        <button className='Crédito'>Crédito</button>
                        <button className='Boleto'>Boleto</button>
                    </div>

                    <div className="resumo">
                        <p className="envio">Envio 99,99$</p>
                        <hr className="risco" />
                        <p className="total-label">Total:</p>
                        <p className="total">99.999,99$</p>
                    </div>
                    <button className="btn-prosseguir">PROSSEGUIR</button>
                </aside>
            </main>

      </div>
    </div>
  )
}

export default PaginaPagamento