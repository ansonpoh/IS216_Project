import React, { useEffect } from "react";
import styles from "../styles/VolunteerConnect.module.css";
import ChatWindow from "../components/ai_chat/ChatWindow";
import Navbar from "../components/Navbar";
import PageTransition from '../components/Animation/PageTransition';
import { supabase } from "../config/supabaseClient";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";

function VolunteerConnect() {
  const { setAuth, auth } = useAuth();
  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"

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