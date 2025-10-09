import React from "react";
import "../styles/VolunteerConnect.css";
import Navbar from "./Navbar";

function VolunteerConnect() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column bg-light col-12">
      <Navbar />
      
      {/* Content */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <h3 className="fw-bold">Welcome to VolunteerConnect AI</h3>
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
        </p>

        {/* Option Cards */}
        <div className="options-list mt-4">
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
        </div>

        {/* Chat Box */}
        <div className="input-group mt-4 w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Ask me about volunteer opportunities..."
          />
          <button className="btn btn-primary">
            <i className="bi bi-send"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VolunteerConnect;