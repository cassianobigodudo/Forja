import React, { useState } from 'react'
import './UserAccount.css'
import MeusDados from '../components/MeusDados';
import MeusPedidos from '../components/MeusPedidos';
import MeuHistorico from '../components/MeuHistorico';

function UserAccount() {
    const [componente, setComponente] = useState(<MeusDados />);
    const [ativo, setAtivo] = useState("dados"); // controla botão ativo

  return (
    <div className='container-user-account'>

        <div className="container-principal">
            <div className="container-principal-menu">
                <div className="parte-menu">

                    <div className="menu-parte-foto">
                        <div className="parte-foto"></div>
                        <label className='label-nome-usuario'>Nome usuário</label>
                    </div>

                    <div className="menu-parte-botoes">

                        <button className={`botoes-menu ${ativo === "dados" ? "ativo" : ""}`}
                            onClick={() => {
                                setComponente(<MeusDados/>)
                                setAtivo("dados")
                                }
                            }
                        >
                            Meus Dados
                        </button>

                        <button className={`botoes-menu ${ativo === "pedidos" ? "ativo" : ""}`}
                            onClick={() => {
                                setComponente(<MeusPedidos />)
                                setAtivo("pedidos")
                                }
                            }
                        >
                            Pedidos
                        </button>

                        <button className={`botoes-menu ${ativo === "historico" ? "ativo" : ""}`}
                            onClick={() => {
                                setComponente(<MeuHistorico/>)
                                setAtivo("historico")
                                }
                            }
                        >
                            Histórico
                        </button>

                    </div>

                    <div className="menu-parte-sair">
                        <button className="botao-deslogar" onClick={() => alert('Botão para deslogar!')}>Sair</button>
                    </div>

                </div>
            </div>

            <div className="container-principal-componente">
                <div className="parte-componente">
                    {componente}
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default UserAccount
