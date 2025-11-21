import React, { useState } from 'react'
import './CaixaCadastroLogin.css'
import axios from 'axios'

function CaixaCadastroLogin() {

  const [isLogin, setIsLogin] = useState(true)
  const [inputNome, setInputNome] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputSenha, setInputSenha] = useState('')
  const [inputConfirmarSenha, setInputConfirmarSenha] = useState('')

  const API_URL = "https://forja-qvex.onrender.com/api"

  async function AutenticacaoConta(){
  if (!inputEmail || !inputSenha) {
        alert("Por favor, preencha email e senha.");
        return;
      }

      try {
        if (isLogin) {
          // ================= LOGICA DE LOGIN =================
          const response = await axios.post(`${API_URL}/usuarios/login`, {
            email: inputEmail,
            senha: inputSenha
          });

          // Se chegou aqui, o login deu certo!
          // 2. O "Pulo do Gato": Salvar o ID que o backend mandou
          localStorage.setItem('usuario_id', response.data.id_usuario);
          localStorage.setItem('usuario_nome', response.data.nome_usuario);

          alert(`Bem-vindo de volta, ${response.data.nome_usuario}!`);

        } else {
          // ================= LOGICA DE CADASTRO =================
          
          if (inputSenha !== inputConfirmarSenha) {
            alert("As senhas não coincidem!");
            return;
          }

          const response = await axios.post(`${API_URL}/usuarios/cadastro`, {
            nome: inputNome,   // Mapeia inputNome -> nome
            email: inputEmail, // Mapeia inputEmail -> email
            senha: inputSenha  // Mapeia inputSenha -> senha
          });
          
          alert("Cadastro realizado com sucesso! Agora faça login.");
          setIsLogin(true); // Muda para a tela de login automaticamente
        }

      } catch (error) {
        console.error("Erro na autenticação:", error);
        // Mostra a mensagem de erro que veio do backend (ex: "Senha incorreta")
        const mensagemErro = error.response?.data?.message || "Erro ao conectar.";
        alert(mensagemErro);
      }
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
          type="password" 
          placeholder='Confirmar Senha'
          onChange={(event) => setInputConfirmarSenha(event.target.value)}
          value={inputConfirmarSenha} />}
        </div>
      </div>

      <button className='btn-confirmar' onClick={AutenticacaoConta}>CONFIRMAR</button>

    </div>
  )
}

export default CaixaCadastroLogin

