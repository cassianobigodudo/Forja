import React, { useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext';
import './CaixaCadastroLogin.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CaixaCadastroLogin() {

  const [isLogin, setIsLogin] = useState(true)
  const [inputNome, setInputNome] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputSenha, setInputSenha] = useState('')
  const [inputConfirmarSenha, setInputConfirmarSenha] = useState('')

  const { loginUsuario } = useGlobalContext();
  const API_URL = "https://forja-qvex.onrender.com/api"
  const navigate = useNavigate();

  async function AutenticacaoConta(){
    if (!inputEmail || !inputSenha) {
        alert("Por favor, preencha email e senha.");
        return;
    }

      try {
        if (isLogin) {
          // ================= LOGICA DE LOGIN =================
          console.log("--- [DEBUG LOGIN] Tentando logar com:", inputEmail);

          const response = await axios.post(`${API_URL}/usuarios/login`, {
            email: inputEmail,
            senha: inputSenha
          });

          console.log("--- [DEBUG LOGIN] Resposta do Backend:", response.data);

          // VERIFICAÇÃO DE SEGURANÇA PARA DEBUG
          if (!response.data.id_usuario) {
             console.warn("--- [ALERTA] O Backend não retornou 'id_usuario'. Verifique se veio como 'id' ou '_id'. Chaves recebidas:", Object.keys(response.data));
          }

          // Envia para o Contexto
          loginUsuario(response.data);

          alert(`Bem-vindo de volta, ${response.data.nome_usuario || 'Viajante'}!`);
          
          console.log("--- [DEBUG LOGIN] Redirecionando para /loja...");
          navigate('/loja'); // 3. REDIRECIONAR

        } else {
          // ================= LOGICA DE CADASTRO =================
          if (inputSenha !== inputConfirmarSenha) {
            alert("As senhas não coincidem!");
            return;
          }

          await axios.post(`${API_URL}/usuarios/cadastro`, {
            nome: inputNome,   
            email: inputEmail, 
            senha: inputSenha  
          });
          
          alert("Cadastro realizado com sucesso! Agora faça login.");
          setIsLogin(true); 
        }

      } catch (error) {
        console.error("--- [ERRO LOGIN] Falha na requisição:", error);
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

