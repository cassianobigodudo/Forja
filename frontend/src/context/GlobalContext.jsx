// Seu arquivo GlobalContext.jsx - VERSÃO ATUALIZADA

import { createContext, useState, useContext, useEffect } from "react"; // 1. Importar o useEffect

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [dadosDoPersonagem, setDadosDoPersonagem] = useState(null);
  const [imagemPersonagem, setImagemPersonagem] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const [usuarioNome, setUsuarioNome] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [carrinho, setCarrinho] = useState([]); // Lista de itens
  const [isCarrinhoAberto, setIsCarrinhoAberto] = useState(false); // Controle Global de abrir/fechar

  // Função para adicionar (evita duplicatas se quiser, ou soma quantidade)
  const adicionarAoCarrinho = (item) => {
      // Adiciona um ID único temporário para o item no carrinho (caso adicione 2 iguais)
      const itemComIdUnico = { ...item, cartId: Date.now() }; 
      setCarrinho((prev) => [...prev, itemComIdUnico]);
      setIsCarrinhoAberto(true); // Abre o carrinho automaticamente
  };

  const removerDoCarrinho = (cartId) => {
      setCarrinho((prev) => prev.filter(item => item.cartId !== cartId));
  };

  useEffect(() => {
    const idSalvo = localStorage.getItem('id_usuario');
    const nomeSalvo = localStorage.getItem('usuario_nome');

    console.log("--- [DEBUG CONTEXT] Inicializando... LocalStorage tem ID?", idSalvo);

    if (idSalvo) {
        setUsuarioId(idSalvo);
        setUsuarioNome(nomeSalvo);
    }
    
    setIsLoadingAuth(false);
}, []);

const loginUsuario = (dadosUsuario) => {
    console.log("--- [DEBUG CONTEXT] loginUsuario chamado com:", dadosUsuario);

    // FALLBACK: Se o backend mandar 'id' em vez de 'id_usuario', corrigimos aqui
    const idFinal = dadosUsuario.id_usuario || dadosUsuario.id; 
    const nomeFinal = dadosUsuario.nome_usuario || dadosUsuario.nome;

    if (!idFinal) {
        console.error("--- [ERRO CRÍTICO] ID do usuário está undefined/null!");
    }

    setUsuarioId(idFinal);
    setUsuarioNome(nomeFinal);

    localStorage.setItem('id_usuario', idFinal);
    localStorage.setItem('usuario_nome', nomeFinal);
    
    console.log(`--- [DEBUG CONTEXT] Salvo no LocalStorage. ID: ${idFinal}`);
};

const logoutUsuario = () => {
    console.log("--- [DEBUG CONTEXT] Logout efetuado.");
    setUsuarioId(null);
    setUsuarioNome(null);
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('usuario_nome');
};

  return (
    <GlobalContext.Provider value={{
      dadosDoPersonagem,
      setDadosDoPersonagem,
      imagemPersonagem,
      setImagemPersonagem,
      usuarioId, 
      usuarioNome, 
      loginUsuario, 
      logoutUsuario,
      isLoadingAuth,
      carrinho,
      isCarrinhoAberto,
      adicionarAoCarrinho,
      removerDoCarrinho,
      setIsCarrinhoAberto
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);