// src/components/component/FeaturedCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/Community.module.css";

export default function FeaturedCard({
  feedback_id,
  user_id,

  subject = "",
  body = "",
  created_at = "",
  image = null,
  likes = 0,
  liked_by_user = "",
  onClick,
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (feedback_id) {
      console.log("Navigating to:", `/community/${feedback_id}`);
      navigate(`/community/${feedback_id}`);
    }
  };

  return (
    <div
      className={`card h-100 shadow-sm ${styles["featured-card"]}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
 {image && (
        <img
          src={image}
          className={styles['card-image']}
          alt={subject}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <div className={styles['card-body']}>
        <h5 className={styles['card-title']}>{subject}</h5>
        <p className={styles['card-text']}>
          {body.substring(0, 100)}...
        </p>
      </div>
      <div className={`card-footer bg-transparent d-flex justify-content-between align-items-center`}>
        <small className="text-muted">
          {new Date(created_at).toLocaleDateString()}
        </small>
        <div className="d-flex align-items-center">
          {/* <i className="bi bi-heart me-1"></i> */}
          <span aria-hidden="true" className="me-1" style={{ fontSize: '1rem' }}>💖</span>
          <small>{likes}</small>
        </div>
      </div>
    </div>
  );
}