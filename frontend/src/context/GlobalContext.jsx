import { createContext, useState, useContext } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  
  const value = {
    
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);