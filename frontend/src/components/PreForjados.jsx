import React from 'react'
import './PreForjados.css'

function PreForjados() {
  return (
    <div className='pre-forjados-container'>
      <div className="espaco-trabalhado-pre-forjados">
        <div className="miniatura-container-pf">
        <img src="" alt="" />
        </div>
        <div className="nome-miniatura-container-pf">
            <label>{}</label>
        </div>
        <div className="valor-vermais-carrinho-pf">
            <div className="valor-miniatura-pf">
                <label className='valor-miniatura'>R$: 84,90</label>
            </div>
            <div className="vermais-carrinho-pf">
                <img src="/fundo/verMais.png" className='vermais'/>
                <img src="/fundo/colocarCarrinho.png" className='colocarcarrinho'/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PreForjados
