import React from 'react'
import './Loja.css'
import Navbar from '../components/Navbar'
import PreForjados from '../components/PreForjados'

function Loja() {
  return (
    <div className='container-loja'>
        <Navbar/>
        <div className="produtos-pre-forjados">
            <label className='lbl-pre-forjados'>Produtos Pré-forjados</label>
            <PreForjados/>
        </div>
    </div>
  )
  
}

export default Loja
