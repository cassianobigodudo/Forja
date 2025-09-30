import React, { useState } from 'react'
import './ComponenteCadastro.css'

function ComponenteCadastro() {
    const [apelido, setApelido] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

  return (
    <div className='container-cadastro'>

        <div className="cadastro-componente">

            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">APELIDO</label>
                <input 
                    type="text" 
                    className="login-inputs"
                    value={apelido}
                    onChange={(e) => setApelido(e.target.value)}
                />
            </div>

            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">E-MAIL</label>
                <input 
                    type="email" 
                    className="login-inputs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        
            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">SENHA</label>
                <input 
                    type="password" 
                    className="login-inputs"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
            </div>

            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">CONFIRMAR SENHA</label>
                <input 
                    type="password" 
                    className="login-inputs"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                />
            </div>

        </div>

      
    </div>
  )
}

export default ComponenteCadastro