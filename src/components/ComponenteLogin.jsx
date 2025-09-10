import React from 'react'
import './ComponenteLogin.css'

function ComponenteLogin() {
  return (
    <div className='container-login'>

        <div className="login-box">
            <div className="login-parte-dados">
                <label htmlFor="" className="login-labels">E-MAIL</label>
                <input type="text" className="login-inputs" />
            </div>

            <div className="login-parte-dados">
                <label htmlFor="" className="login-labels">SENHA</label>
                <input type="text" className="login-inputs" />
            </div>
        </div>
      
    </div>
  )
}

export default ComponenteLogin
