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

            <img src="./icones/Carrinho.svg" alt="" className='carrinho-navbar'/>
            <img src="./icones/Usuario.svg" alt="" className='usuario-navbar'/>

        </div>

    </div>
    
  )
}

export default Navbar