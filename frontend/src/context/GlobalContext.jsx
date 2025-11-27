// Seu arquivo GlobalContext.jsx - VERSÃO ATUALIZADA

import { createContext, useState, useContext, useEffect } from "react"; // 1. Importar o useEffect

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [dadosDoPersonagem, setDadosDoPersonagem] = useState(null);
  const [imagemPersonagem, setImagemPersonagem] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const [usuarioNome, setUsuarioNome] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
        // 1. Ao carregar o site, verifica o HD (LocalStorage)
        const idSalvo = localStorage.getItem('id_usuario');
        const nomeSalvo = localStorage.getItem('usuario_nome');

        if (idSalvo) {
            setUsuarioId(idSalvo);
            setUsuarioNome(nomeSalvo);
        }
        
        setIsLoadingAuth(false); // Terminou de verificar
    }, []);

    // 2. Função de Login (Centralizada)
    const loginUsuario = (dadosUsuario) => {
        // Atualiza a memória RAM (React reage na hora)
        setUsuarioId(dadosUsuario.id_usuario);
        setUsuarioNome(dadosUsuario.nome_usuario);

        // Atualiza o HD (Persistência)
        localStorage.setItem('id_usuario', dadosUsuario.id_usuario);
        localStorage.setItem('usuario_nome', dadosUsuario.nome_usuario);
    };

    // 3. Função de Logout (Centralizada)
    const logoutUsuario = () => {
        setUsuarioId(null);
        setUsuarioNome(null);
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('usuario_nome');
        // Opcional: window.location.href = '/'; 
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
      isLoadingAuth
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);