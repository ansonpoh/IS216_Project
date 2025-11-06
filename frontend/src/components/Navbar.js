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
        const org = await axios.get(`${API_BASE}/orgs/get_org_by_id`, { params: { id: auth.id } });
        const data = org?.data?.result?.[0];
        if (data && data.profile_image) setImage(data.profile_image);
      } catch (err) {
        console.error('Failed to fetch org profile image', err?.response?.data || err.message || err);
      }
    }

    const fetch_user = async () => {
      try {
        const user = await axios.get(`${API_BASE}/users/get_user_by_id`, { params: { id: auth.id } })
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

  <div className="collapse navbar-collapse" id="navbarNav">
    {/* Center Links - Hidden on mobile */}
    <ul className="navbar-nav mx-auto gap-3 d-none d-lg-flex">
      <li className="nav-item">
        <NavLink to="/ai" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Vera
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/map" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Map
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/opportunity" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Opportunity
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/community" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Community
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/analytics" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Analytics
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

    {/* Mobile Links with Dividers */}
    <ul className="navbar-nav d-lg-none mobile-nav-list">
      {/* Mobile avatar row: shown when signed in, above the logout/get-started button */}
      {auth?.id?.length > 0 && auth?.role === "volunteer" && (
        // Show avatar in mobile collapse only for volunteers (organisers should not see avatar here)
        <li className="nav-item mobile-nav-item mobile-avatar-item">
          <div className="d-flex align-items-center gap-2" style={{ padding: '8px 12px' }}>
            <img
              src={image || avatar}
              alt="Profile"
              onClick={() => navigate("/VolunteerProfile")}
              style={{ width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', objectFit: 'cover', border: '2px solid #7494ec' }}
            />
          </div>
        </li>
      )}
      <li className="nav-item mobile-nav-item">
        <NavLink to="/ai" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Vera
        </NavLink>
      </li>
      <li className="nav-item mobile-nav-item">
        <NavLink to="/map" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Map
        </NavLink>
      </li>
      <li className="nav-item mobile-nav-item">
        <NavLink to="/opportunity" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Opportunity
        </NavLink>
      </li>
      <li className="nav-item mobile-nav-item">
        <NavLink to="/community" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Community
        </NavLink>
      </li>
      <li className="nav-item mobile-nav-item">
        <NavLink to="/analytics" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
          Analytics
        </NavLink>
      </li>
      {auth?.role === "organiser" && (
        <li className="nav-item mobile-nav-item">
          <NavLink to="/organiser/dashboard" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
            Dashboard
          </NavLink>
        </li>
      )}
      {auth?.role === "volunteer" && (
        <li className="nav-item mobile-nav-item">
          <NavLink to="/volunteer/dashboard" className={({ isActive }) => `${styles['navbar_item']} nav-link fw-semibold ${isActive ? styles.active : ''}`}>
            Dashboard
          </NavLink>
        </li>
      )}
      
      {/* Mobile Get Started / Logout with gradient */}
      <li className="nav-item mobile-nav-item">
        {auth?.id?.length > 0 ? (
          <button className={`btn btn-sm w-100 text-start ${styles.logoutBtn}`} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            className={`btn w-100 fw-semibold text-white ${styles.mobileGetStarted}`}
            onClick={() => navigate("/choose-role")}
          >
            Get Started
          </button>
        )}
      </li>
    </ul>

    {/* Right Side - Desktop Only */}
    <div className={`d-none d-lg-flex align-items-center gap-3 ${styles.navbarRight}`}>
      {auth?.role === "volunteer" && (
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
      )}

      {auth?.id?.length > 0 ? (
        <button className={`btn btn-sm ${styles.logoutBtn}`} onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button
          className={`btn rounded-pill px-4 fw-semibold shadow-sm text-white ${styles.getStartedBtn}`}
          onClick={() => navigate("/choose-role")}
        >
          Get Started
        </button>
      )}
    </div>
  </div>
</nav>
  );
}

export default Navbar;