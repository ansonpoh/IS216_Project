import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleMapButton = () => {
    navigate("/maps");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      {/* Brand */}
      <a className="navbar-brand fw-bold text-primary d-flex align-items-center" href="/" onClick={(e) => { e.preventDefault(); handleHome(); }}>
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
            <a className="nav-link" href="/maps" onClick={(e) => { e.preventDefault(); handleMapButton(); }}>Map</a>
          </li>
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
              <li><a className="dropdown-item" href="#about">About</a></li>
            </ul>
          </li> */}
        </ul>
      </div>

      {/* Right Side */}
      <div className="d-flex align-items-center gap-3">
        <i className="bi bi-bell fs-5"></i>
        <i className="bi bi-person-circle fs-5"></i>
        <button className="btn btn-primary" onClick={handleGetStarted}>Get Started</button>
      </div>
    </nav>
  );
}

export default Navbar;