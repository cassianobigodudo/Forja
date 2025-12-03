import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext'; // 1. IMPORTANTE: Importar o Contexto
import './PreForjados.css';

function PreForjados({ lista }) {
  // 2. IMPORTANTE: Pegar a função de adicionar do contexto global
  const { adicionarAoCarrinho } = useGlobalContext(); 
  
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null);

  if (!lista || lista.length === 0) {
    return <div className="aviso-vazio">Nenhum item forjado encontrado nesta vitrine.</div>;
  }

  const abrirModal = (personagem) => setPersonagemSelecionado(personagem);
  const fecharModal = () => setPersonagemSelecionado(null);

  // 3. Função Única para adicionar (Funciona no Card e no Modal)
  const lidarComCompra = (item, fecharModalApos = false) => {
      // Adiciona ao carrinho global
      adicionarAoCarrinho(item); 
      
      // Se veio do modal, fecha o modal
      if (fecharModalApos) {
          setPersonagemSelecionado(null);
      }
  };

  return (
    <>
      <div className="vitrine-horizontal">
          {lista.map((personagem) => (
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

                {/* PREÇO E BOTOES */}
                <div className="valor-vermais-carrinho-pf">
                  <div className="valor-miniatura-pf">
                    <label className='valor-miniatura'>
                      {Number(personagem.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </label>
                  </div>
                  
                  <div className="vermais-carrinho-pf">
                    {/* Botão Ver Mais (Abre Modal) */}
                    <img 
                        src="/fundo/verMais.png" 
                        className='vermais' 
                        alt="Ver Mais" 
                        onClick={() => abrirModal(personagem)} 
                    />
                    
                    {/* 4. AQUI ESTAVA O PROBLEMA: Botão Carrinho Pequeno */}
                    {/* Agora ele chama lidarComCompra passando o personagem deste loop específico */}
                    <img 
                        src="/fundo/colocarCarrinho.png" 
                        className='colocarcarrinho' 
                        alt="Carrinho" 
                        style={{ cursor: 'pointer' }} // Garante que o mouse mostre que é clicável
                        onClick={() => lidarComCompra(personagem)} 
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
      </div>

      {/* --- O MODAL --- */}
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
                 
                 {/* Botão Grande de Comprar (Dentro do Modal) */}
                 <button 
                    className="btn-comprar-modal"
                    onClick={() => lidarComCompra(personagemSelecionado, true)}
                 >
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