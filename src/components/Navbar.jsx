import React, { useState } from 'react'
import './Navbar.css'
import Modal from './Modal';

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);


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