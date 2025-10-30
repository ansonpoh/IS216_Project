import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import Navbar from "../../components/Navbar";
import styles from "../../styles/RoleSelect.module.css";

export default function RoleSelect() {
  const nav = useNavigate();
  const { search } = useLocation();
  const gateRef = useRef(null);

  const next = new URLSearchParams(search).get("next") || "";

  const goVolunteer = () =>
    nav(`/volunteer/auth${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  const goOrganiser = () =>
    nav(`/organiser/auth${next ? `?next=${encodeURIComponent(next)}` : ""}`);

  // Ripple animation for buttons
  const ripple = (e) => {
    const btn = e.currentTarget;
    const r = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = `${size}px`;
    r.style.left = `${e.clientX - rect.left - size / 2}px`;
    r.style.top = `${e.clientY - rect.top - size / 2}px`;
    r.className = styles.ripple;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  };

  return (
    <>
      <Navbar />
      <main className={styles['role-bg']}>
        <div className={styles.orb + " " + styles['orb-1']} />
        <div className={styles.orb + " " + styles['orb-2']} />
        <div className={styles.orb + " " + styles['orb-3']} />

        <section ref={gateRef} className={styles['role-gate'] + " container"}>
          <header className={styles['role-hero']}>
            <h1 className="fade-up">Join the Movement ✨</h1>
            <p className="fade-up" style={{ animationDelay: "100ms" }}>
              Choose your role to get a tailored experience.
            </p>
          </header>

          <div className={`${styles['role-grid']} ${styles['two-col']}`}>
            {/* LEFT: Organiser */}
            <article
              className={`${styles['role-card']} ${styles.organiser} fade-up`}
              style={{ animationDelay: "200ms" }}
              onClick={goOrganiser}
            >
              <i className="bx bx-building-house role-icon"></i>
              <h2>I'm an Organiser</h2>
              <p>Create events, manage signups, and message volunteers.</p>
              <ul className="perks">
                <li><i className="bx bx-check"></i> Bulk invites</li>
                <li><i className="bx bx-check"></i> Attendance tools</li>
                <li><i className="bx bx-check"></i> Analytics overview</li>
              </ul>
              <button
                className={`${styles['role-btn']} ${styles.alt}`}
                onClick={(e) => { ripple(e); e.stopPropagation(); goOrganiser(); }}
              >
                Continue as Organiser
              </button>
            </article>

            {/* RIGHT: Volunteer */}
            <article
              className={`${styles['role-card']} ${styles.volunteer} fade-up`}
              style={{ animationDelay: "300ms" }}
              onClick={goVolunteer}
            >
              <i className="bx bx-user-check role-icon"></i>
              <h2>I'm a Volunteer</h2>
              <p>Discover causes, sign up fast, and track your impact.</p>
              <ul className="perks">
                <li><i className="bx bx-check"></i> Smart matching</li>
                <li><i className="bx bx-check"></i> Calendar sync</li>
                <li><i className="bx bx-check"></i> Impact logbook</li>
              </ul>
              <button
                className={styles['role-btn']}
                onClick={(e) => { ripple(e); e.stopPropagation(); goVolunteer(); }}
              >
                Continue as Volunteer
              </button>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}