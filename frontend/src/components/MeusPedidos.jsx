import React from 'react'
import './MeusPedidos.css'
import BoxItem from './BoxItem'
import axios from "axios"

function MeusPedidos() {

  
  return (
    <div className='container-meus-pedidos'>

        <div className="parte-solicitacoes">

          <div className="solicitacoes">

            <div className="solicitacoes-titulo">
              <label className='titulo-solicitacoes-producao'>PEDIDOS SOLICITADOS↗️</label>
            </div>

            <div className="solicitacoes-boxs">

              <div className="boxs-itens">

                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
                <BoxItem/>
                
              </div>

            </div>

          </div>

        </div>

    </div>
  )
}

export default MeusPedidos