import React from "react";
import AuthContextProvider from "./AuthContextProvider";

interface AppContextsProviderProps {
  children: React.ReactNode;
}

export default function AppContextsProvider({
  children,
}: AppContextsProviderProps) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
