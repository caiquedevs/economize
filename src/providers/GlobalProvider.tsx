'use client';
import { Account } from '@/interfaces/account';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GlobalState {
  accounts: Account[];
}

export interface GlobalStateContextType {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalState>({ accounts: [] });

  React.useEffect(() => {
    setState(JSON.parse(localStorage.getItem('globalState') || JSON.stringify({ accounts: [] })));
    return () => {};
  }, []);

  useEffect(() => {
    localStorage.setItem('globalState', JSON.stringify(state));
  }, [state]);

  return <GlobalStateContext.Provider value={{ state, setState }}>{children}</GlobalStateContext.Provider>;
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState deve ser usado dentro de um GlobalStateProvider');
  }
  return context;
};
