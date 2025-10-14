import React from "react";
import "../styles/VolunteerConnect.css";
import { useNavigate } from "react-router-dom";
import ChatWindow from "../components/ai_chat/ChatWindow";

function VolunteerConnect() {

  const nav = useNavigate();
  
  const handle_get_started = () => {
    nav("/signup")
  }
  const profile_get_started = () => {
    nav("/profile")
  }
  const notification_get_started = () => {
    nav("notifications")
  }


  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light col-12">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        {/* Brand */}
        <a className="navbar-brand fw-bold text-primary d-flex align-items-center" href="/">
            <i className="bi bi-heart-fill text-success me-2"></i>
            VolunteerConnect
        </a>

        {/* Collapse Button for Mobile */}
        <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
        >
            <span className="navbar-toggler-icon"></span>
        </button>

        {/* Center Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav gap-3">
                <li className="nav-item">
                    <a className="nav-link active fw-semibold" href="#chat">
                    AI Chat
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/maps">Map</a>
                </li>
                {/* <li className="nav-item">
                    <a className="nav-link" href="#impact">My Impact</a>
                </li> */}
                <li className="nav-item">
                    <a className="nav-link" href="#opportunities">Opportunities</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#community">Community</a>
                </li>
                
                {/* <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#more" role="button" data-bs-toggle="dropdown">
                    More
                    </a>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="/about">About</a></li>
                        <li><a className="dropdown-item" href="#contact">Contact</a></li>
                    </ul>
                </li>  */}
            </ul>
        </div>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-3">
            <i className="bi bi-bell fs-5" onClick={notification_get_started}></i>
            <i className="bi bi-person-circle fs-5" onClick={profile_get_started}></i>
            <button className="btn btn-primary" onClick={handle_get_started}>Get Started</button>
        </div>
      </nav>
      
      <div className="d-flex justify-content-center align-items-center bg-light" style={{overflow: "hidden"}}>
        <ChatWindow />
      </div>

      {/* Content */}
      {/* <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4"> */}
        {/* <h3 className="fw-bold">Welcome to VolunteerConnect AI</h3>
        <p className="text-muted w-75 mx-auto">
          I'm here to help you discover meaningful volunteer opportunities that
          match your interests, skills, and schedule. Let's find the perfect way
          for you to make an impact!
        </p>

        <h5 className="mt-4">
          How can I help you find the perfect volunteer opportunity?
        </h5>
        <p className="text-muted">
          Choose a starting point below or ask me anything about volunteering
        </p> */}

        {/* Option Cards */}
        {/* <div className="options-list mt-4">
          <div className="option-card">
            <i className="bi bi-heart text-primary"></i>
            <div>
              <div className="fw-semibold">I'm new to volunteering</div>
              <div className="text-muted small">
                Help me find the perfect first opportunity
              </div>
            </div>
          </div>

          <div className="option-card">
            <i className="bi bi-clock text-primary"></i>
            <div>
              <div className="fw-semibold">I have limited time</div>
              <div className="text-muted small">
                Find flexible opportunities that fit my schedule
              </div>
            </div>
          </div>

          <div className="option-card">
            <i className="bi bi-bullseye text-primary"></i>
            <div>
              <div className="fw-semibold">Use my professional skills</div>
              <div className="text-muted small">
                Match my expertise with meaningful causes
              </div>
            </div>
          </div>

          <div className="option-card">
            <i className="bi bi-geo-alt text-primary"></i>
            <div>
              <div className="fw-semibold">Make local impact</div>
              <div className="text-muted small">
                Find ways to help my immediate community
              </div>
            </div>
          </div>
        </div> */}

        {/* Chat Box */}
        {/* <div className="input-group mt-4 w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Ask me about volunteer opportunities..."
          />
          <button className="btn btn-primary">
            <i className="bi bi-send"></i>
          </button>
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default VolunteerConnect;