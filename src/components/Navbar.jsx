import React, { useState } from 'react'
import './Navbar.css'

import Modal from './Modal';
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  

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
            <button className="btn-carrinho"
            onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <img src="./public/icones/Carrinho.svg" alt="" className='carrinho-navbar'/>
            </button>
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}

            <img src="./public/icones/Usuario.svg" alt="" className='usuario-navbar'/>

        </div>
    </div>    
  );
}

export default Navbar;