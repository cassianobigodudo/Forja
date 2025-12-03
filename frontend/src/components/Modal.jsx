import React from 'react';
import { useGlobalContext } from '../context/GlobalContext'; // Importa o contexto correto
import { useNavigate } from 'react-router-dom';
import "./Modal.css";

function Modal({ onClose }) {
    // 1. PEGANDO OS DADOS CERTOS DO CONTEXTO GLOBAL
    const { carrinho, removerDoCarrinho, setIsCarrinhoAberto } = useGlobalContext();
    const navigate = useNavigate();

    // Calcula o total somando os valores (assumindo 84.90 se não tiver valor)
    const total = carrinho.reduce((acc, item) => acc + Number(item.valor || 84.90), 0);

    const handleCheckout = () => {
        setIsCarrinhoAberto(false); // Fecha o carrinho
        navigate('/pagamento'); // Vai pro pagamento
    };

    return (
        <>
        {/* 2. CAMADA INVISÍVEL PARA FECHAR AO CLICAR FORA */}
        <div className="modal-backdrop-transparent" onClick={onClose}></div>
        
        {/* O DROPDOWN DO CARRINHO */}
        {/* stopPropagation impede que clicar DENTRO do carrinho feche ele */}
        <div className="modal-dropdown-carrinho" onClick={(e) => e.stopPropagation()}>
            <div className="carrinho-header">
                <h2 className="titulo-carrinho">Seu Inventário</h2>
                <button className='fechar-carrinho' onClick={onClose}>X</button>
            </div>

            <div className="carrinho-content">
                {carrinho.length === 0 ? (
                    <div className="carrinho-vazio">
                        <p>Seu inventário está vazio.</p>
                    </div>
                ) : (
                    <div className="lista-itens">
                        {/* LOOP PELOS ITENS DO CARRINHO */}
                        {carrinho.map((item) => (
        
                            <div key={item.id_carrinho_item} className="item-carrinho">
                                
                                <div className="img-wrapper-carrinho">
                                    <img src={item.img} alt={item.nome} />
                                </div>
                                
                                <div className="info-item-carrinho">
                                    <label className="nome-item">
                                        {item.nome || "Aventureiro"}
                                    </label>
                                    <label className="preco-item">
                                        {Number(item.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </label>
                                </div>

                                <button 
                                    className="btn-remover-item" 
                                    // AQUI: Passamos o ID único da linha do carrinho
                                    onClick={() => removerDoCarrinho(item.id_carrinho_item)}
                                    title="Remover"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {carrinho.length > 0 && (
                <div className="carrinho-footer">
                    <div className="total-row">
                        <span>Total:</span>
                        <span className="valor-total">
                            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                    
                    <button className='btnIrParaPagamento' onClick={handleCheckout}>
                        Ir para pagamento
                    </button>
                </div>
            )}
        </div>
        </>
    );
}

export default Modal;