import React from "react";
import styles from "../styles/VolunteerConnect.module.css";
import ChatWindow from "../components/ai_chat/ChatWindow";
import Navbar from "../components/Navbar";
import PageTransition from '../components/Animation/PageTransition';

function VolunteerConnect() {
  return (
    <PageTransition>
    <div className={`container-fluid vh-100 d-flex flex-column bg-light col-12 ${styles.container}`}>
      <Navbar />
      <div
        className={`d-flex justify-content-center align-items-center bg-light ${styles.chatWrapper}`}
        style={{ overflow: "hidden" }}
      >
        <ChatWindow />
      </div>
    </div>
    </PageTransition>
  );
}

export default VolunteerConnect;