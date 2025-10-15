import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
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
            <a className={`navbar_item nav-link fw-semibold ${isActive("/") ? "active" : ""}`} href="/">
              AI Chat
            </a>
          </li>
          <li className="nav-item">
            <a className={`navbar_item nav-link fw-semibold ${isActive("/maps") ? "active" : ""}`} href="/maps">Map</a>
          </li>
          <li className="nav-item">
            <a className={`navbar_item nav-link fw-semibold ${isActive("/opportunities") ? "active" : ""}`} href="/opportunities">Opportunities</a>
          </li>
          <li className="nav-item">
            <a className={`navbar_item nav-link fw-semibold ${isActive("/community") ? "active" : ""}`} href="/community">Community</a>
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
          <i className="bi bi-bell fs-5" onClick={() => navigate("/notifications")}></i>
          <i className="bi bi-person-circle fs-5" onClick={() => navigate("/profile")}></i>
          <button className="btn btn-primary" onClick={() => navigate("/signup")}>Get Started</button>
      </div>
    </nav>
  );
}

export default Navbar;