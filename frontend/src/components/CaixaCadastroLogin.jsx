import React from 'react'
import './CaixaCadastroLogin.css'

function CaixaCadastroLogin() {
  return (
    <div className="container-avo">
      <div className='container-caixa-cadastrologin'>
        <div className="container-entrarcadastrar">
          <label  className='lbl-selecionada'>Entrar</label>
          <label  className='lbl-nao-selecionada'>Cadastrar</label>
        </div>
        <div className="container-inputs-cadastrologin">
          <label className='lbl-inputs'>Email</label>
          <input className='input-cadastrologin' type="text" placeholder='E-mail' />
          <label className='lbl-inputs'>Senha</label>
          <input className='input-cadastrologin' type="password" placeholder='Senha' />
        </div>
      </div>

      <button className='btn-confirmar'>CONFIRMAR</button>

    </div>
  )
}

export default CaixaCadastroLogin