import React, { useState } from 'react'
import './CaixaCadastroLogin.css'

function CaixaCadastroLogin() {

  const [isLogin, setIsLogin] = useState(true)
  

  return (
    <div className="container-avo">
      <div className={isLogin ? "container-caixa-login" : "container-caixa-cadastro"}>
        <div className="container-entrarcadastrar">
          <label  className='lbl-selecionada'  >{isLogin ? 'Entrar' : 'Cadastrar'}</label>
          <label  className='lbl-nao-selecionada' onClick={() => {
            if (isLogin == true){setIsLogin(false)} else{setIsLogin(true)}}} >{isLogin ? 'Cadastrar' : 'Entrar'}</label>
        </div>
        <div className="container-inputs-cadastrologin">
          {!isLogin && <label className='lbl-inputs'>Nickname</label>}
          {!isLogin && <input className='input-cadastrologin' type="text" placeholder='Nickname' />}
          <label className='lbl-inputs'>Email</label>
          <input className='input-cadastrologin' type="text" placeholder='E-mail' />
          <label className='lbl-inputs'>Senha</label>
          <input className='input-cadastrologin' type="password" placeholder='Senha' />
          {!isLogin && <label className='lbl-inputs'>Confirmar Senha</label>}
          {!isLogin && <input className='input-cadastrologin' type="text" placeholder='Confirmar Senha' />}
        </div>
      </div>

      <button className='btn-confirmar'>CONFIRMAR</button>

    </div>
  )
}

export default CaixaCadastroLogin

