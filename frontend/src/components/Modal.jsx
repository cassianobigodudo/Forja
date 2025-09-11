import React from "react";
import { useNavigate } from 'react-router-dom'

import "./Modal.css"; 

function Modal({ onClose }) {

  const navigate = useNavigate();
  
  /* 
  onClick={() => {navigate('/pagamento')}} */
  
  return (
    
        <div className="modal-dropdown">
          <button className='fechar' onClick={onClose}>X</button>
          <h2 className="titulo">Carrinho</h2>

          <div className="modal-content">

          <p className="exemploDeCompra">(Lista de produtos marcados para compra)</p>
          <p className="exemploDeCompra">(Lista de produtos marcados para compra)</p>
          <p className="exemploDeCompra">(Lista de produtos marcados para compra)</p>
          <p className="exemploDeCompra">(Lista de produtos marcados para compra)</p>
          <p className="exemploDeCompra">(Lista de produtos marcados para compra)</p>

          </div>
          <button className='btnIrParaPagamento'    > <label className="lblPagamento">Ir para pagamento</label>  </button>
        </div>
    
  );
}

export default Modal;
