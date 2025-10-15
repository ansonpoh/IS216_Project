import React, { useState, useEffect, createContext, useMemo, useContext } from "react";

const DEFAULT_AUTH = {role: "", id: ""};

const AuthContext = createContext({
  auth: DEFAULT_AUTH,
  setAuth: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(() => {
    try {
      const stored = sessionStorage.getItem("auth");
      return stored ? JSON.parse(stored) : DEFAULT_AUTH;
    } catch {
      return DEFAULT_AUTH;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const logout = () => {
    setAuth(DEFAULT_AUTH);
    sessionStorage.removeItem("auth");
  }

  const value = useMemo(() => ({auth, setAuth, logout}), [auth]);

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) throw new Error ("useAuth must be used within AuthProvider");
  return context;
}
