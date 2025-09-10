import React from 'react'
import './MeuHistorico.css'
import BoxLoginCadastro from './BoxLoginCadastro'

function MeuHistorico() {
  return (
    <div className='container-meu-historico'>

        <div className="historico">
          <div className="historico-titulo">
            <label htmlFor="" className="label-historico-titulo">PEDIDOS FINALIZADOS✅</label>
          </div>

          <div className="historico-boxs">
            <BoxLoginCadastro/>
          </div>
        </div>
      
    </div>
  )
}

export default MeuHistorico
