import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../contexts/AuthProvider"; // <-- add this

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const { auth, logout } = useAuth(); // { role: 'volunteer' | 'organiser', id: ... } or null

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <a className="navbar-brand fw-bold text-primary d-flex align-items-center" href="/">
        <i className="bi bi-heart-fill text-danger me-2"></i>
        VolunteerConnect
      </a>

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

          {/* Organiser-only link */}
          {auth?.role === "organiser" && (
            <li className="nav-item">
              <a
                className={`navbar_item nav-link fw-semibold ${isActive("/organiser/dashboard") ? "active" : ""}`}
                href="/organiser/dashboard"
              >
                Dashboard
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Right Side */}
      <div className="d-flex align-items-center gap-3">
        {/* Volunteer-only icons */}
        {auth?.role === "volunteer" && (
          <>
            <i
              className="bi bi-bell fs-5"
              onClick={() => navigate("/notifications")}
              style={{ cursor: "pointer" }}
            />
            <i
              className="bi bi-person-circle fs-5"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            />
          </>
        )}

        {/* Auth buttons */}
        {auth.id.length > 0 ?(
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate("/choose-role")}>
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
