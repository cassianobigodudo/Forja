import React from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'


function Navbar() {
    const navigate = useNavigate()

  return (
    <div className="container-componente-navbar">
        <div className="container-logo">
            <label className='forja-navbar-logo'>FORJA</label>
        </div>
        <div className="container-navigate">

            <label className='label-navbar' onClick={() => {navigate('/')}}>Início</label>
            <label className='label-navbar' onClick={() => {navigate('/custom')}}>Loja</label>
            <label className='label-navbar' onClick={() => {navigate('/usuario')}}>Forjar</label>

            
        </div>

        <div className="container-carrinho-usuario">
            <button className='botoes-navbar'><img src="./public/icones/Carrinho.svg" alt="" className='carrinho-navbar'/></button>
            <button className='botoes-navbar' onClick={() => navigate("/usuario")}><img src="./public/icones/Usuario.svg" alt="" className='usuario-navbar'/></button>
        </div>

    </div>
    
  )
}

export default Navbar