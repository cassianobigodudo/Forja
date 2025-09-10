import React from "react";
import "./Modal.css"; 

function Modal({ onClose }) {

  return (
    
        <div className="modal-dropdown" style={{background: "black", padding: "30px"}}>
          <button className='fechar' onClick={onClose}>X</button>
          <h2 className="titulo">Carrinho</h2>
          <p className="coisas">Coisas compradas</p>
          <p className="coisas">ALSLAKSDLKSDKALSKDLKSAKDKASNDJABFH</p>
          <button className='avancar'>Ir pra pagamento</button>
        </div>
    
  );
}

export default Modal;
