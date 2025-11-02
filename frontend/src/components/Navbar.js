import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [image, setImage] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL;
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetch_org = async () => {
      const org = await axios.get(`${API_BASE}/orgs/get_org_by_id`, { params: { id: auth.id } });
      const data = org.data.result[0];
      setImage(data.profile_image);
    }

    const fetch_user = async () => {
      const user = await axios.get(`${API_BASE}/users/get_user_by_id`, { params: { id: auth.id } })
      const data = user.data.result[0];
      setImage(data.profile_image);
    }

    if (auth.id.length > 0) {
      if (auth.role === "volunteer") {
        fetch_user();
      } else if (auth.role === "organiser") {
        fetch_org();
      }
    }

  }, []);

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
            <NavLink to="/ai" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
              AI Chat
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/map" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
              Map
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/opportunities" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
              Opportunities
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/community" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
              Community
            </NavLink>
          </li>

          {auth?.role === "organiser" && (
            <li className="nav-item">
              <NavLink to="/organiser/dashboard" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
                Dashboard
              </NavLink>
            </li>
          )}
          {auth?.role === "volunteer" && (
            <li className="nav-item">
              <NavLink to="/volunteer/dashboard" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* Right Side */}
      <div className="d-flex align-items-center gap-3">
        {auth?.role === "volunteer" && (
          <>              
          <i
                className="bi bi-person-circle fs-5"
                onClick={() => navigate("/VolunteerProfile")}
                style={{ cursor: "pointer" }}
              />
          </>
        )}

        {auth.id.length > 0 ? (
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            className="btn rounded-pill px-4 fw-semibold shadow-sm text-white"
            style={{ background: 'linear-gradient(90deg,#43a1ff,#9b5bff)', border: 0 }}
            onClick={() => navigate("/choose-role")}
          >
            Get Started
          </button>

        )}
      </div>
    </nav>
  );
}

export default Navbar;