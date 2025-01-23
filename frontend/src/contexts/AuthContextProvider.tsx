import React, { createContext, useContext, useState } from "react";

interface AuthContextProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = () => {
    if (!isLoggedIn) setIsLoggedIn(true);
  };
  const logout = () => {
    if (isLoggedIn) setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used in AuthContextProvider");
  }
  return context;
};
