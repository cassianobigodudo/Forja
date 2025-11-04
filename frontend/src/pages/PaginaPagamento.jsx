import React from 'react'
import "./PaginaPagamento.css"
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext';


function PaginaPagamento() {
    const { dadosDoPersonagem, imagemPersonagem } = useGlobalContext();
        

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
        const detalhesParaExibir = [
            {label: 'Gênero', value: dadosDoPersonagem.genero},
            {label: 'Tom de Pele', value: dadosDoPersonagem.corPele},
            {label: 'Marcas', value: dadosDoPersonagem.marcas},
            {label: 'Cabelo', value: dadosDoPersonagem.cabelo},
            {label: 'Acessório da cabeça', value: dadosDoPersonagem.acessorioCabeca},
            {label: 'Acessório do pescoço', value: dadosDoPersonagem.acessorioPescoco},
            {label: 'Roupa Superior', value: dadosDoPersonagem.roupaSuperior},
            {label: 'Roupa Inferior', value: dadosDoPersonagem.roupaInferior},
            {label: 'Sapato', value: dadosDoPersonagem.sapato},
            {label: 'Arma', value: dadosDoPersonagem.arma},
            {label: 'Base', value: dadosDoPersonagem.base}
        ]
        
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
                                <div className='item-imagem-container'>
                                    <label className=''>Sua Figura:</label>
                                    <img src={imagemPersonagem} className='thumb' />
                                </div>
                                
                                <div className='item-detalhes'>
                                    {detalhesParaExibir.map((detalhe) =>(
                                        detalhe.value && (
                                            <p key={detalhe.label} className="detalhe-item">
                                                <strong> {detalhe.label}:</strong> {detalhe.value}
                                            </p>                                            
                                        ))
                                        )
                                    }
                                </div>
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