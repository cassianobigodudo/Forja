import React, { useState } from 'react';
import './PreForjados.css';

function PreForjados({ lista }) {
  // Estado para controlar o modal
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null);

  // Verificação de segurança
  if (!lista || lista.length === 0) {
    return <div className="aviso-vazio">Nenhum item forjado encontrado nesta vitrine.</div>;
  }

  // Funções do Modal
  const abrirModal = (personagem) => setPersonagemSelecionado(personagem);
  const fecharModal = () => setPersonagemSelecionado(null);

  return (
    <>
      {/* O MAP começa aqui */}
      {lista.map((personagem) => (
        
        /* 1. O CONTAINER ESTÁ DENTRO DO MAP (Como você queria) */
        /* IMPORTANTE: A key vai aqui na div pai do loop */
        <div className='pre-forjados-container' key={personagem.id}>
          
          <div className="espaco-trabalhado-pre-forjados">
            
            {/* IMAGEM */}
            <div className="miniatura-container-pf">
              {personagem.img ? (
                <img src={personagem.img} alt={personagem.nome} className="img-personagem-render-preforjados" />
              ) : (
                <div className="placeholder-img">Sem Imagem</div>
              )}
            </div>

            {/* NOME */}
            <div className="nome-miniatura-container-pf">
              <label className='lbl-personagem-pre-forjados'>
                {personagem.nome || 'Aventureiro Desconhecido'}
              </label>
            </div>

            {/* PREÇO E BOTÕES */}
            <div className="valor-vermais-carrinho-pf">
              <div className="valor-miniatura-pf">
                <label className='valor-miniatura'>
                  {Number(personagem.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </label>
              </div>
              
              <div className="vermais-carrinho-pf">
                {/* Botão Ver Mais aciona o Modal */}
                <img 
                  src="/fundo/verMais.png" 
                  className='vermais' 
                  alt="Ver Mais" 
                  onClick={() => abrirModal(personagem)} 
                />
                <img 
                  src="/fundo/colocarCarrinho.png" 
                  className='colocarcarrinho' 
                  alt="Carrinho" 
                />
              </div>
            </div>

          </div>
        </div>
      ))}

      {/* 2. O MODAL FICA FORA DO MAP (Para não repetir 1 modal por item) */}
      {personagemSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button className="btn-fechar-modal" onClick={fecharModal}>X</button>
            
            <div className="modal-header">
               <h2>{personagemSelecionado.nome}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-img-wrapper">
                 <img src={personagemSelecionado.img} alt={personagemSelecionado.nome} />
              </div>
              
              <div className="modal-info">
                 <h3>História</h3>
                 <p className="texto-historia">
                    {personagemSelecionado.historia || "Este personagem ainda não tem uma história contada pelos bardos."}
                 </p>
                 
                 <div className="modal-preco">
                    Valor de Forja: <span>{Number(personagemSelecionado.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                 </div>
                 
                 <button className="btn-comprar-modal">
                    Adicionar ao Carrinho
                 </button>
                 <button className="btn-forjar-modal">
                    Levar para a Forja
                 </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default PreForjados;