import React, { createContext, useState, ReactNode } from 'react';

interface GlobalContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const GlobalContext = createContext<GlobalContextType>({
  isDark: false,
  toggleTheme: () => {},
});

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps): JSX.Element => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <GlobalContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};
