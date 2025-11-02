import React, { useEffect } from "react";
import styles from "../styles/VolunteerConnect.module.css";
import ChatWindow from "../components/ai_chat/ChatWindow";
import Navbar from "../components/Navbar";
import PageTransition from '../components/Animation/PageTransition';
import { supabase } from "../config/supabaseClient";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";

function VolunteerConnect() {
  const { setAuth } = useAuth();
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const checkGoogleRedirect = async () => {
      const {data: sessionData} = await supabase.auth.getSession();
      const session = sessionData?.session;
      const user = session?.user;
      if(!session || !user) return;

      const accessToken = session.access_token;
      const supabaseId = user.id;
      const email = user.email;
      const username = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata.username || "";
      try {
        const formData = new FormData();
        formData.append("supabase_id", supabaseId);
        formData.append("username", username);
        formData.append("email", email);
        await axios.post(`${API_BASE}/users/complete_registration`, formData, {headers: {"Content-Type":"multipart/form-data"}});
      } catch (err) {
        console.error(err);
      }

      setAuth({
        role: "volunteer",
        id: supabaseId,
        token: accessToken
      })
    }

    checkGoogleRedirect();
  }, [setAuth])

  return (
    <><Navbar />
    <PageTransition>
    <div className={`container-fluid vh-100 d-flex flex-column col-12 ${styles.container}`}>
      
      <div
        className={`d-flex justify-content-center align-items-center ${styles.chatWrapper}`}
        style={{ overflow: "hidden" }}
      >
        <ChatWindow />
      </div>
    </div>
    </PageTransition>
    </>
  );
}

export default VolunteerConnect;