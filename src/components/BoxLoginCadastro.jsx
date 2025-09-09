import React, { useState } from 'react'
import './BoxLoginCadastro.css'
import ComponenteLogin from './ComponenteLogin'
import ComponenteCadastro from './ComponenteCadastro'

function BoxLoginCadastro() {
    const [componente, setComponente] = useState(<ComponenteLogin/>)
    const [botaoAtivo, setBotaoAtivo] = useState('entrar')
  return (
    <div className='container-componente-login'>
        <div className="componente-login-opcoes">
            <div className="login-opcoes">
                <button 
                    className={`login-opcoes-botoes ${botaoAtivo === "entrar" ? "ativo" : ""}`} 
                    onClick={() => {
                            setComponente(<ComponenteLogin/>)
                            setBotaoAtivo('entrar')
                        }
                    }
                >
                    ENTRAR
                </button>

                <button 
                    className={`login-opcoes-botoes ${botaoAtivo === "cadastrar" ? "ativo" : ""}`}
                    onClick={() => {
                            setComponente(<ComponenteCadastro/>)
                            setBotaoAtivo('cadastrar')
                        }
                    }
                >
                    CADASTRAR
                </button>
            </div>

            <div className="login-componentes">
                {componente}
            </div>
        </div>

        <div className="componente-login-botao-entrar">
            <button className="botao-entrar">CONFIRMAR</button>
        </div>
      
    </div>
  )
}

export default BoxLoginCadastro
