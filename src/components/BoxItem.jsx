import React from 'react'
import './BoxItem.css'

function BoxItem() {
  return (
    <div className='container-box-item'>

      <div className="box-parte-dados-item">
        <label htmlFor="" className="label-dados-item">ID:</label>
      </div>
      <div className="box-parte-dados-item">
        <label htmlFor="" className="label-dados-item">TÍTULO:</label>
      </div>
      <div className="box-parte-dados-item">
        <label htmlFor="" className="label-dados-item">HORÁRIO:</label>
      </div>
      <div className="box-parte-detalhes">
        <button className="botao-detalhes-item">Detalhes</button>
      </div>
      
    </div>
  )
}

export default BoxItem
