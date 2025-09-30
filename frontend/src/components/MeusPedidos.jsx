import React from 'react'
import './MeusPedidos.css'
import BoxItem from './BoxItem'

function MeusPedidos() {
  return (
    <div className='container-meus-pedidos'>

        <div className="parte-solicitacoes">
          <div className="solicitacoes">
            <div className="solicitacoes-titulo">
              <label className='titulo-solicitacoes-producao'>SOLICITADOS↗️</label>
            </div>
            <div className="solicitacoes-boxs">
              <div className="boxs-itens">
                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
              </div>
            </div>
          </div>
        </div>

        <div className="parte-producao">
          <div className="producao">
            <div className="producao-titulo">
              <label className='titulo-solicitacoes-producao'>EM PRODUÇÃO🔄️</label>
            </div>
            <div className="producao-boxs"></div>
          </div>
        </div>  

    </div>
  )
}

export default MeusPedidos