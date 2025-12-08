import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext' // Importe o Contexto
import './Navbar.css'
import Modal from './Modal'; 

function Navbar() {
  const navigate = useNavigate();
  // Pegamos o carrinho do contexto para saber o tamanho dele
  const { isCarrinhoAberto, setIsCarrinhoAberto, carrinho, usuarioNome, usuarioId } = useGlobalContext();

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
            {usuarioId && <label className='lbl-bemvindo'>{usuarioNome}</label>}
            
            <button className="btn-carrinho" onClick={() => setIsCarrinhoAberto(!isCarrinhoAberto)}>
              {/* Wrapper para posicionar a bolinha relativa ao ícone */}
              <div className="icone-carrinho-wrapper">
                  <img src="/icones/Carrinho.svg" alt="Carrinho" className='carrinho-navbar'/>
                  {carrinho.length > 0 && (
                    <span className="contador-carrinho">{carrinho.length}</span>
                  )}
                  
                  {/* SÓ MOSTRA SE TIVER ITENS */}
              </div>
            </button>
            
            {isCarrinhoAberto && <Modal onClose={() => setIsCarrinhoAberto(false)} />}

            <img src="/icones/Usuario.svg" alt="Usuario" className='usuario-navbar' onClick={() => navigate('/usuario')}/>
        </div>
    </div>    
  );
}

export default Navbar;