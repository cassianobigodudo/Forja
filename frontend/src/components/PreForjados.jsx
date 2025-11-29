import React from 'react';
import './PreForjados.css';

// 1. Recebemos "lista" via desestruturação de props
function PreForjados({ lista }) {
  
  // Verificação de segurança: Se a lista estiver vazia ou carregando
  if (!lista || lista.length === 0) {
    return <div className="aviso-vazio">Nenhum item forjado encontrado nesta vitrine.</div>;
  }

  return (
    <div className='pre-forjados-container'>
      {/* 2. O .map() acontece AQUI, gerando vários cards */}
      {lista.map((personagem) => (
        
        <div key={personagem.id} className="espaco-trabalhado-pre-forjados">
          
          {/* IMAGEM: Vem do Base64 do banco */}
          <div className="miniatura-container-pf">
            {personagem.img ? (
               <img src={personagem.img} alt={personagem.nome} className="img-personagem-render" />
            ) : (
               <div className="placeholder-img">Sem Imagem</div>
            )}
          </div>

          {/* NOME */}
          <div className="nome-miniatura-container-pf">
            <label>{personagem.nome || 'Aventureiro Desconhecido'}</label>
          </div>

          {/* PREÇO E BOTÕES */}
          <div className="valor-vermais-carrinho-pf">
            <div className="valor-miniatura-pf">
              <label className='valor-miniatura'>
                {/* Formatação para Moeda Brasileira */}
                {Number(personagem.valor || 84.90).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </label>
            </div>
            
            <div className="vermais-carrinho-pf">
              {/* Dica: No futuro, ao clicar em "Ver Mais", você pode acessar
                 `personagem.historia` que já está disponível aqui neste escopo.
              */}
              <img 
                src="/fundo/verMais.png" 
                className='vermais' 
                alt="Ver Mais" 
                onClick={() => console.log("História:", personagem.historia)} 
              />
              <img src="/fundo/colocarCarrinho.png" className='colocarcarrinho' alt="Carrinho" />
            </div>
          </div>
        
        </div>
      ))}
    </div>
  );
}

export default PreForjados;