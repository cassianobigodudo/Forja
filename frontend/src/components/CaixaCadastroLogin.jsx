import React, { useState } from 'react'
import './CaixaCadastroLogin.css'

function CaixaCadastroLogin() {

  const [isLogin, setIsLogin] = useState(true)
  const [inputNome, setInputNome] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputSenha, setInputSenha] = useState('')
  const [inputConfirmarSenha, setInputConfirmarSenha] = useState('')

  async function AutenticacaoConta(){

  }
  

  return (
    <div className="container-avo">
      <div className={isLogin ? "container-caixa-login" : "container-caixa-cadastro"}>
        <div className="container-entrarcadastrar">
          <label  className='lbl-selecionada'  >{isLogin ? 'Entrar' : 'Cadastrar'}</label>
          <label  className='lbl-nao-selecionada' onClick={() => {
            if (isLogin == true){setIsLogin(false)} else{setIsLogin(true)}}} >{isLogin ? 'Cadastrar' : 'Entrar'}</label>
        </div>
        <div className="container-inputs-cadastrologin">
          {!isLogin && <label className='lbl-inputs'>Nome</label>}
          {!isLogin && <input className='input-cadastrologin' 
          type="text" 
          placeholder='Nome'
          onChange={(event) => setInputNome(event.target.value)}
          value={inputNome} />}

          <label className='lbl-inputs'>Email</label>
          <input className='input-cadastrologin' 
          type="text" 
          placeholder='E-mail'
          onChange={(event) => setInputEmail(event.target.value)}
          value={inputEmail} />

          <label className='lbl-inputs'>Senha</label>
          <input className='input-cadastrologin' 
          type="password" 
          placeholder='Senha'
          onChange={(event) => setInputSenha(event.target.value)}
          value={inputSenha} />

          {!isLogin && <label className='lbl-inputs'>Confirmar Senha</label>}
          {!isLogin && <input className='input-cadastrologin' 
          type="text" 
          placeholder='Confirmar Senha'
          onChange={(event) => setInputConfirmarSenha(event.target.value)}
          value={inputConfirmarSenha} />}
        </div>
      </div>

      <button className='btn-confirmar' onClick={}>CONFIRMAR</button>

    </div>
  )
}

export default CaixaCadastroLogin

