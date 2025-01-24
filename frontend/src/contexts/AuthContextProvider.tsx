import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  userId: number | null;
  login: (jwtToken: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    login(jwtToken);
  }, []);

  const login = async (jwtToken: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/verify-jwt-token",
        { jwtToken }
      );

      if (response.status === 200) {
        console.log(response.data.userId);

        setUserId(response.data.userId);
        localStorage.setItem("jwtToken", jwtToken);
      } else {
        localStorage.removeItem("jwtToken");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 401) {
          console.log(err.response?.data.message);
        }
      } else {
        console.log("Token verification error");
      }
    }
  };
  const logout = () => {
    setUserId(null);
    localStorage.removeItem("jwtToken");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
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
