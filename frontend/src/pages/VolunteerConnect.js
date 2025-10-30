import React from "react";
import "../styles/VolunteerConnect.css";
import ChatWindow from "../components/ai_chat/ChatWindow";
import Navbar from "../components/Navbar";

function VolunteerConnect() {

  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light col-12">
      <Navbar/>
      <div className="d-flex justify-content-center align-items-center bg-light" style={{overflow: "hidden"}}>
        <ChatWindow />
      </div>
    </div>
  );
}

export default VolunteerConnect;