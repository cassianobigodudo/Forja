import React, { useState } from 'react'
import './UserAccount.css'
import MeusDados from '../components/MeusDados';
import MeusPedidos from '../components/MeusPedidos';
import MeuHistorico from '../components/MeuHistorico';

function UserAccount() {
    const [componente, setComponente] = useState(<MeusDados />);

  return (
    <div className='container-user-account'>

        <div className="container-principal">
            <div className="container-principal-menu">
                <div className="parte-menu">

                    <div className="menu-parte-foto">
                        <div className="parte-foto"></div>
                        <h3>Nome usuário</h3>
                    </div>

                    <div className="menu-parte-botoes">
                        <button className="botoes-menu" onClick={() => setComponente(<MeusDados/>)}>Meus Dados</button>
                        <button className="botoes-menu" onClick={() => setComponente(<MeusPedidos/>)}>Pedidos</button>
                        <button className="botoes-menu" onClick={() => setComponente(<MeuHistorico/>)}>Histórico</button>
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
