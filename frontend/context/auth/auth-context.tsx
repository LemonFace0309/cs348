import { createContext, FC, ReactNode, useContext, useState } from "react";

import { ContextProps } from "./types";

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContext = createContext<ContextProps>({
  isAuthenticated: false,
  setIsAuthenticated: () => null,
});

export const AuthProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
