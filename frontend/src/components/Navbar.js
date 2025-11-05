import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import avatar from "./images/avatar.png";
import Logo from "../components/images/logo.svg";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [image, setImage] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetch_org = async () => {
      try {
        const org = await axios.get(`${LOCAL_BASE}/orgs/get_org_by_id`, { params: { id: auth.id } });
        const data = org?.data?.result?.[0];
        if (data && data.profile_image) setImage(data.profile_image);
      } catch (err) {
        console.error('Failed to fetch org profile image', err?.response?.data || err.message || err);
      }
    }

    const fetch_user = async () => {
      try {
        const user = await axios.get(`${LOCAL_BASE}/users/get_user_by_id`, { params: { id: auth.id } })
        const data = user?.data?.result?.[0];
        if (data && data.profile_image) setImage(data.profile_image);
      } catch (err) {
        console.error('Failed to fetch user profile image', err?.response?.data || err.message || err);
      }
    }

    // Only run when auth is available. Use optional chaining to avoid runtime errors
    if (auth?.id?.length > 0) {
      if (auth.role === "volunteer") {
        fetch_user();
      } else if (auth.role === "organiser") {
        fetch_org();
      }
    }

  // Re-run this effect whenever auth changes so the avatar updates when a user signs in/out
  }, [auth]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <a className="navbar-brand fw-bold text-primary d-flex align-items-center" href="/">
        <img src={Logo} alt="VolunteerConnect Logo" className="me-2" style={{ width: 28, height: 28, objectFit: 'contain' }} />
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
          <img
                src={image || avatar}
                alt="Profile"
                onClick={() => navigate("/VolunteerProfile")}
                style={{
                  cursor: "pointer",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #7494ec",
                }}
              />
          </>
        )}

        {auth?.id?.length > 0 ? (
          <button className={`btn btn-sm ${styles.logoutBtn}`} onClick={handleLogout}>
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