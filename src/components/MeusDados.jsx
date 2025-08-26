import React, { useState } from 'react'
import './MeusDados.css'

function MeusDados() {
    const [apelido, setApelido] = useState();
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [endereco, setEndereco] = useState();

  return (
    <div className='container-meus-dados'>

        <div className="parte-inputs">

            <div className="inputs">
                <div className="inputs-parte-dados">
                    <label className='label-dados'>Apelido</label>
                    <input 
                        type="text" 
                        className="inputs-dados" 
                        placeholder='Apelido' 
                        disabled
                        value={apelido}
                        onChange={(event) => setApelido(event.target.value)}
                    />
                </div>
                <div className="inputs-parte-botao-editar">
                    <button className="botao-editar-dados" onClick={() => alert('Botão para editar o apelido')}>✏️</button>
                </div>
            </div>

            <div className="inputs">
                <div className="inputs-parte-dados">
                    <label className='label-dados'>E-mail</label>
                    <input 
                        type="text" 
                        className="inputs-dados" 
                        placeholder='E-mail' 
                        disabled
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="inputs-parte-botao-editar">
                    <button className="botao-editar-dados" onClick={() => alert('Botão para editar o e-mail')}>✏️</button>
                </div>
            </div>

            <div className="inputs">
                <div className="inputs-parte-dados">
                    <label className='label-dados'>Senha</label>
                    <input 
                        type="text" 
                        className="inputs-dados" 
                        placeholder='Senha' 
                        disabled
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                    />
                </div>
                <div className="inputs-parte-botao-editar">
                    <button className="botao-editar-dados" onClick={() => alert('Botão para editar a senha')}>✏️</button>
                </div>
            </div>

            <div className="inputs">
                <div className="inputs-parte-dados">
                    <label className='label-dados'>Endereço</label>
                    <input 
                        type="text" 
                        className="inputs-dados" 
                        placeholder='Endereço' 
                        disabled
                        value={endereco}
                        onChange={(event) => setEndereco(event.target.value)}
                    />
                </div>
                <div className="inputs-parte-botao-editar">
                    <button className="botao-editar-dados" onClick={() => alert('Botão para adicionar endereço')}>➕</button>
                </div>
            </div>
            
        </div>

        <div className="parte-salvar-dados">

            <div className="parte-deletar-conta">
                <button className="botao-deletar-conta" onClick={() => alert('Botão para excluir a conta')}>Excluir Conta🚮</button>
            </div>

            <div className="parte-salvar-edicao">
                <button className="botao-salvar-edicao" onClick={() => alert('Botão para salvar os dados editados')}>Salvar✅</button>
            </div>
            
        </div>
      
    </div>
  )
}

export default MeusDados
