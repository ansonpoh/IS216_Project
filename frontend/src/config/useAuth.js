// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("getUser error", error);
        }
        if (mounted) setUser(data?.user ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    getUser();

    // subscribe to auth changes so UI updates when user signs in/out
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setInitializing(false);
    });

    return () => {
      mounted = false;
      if (sub?.subscription) sub.subscription.unsubscribe();
    };
  }, []);

  return { user, initializing };
}
