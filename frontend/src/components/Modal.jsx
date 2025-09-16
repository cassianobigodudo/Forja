import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import "./Modal.css";

function Modal({ onClose }) {
    const { dadosDoPersonagem, imagemPersonagem } = useGlobalContext();
    const navigate = useNavigate();

    if (!dadosDoPersonagem || !dadosDoPersonagem.payload) {
        return (
            <div className="modal-dropdown">
                <button className='fechar' onClick={onClose}>X</button>
                <h2 className="titulo">Carrinho</h2>
                <div className="modal-content">
                    <p className="exemploDeCompra">Nenhum item adicionado.</p>
                </div>
                <button className='btnIrParaPagamento'>
                </button>
            </div>
        );
    }

    return (
        <div className="modal-dropdown">
            <button className='fechar' onClick={onClose}>X</button>
            <h2 className="titulo">Resumo do Pedido</h2>
            <div className="modal-content">
                <label className="lblPedidos">
                    <img src={imagemPersonagem} alt="Resumo do Personagem" />
                </label>
            </div>
            <button
                className='btnIrParaPagamento'
                onClick={() => navigate('/pagamento')}
            >
                <label className="lblPagamento">Ir para pagamento</label>
            </button>
        </div>
    );
}

export default Modal;