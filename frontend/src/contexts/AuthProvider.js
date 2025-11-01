import React, { useState, useEffect, createContext, useMemo, useContext } from "react";
import { supabase } from "../config/supabaseClient";
const DEFAULT_AUTH = {role: "", id: "", token: ""};

const AuthContext = createContext({
  auth: DEFAULT_AUTH,
  setAuth: () => {},
  logout: () => {},
  messages: [],
  setMessages: () => {},
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

  const logout = async () => {
    await supabase.auth.signOut();
    setAuth(DEFAULT_AUTH);
    sessionStorage.removeItem("auth");
  }

  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem("chatMessages");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const value = useMemo(() => ({auth, setAuth, logout, messages, setMessages}), [auth, messages]);

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) throw new Error ("useAuth must be used within AuthProvider");
  return context;
}
