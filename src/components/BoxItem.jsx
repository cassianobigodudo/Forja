import React, { useState } from 'react'
import './BoxItem.css'

function BoxItem() {
  const [verDetalhes, setVerDetalhes] = useState(false);
  return (
    <div className='container-box-item'>

      <div className="box-parte-dados-item">
        <label htmlFor="" className="label-dados-item">ID:</label>
      </div>
      <div className="box-parte-dados-item">
        <label htmlFor="" className="label-dados-item">TÍTULO:</label>
      </div>
      <div className="box-parte-dados-item">
        <label htmlFor="" className="label-dados-item">HORÁRIO:</label>
      </div>
      <div className="box-parte-detalhes">
        <button onClick={() => setVerDetalhes(true)} className="botao-detalhes-item">Detalhes</button>
      </div>
      
      <dialog open={verDetalhes} className='dialog-ver-detalhes'>

        <div className="container-dialog-detalhes">

          <div className="dialog-detalhes-fechar">
            <button onClick={() => setVerDetalhes(false)} className='dialog-botao-fechar'>❌</button>
          </div>

          <div className="dialog-detalhes-informacoes">

            <div className="dialog-detalhes-informacoes-esquerda">

              <div className="dialog-detalhes-informacoes-esquerda-foto">
                <img src="./public/images/personagem.png" alt="" className="dialog-detalhes-informacoes-esquerta-foto-personagem" />
              </div>

            </div>

            <div className="dialog-detalhes-informacoes-direita">

              <div className="dialog-detalhes-informacoes-direita-dados">
                <div className="dialog-detalhes-informacoes-direita-dados-id">
                  <label htmlFor="" className="label-dialog-detalhes-informacoes-direita-dados">ID:</label>
                </div>

                <div className="dialog-detalhes-informacoes-direita-dados-id">
                  <label htmlFor="" className="label-dialog-detalhes-informacoes-direita-dados">TÍTULO:</label>
                </div>

                <div className="dialog-detalhes-informacoes-direita-dados-id">
                  <label htmlFor="" className="label-dialog-detalhes-informacoes-direita-dados">HORÁRIO:</label>
                </div>
                
                <div className="dialog-detalhes-informacoes-direita-dados-descricao">

                  <div className="dialog-detalhes-dados-descricao">
                    <label htmlFor="" className="label-dialog-detalhes-informacoes-direita-dados">HISTÓRIA: Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit quis id, ipsum veniam illum voluptatem quam mollitia alias temporibus quae! Blanditiis ea harum culpa, facere ut aut quasi eaque quia? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo minus aut eos enim, nulla, blanditiis vitae iste numquam in atque, aperiam assumenda voluptates iusto voluptate ex! Minima nemo ipsum vero. Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, aut veritatis optio incidunt eaque illo quibusdam modi nihil neque quo, beatae magnam consequuntur nisi voluptatum dolore nostrum in corporis iste.</label>
                  </div>

                </div>

              </div>
            </div>

          </div>

          <div className="dialog-detalhes-progresso">
            <label htmlFor="">Barra de Progresso aqui...</label>
          </div>


        </div>


      </dialog>

    </div>

  )
}

export default BoxItem
