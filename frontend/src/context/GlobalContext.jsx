import { createContext, useState, useContext } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [dadosDoPersonagem, setDadosDoPersonagem] = useState(null);
  const [imagemPersonagem, setImagemPersonagem] = useState('');

  return (
    <GlobalContext.Provider value={{
      dadosDoPersonagem,
      setDadosDoPersonagem,
      imagemPersonagem,
      setImagemPersonagem
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);