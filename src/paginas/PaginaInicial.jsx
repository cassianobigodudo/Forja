import React from 'react'
import "./PaginaInicial"
import UserAccount from './UserAccount'

function PaginaInicial() {
  return (

    <div className="container-pagina">
      <div className="container">

        <h1 className='logo-texto' >FORJA</h1>
        <h2 className='logo-embaixo-texto' >CRIAÇÃO DE PERSONAGENS PARA RPG</h2>

        <button className='btn-entrar' onClick={<UserAccount />}>ENTRAR</button>


      </div>
    </div>

  )
}

export default PaginaInicial