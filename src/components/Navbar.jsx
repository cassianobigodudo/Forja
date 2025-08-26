import React from 'react'
import './Navbar.css'

function Navbar() {
  return (
    <div className="container-componente-navbar">
        <div className="container-logo">
            <label className='forja-navbar-logo'>FORJA</label>
        </div>
        <div className="container-navigate">
            <label>Início</label>
            <label>Loja</label>
            <label>Forjar</label>
            
        </div>

        <div className="container-carrinho-usuario">
            <img src="./public/icones/Carrinho.svg" alt="" className='carrinho-navbar'/>
            <img src="./public/icones/Usuario.svg" alt="" className='usuario-navbar'/>
        </div>

    </div>
    
  )
}

export default Navbar