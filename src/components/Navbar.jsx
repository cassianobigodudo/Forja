import React from 'react'
import './Navbar.css'
// import { useNavigate } from "react-router";
// import UserAccount from '../pages/UserAccount'

function Navbar() {
  // let navigate = useNavigate();

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
            <button className='botoes-navbar'><img src="./public/icones/Carrinho.svg" alt="" className='carrinho-navbar'/></button>
            <button className='botoes-navbar'><img src="./public/icones/Usuario.svg" alt="" className='usuario-navbar'/></button>
            {/* <button onClick={() => navigate(<UserAccount />)}><img src="./public/icones/Usuario.svg" alt="" className='usuario-navbar'/></button> */}
        </div>

    </div>
    
  )
}

export default Navbar