// Seu arquivo GlobalContext.jsx - VERSÃO ATUALIZADA

import { createContext, useState, useContext, useEffect } from "react"; // 1. Importar o useEffect

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [dadosDoPersonagem, setDadosDoPersonagem] = useState(null);
  const [imagemPersonagem, setImagemPersonagem] = useState('');
  const [sessionId, setSessionId] = useState(null);
  useEffect(() => {
    // Acessamos o localStorage para ver se já existe um ID.
    let currentSessionId = localStorage.getItem('sessionId');
    
    // Se não existir, criamos um novo.
    if (!currentSessionId) {
      currentSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('sessionId', currentSessionId);
    }
    
    // Salvamos o ID (existente ou novo) no nosso estado do React.
    setSessionId(currentSessionId);

  }, []);

  // 5. (Opcional, mas recomendado) Evita que o app tente renderizar algo 
  // antes do sessionId estar pronto, o que poderia causar erros em chamadas de API.
  if (!sessionId) {
    return <div>Carregando sessão...</div>;
  }

  return (
    <GlobalContext.Provider value={{
      dadosDoPersonagem,
      setDadosDoPersonagem,
      imagemPersonagem,
      setImagemPersonagem,
      sessionId // 4. Adicionar o sessionId ao objeto de valor para que ele seja compartilhado
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);