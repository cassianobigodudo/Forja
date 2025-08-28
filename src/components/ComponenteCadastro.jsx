import React from 'react'
import './ComponenteCadastro.css'

function ComponenteCadastro() {
  return (
    <div className='container-cadastro'>

        <div className="cadastro-componente">

            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">APELIDO</label>
                <input type="text" className="login-inputs" />
            </div>

            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">E-MAIL</label>
                <input type="text" className="login-inputs" />
            </div>
        
            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">SENHA</label>
                <input type="text" className="login-inputs" />
            </div>

            <div className="cadastro-parte-dados">
                <label htmlFor="" className="login-labels">CONFIRMAR SENHA</label>
                <input type="text" className="login-inputs" />
            </div>

        </div>

      
    </div>
  )
}

export default ComponenteCadastro
