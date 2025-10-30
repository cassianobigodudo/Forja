import React, { useState } from 'react'
import "./MenuSecHistoria.css"

function MenuSecHistoria() {
  const [nomePersonagem, setNomePersonagem] = useState();
  const [enredoHistoria, setEnredoHistoria] = useState();
  const [historiaGerada, setHistoriaGerada] = useState()

  return (
    <div className="container-menuSec-corpo">
      <div className="top-menuSec">
        <div className="container-top-menuSec">

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">DÊ UM NOME A SUA PERSONAGEM: </label>
            <input 
              type="text" 
              className="inputs-menus-superior" 
              placeholder='ex.: Jaime'
              value={nomePersonagem}
              onChange={(e) => setNomePersonagem(e.target.value)}
            />
          </div>

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">ELEMENTO DE INSPIRAÇÃO I: </label>
            <input 
              type="text" 
              className="inputs-menus-superior" 
              placeholder='ex.: abandonado(a) pela família'
              value={enredoHistoria}
              onChange={(e) => setEnredoHistoria(e.target.value)}
            />
          </div>

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">ELEMENTO DE INSPIRAÇÃO II: </label>
            <input 
              type="text" 
              className="inputs-menus-superior" 
              placeholder='ex.: viveu isolado da sociedade'
              value={enredoHistoria}
              onChange={(e) => setEnredoHistoria(e.target.value)}
            />
          </div>

          <div className="parte-menus-superior">
            <label htmlFor="" className="label-menus-superior">ESCOLHA O TIPO DE ENREDO: </label>
            <input 
              type="text" 
              className="inputs-menus-superior" 
              placeholder='ex.: triste'
              value={enredoHistoria}
              onChange={(e) => setEnredoHistoria(e.target.value)}
            />
          </div>

          <div className="parte-gerar-historia">
            <button className="botao-gerar-historia" onClick={() => alert("Botão para gerar uma história para o personagem")}>GERAR HISTÓRIA</button>
          </div>

        </div>
      </div>

      <div className="bottom">

        <div className="container-bottom">
          <textarea 
            name="" 
            id="" 
            className='campo-historia-personagem'
            // value={nomePersonagem}
          ></textarea>

          <button className="botao-salvar-historia-personagem" onClick={() => alert("Botão para salvar a história gerada")}>SALVAR HISTÓRIA</button>
        </div>

      </div>
    </div>
  )
}

export default MenuSecHistoria