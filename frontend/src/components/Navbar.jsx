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
            <label className='forja-navbar-logo' onClick={() => {navigate('/')}}>FORJA</label>
        </div>

        <div className="container-navigate">


            <label className='label-navbar' onClick={() => {navigate('/custom')}}>Forjar</label>
            <label className='label-navbar' onClick={() => {navigate('/loja')}}>Loja</label>
        </div>

        <div className="container-carrinho-usuario">
            <button className="btn-carrinho"
            onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <img src="./public/icones/Carrinho.svg" alt="" className='carrinho-navbar'/>
            </button>
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}

            <img src="./public/icones/Usuario.svg" alt="" className='usuario-navbar' onClick={() => navigate('/usuario')}/>

        </div>
    </div>    
  );
}

export default Navbar;