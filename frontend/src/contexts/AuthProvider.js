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
    localStorage.removeItem("sb-persist-session");
    localStorage.removeItem("sb-zswpvzxercgzdhiabbvz-auth-token")
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

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || !session.user) {
        setAuth(DEFAULT_AUTH);
        return;
      }
      if(JSON.parse(localStorage.getItem("sb-persist-session"))?.role === "volunteer") {
        setAuth({role: "volunteer", id: session.user.id, token: session.access_token})
      }
      else if (JSON.parse(localStorage.getItem("sb-persist-session"))?.role === "organiser") {
        setAuth({role: "organiser", id:session.user.id, token: session.access_token});
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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
