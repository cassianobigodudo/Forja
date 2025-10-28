import React, { useState } from 'react'
import './BoxItem.css'

// 1. Receber as 'props'. Estamos pegando o objeto 'pedido' de dentro das props.
function BoxItem({ pedido }) {
  const [verDetalhes, setVerDetalhes] = useState(false);

  // 2. Criar um "título" (já que sua API não tem um)
  const titulo = `Personagem: ${pedido.genero} ${pedido.corPele}`;


  return (
    <div className='container-box-item'>
      {/* 4. Usar os dados das props */}
      <div className="box-parte-dados-item">
        <label className="label-dados-item">ID: {pedido.pedido_id}</label>
      </div>

      <div className="box-parte-dados-item">
        <label className="label-dados-item">TÍTULO: {titulo}</label>
      </div>
{/* 
      <div className="box-parte-dados-item">
        <label className="label-dados-item">HORÁRIO: {horario}</label>
      </div> */}
      
      <div className="box-parte-detalhes">
        <button onClick={() => setVerDetalhes(true)} className="botao-detalhes-item">Detalhes</button>
      </div>
      
      {/* 5. A tag <dialog> é ótima! */}
      <dialog open={verDetalhes} className='dialog-ver-detalhes'>
        <div className="container-dialog-detalhes">
          <div className="dialog-detalhes-fechar">
            <button onClick={() => setVerDetalhes(false)} className='dialog-botao-fechar'>❌</button>
          </div>

          <div className="dialog-detalhes-informacoes">
            <div className="dialog-detalhes-informacoes-esquerda">
              <div className="dialog-detalhes-informacoes-esquerda-foto">
                {/* 6. Usar a imagem vinda da API */}
                <img src={pedido.img} alt="Personagem" className="dialog-detalhes-informacoes-esquerta-foto-personagem" />
              </div>
            </div>

            <div className="dialog-detalhes-informacoes-direita">
              <div className="dialog-detalhes-informacoes-direita-dados">
                <div className="dialog-detalhes-informacoes-direita-dados-id">
                  <label className="label-dialog-detalhes-informacoes-direita-dados">ID: {pedido.pedido_id}</label>
                </div>

                <div className="dialog-detalhes-informacoes-direita-dados-id">
                  <label className="label-dialog-detalhes-informacoes-direita-dados">TÍTULO: {titulo}</label>
                </div>

                <div className="dialog-detalhes-informacoes-direita-dados-id">
                  <label className="label-dialog-detalhes-informacoes-direita-dados">SOLICITADO EM: {horario}</label>
                </div>
                
                <div className="dialog-detalhes-informacoes-direita-dados-descricao">
                  <div className="dialog-detalhes-dados-descricao">
                    {/* NOTA: A API que criamos não envia uma "HISTÓRIA".
                      Você precisaria adicionar uma coluna 'historia' no banco
                      e na query do backend se quiser exibir isso.
                      Por enquanto, deixaremos um texto fixo.
                    */}
                    <label className="label-dialog-detalhes-informacoes-direita-dados">
                      HISTÓRIA: (Dados de história não disponíveis na API)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dialog-detalhes-progresso">
            {/* 7. Exibir o status vindo da API */}
            <label htmlFor="">Status: {pedido.status}</label>
            {/* Você pode adicionar uma barra de progresso aqui depois */}
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default BoxItem