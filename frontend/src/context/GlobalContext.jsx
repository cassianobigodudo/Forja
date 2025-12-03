import { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  // --- ESTADOS ---
  const [dadosDoPersonagem, setDadosDoPersonagem] = useState(null);
  const [imagemPersonagem, setImagemPersonagem] = useState('');
  
  const [usuarioId, setUsuarioId] = useState(null);
  const [usuarioNome, setUsuarioNome] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [carrinho, setCarrinho] = useState([]); 
  const [isCarrinhoAberto, setIsCarrinhoAberto] = useState(false); 

  const API_URL = 'https://forja-qvex.onrender.com/api/carrinho';

  // =================================================================
  // 1. FUNÇÃO MÁGICA: BUSCAR CARRINHO DO BANCO
  // =================================================================
  const atualizarCarrinho = async (idDoUsuario) => {
      // Se não passar ID, tenta pegar do estado ou localStorage
      const idFinal = idDoUsuario || usuarioId || localStorage.getItem('id_usuario');
      
      if (!idFinal) return; // Se não tem usuário, não tem o que buscar

      try {
          console.log(`--- [DEBUG CONTEXT] Buscando carrinho do User ID: ${idFinal}...`);
          const response = await axios.get(`${API_URL}/${idFinal}`);
          
          // O backend retorna os itens. Salvamos no estado para o Modal ler.
          setCarrinho(response.data); 
          console.log("--- [DEBUG CONTEXT] Carrinho atualizado:", response.data.length, "itens.");

      } catch (error) {
          console.error("--- [ERRO CONTEXT] Falha ao buscar carrinho:", error);
      }
  };

  // =================================================================
  // 2. INICIALIZAÇÃO (F5)
  // =================================================================
  useEffect(() => {
    const idSalvo = localStorage.getItem('id_usuario');
    const nomeSalvo = localStorage.getItem('usuario_nome');

    if (idSalvo) {
        setUsuarioId(idSalvo);
        setUsuarioNome(nomeSalvo);
        // AQUI ESTÁ O SEGREDO: Assim que restaurar o ID, busca o carrinho!
        atualizarCarrinho(idSalvo);
    }
    
    setIsLoadingAuth(false);
  }, []);

  // =================================================================
  // 3. ADICIONAR (POST + ATUALIZAR)
  // =================================================================
  const adicionarAoCarrinho = async (item) => {
    const idArmazenado = localStorage.getItem('id_usuario');
    
    if (!idArmazenado) {
        alert("Você precisa entrar na sua conta para adicionar itens ao carrinho!");
        return;
    }

    try {
        // Envia para o banco
        await axios.post(API_URL, {
            id_usuario: idArmazenado,
            personagem_id: item.id 
        });

        // IMEDIATAMENTE busca do banco de novo para garantir que a lista está igual
        await atualizarCarrinho(idArmazenado);
        
        setIsCarrinhoAberto(true); // Abre o modal
        console.log("Item salvo e lista sincronizada!");

    } catch (error) {
        if (error.response && error.response.status === 409) {
            alert("Este personagem já está no seu carrinho!");
        } else {
            console.error("Erro ao adicionar:", error);
            alert("Erro ao conectar com a forja.");
        }
    }
  };

  // =================================================================
  // 4. REMOVER (DELETE + ATUALIZAR)
  // =================================================================
  const removerDoCarrinho = async (idPersonagem) => {
    const idArmazenado = localStorage.getItem('id_usuario');
    
    if (!idArmazenado) {
        alert("Você precisa entrar na sua conta para remover itens do carrinho!");
        return;
    }

    try {
        // Envia para o banco
        await axios.delete(`${API_URL}/${idArmazenado}/${idPersonagem}`);

        // IMEDIATAMENTE busca do banco de novo para garantir que a lista está igual
        await atualizarCarrinho(idArmazenado);
        
        console.log("Item removido e lista sincronizada!");

    } catch (error) {
        console.error("Erro ao remover:", error);
        alert("Erro ao conectar com a forja.");
    }
  }


  // =================================================================
  // 5. LOGIN E LOGOUT
  // =================================================================
  const loginUsuario = (dadosUsuario) => {
    const idFinal = dadosUsuario.id_usuario || dadosUsuario.id; 
    const nomeFinal = dadosUsuario.nome_usuario || dadosUsuario.nome;

    if (!idFinal) {
        console.error("--- [ERRO CRÍTICO] ID undefined no Login!");
        return;
    }

    setUsuarioId(idFinal);
    setUsuarioNome(nomeFinal);
    localStorage.setItem('id_usuario', idFinal);
    localStorage.setItem('usuario_nome', nomeFinal);
    
    // Assim que logar, busca o carrinho desse usuário!
    atualizarCarrinho(idFinal);
  };

  const logoutUsuario = () => {
    setUsuarioId(null);
    setUsuarioNome(null);
    setCarrinho([]); // Limpa o carrinho da tela
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('usuario_nome');
  };

  return (
    <GlobalContext.Provider value={{
      // Auth
      usuarioId, 
      usuarioNome, 
      loginUsuario, 
      logoutUsuario,
      isLoadingAuth,
      
      // Carrinho
      carrinho,
      isCarrinhoAberto,
      setIsCarrinhoAberto,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarCarrinho, // Exportando caso queira chamar manualmente em algum lugar
      
      // Customização
      dadosDoPersonagem,
      setDadosDoPersonagem,
      imagemPersonagem,
      setImagemPersonagem,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);