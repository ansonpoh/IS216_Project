// src/components/component/FeaturedCard.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable card for both "featured" and "discussion" items.
 *
 * Props:
 *  - id
 *  - image (url) optional
 *  - title (string)
 *  - excerpt (string)  // body snippet
 *  - author (string)
 *  - timeAgo (string)
 *  - likes (number)
 *  - comments (number)
 *  - to (string) optional override link (defaults to `/community/${id}`)
 */
export default function FeaturedCard({
  id,
  image = null,
  title = "Untitled",
  excerpt = "",
  author = "Someone",
  timeAgo = "",
  likes = 0,
  comments = 0,
  to,
}) {
  const href = to || (id ? `/community/${id}` : "#");

  return (
    <article className="card mb-3 discussion-card">
      {image && (
        <div className="card-img-top-wrapper">
          <img
            src={image}
            alt={title}
            className="card-img-top"
            style={{ width: "100%", height: 160, objectFit: "cover" }}
          />
        </div>
      )}

      <div className="card-body">
        <h5 className="card-title mb-1">
          <Link to={href} className="stretched-link text-dark text-decoration-none">
            {title}
          </Link>
        </h5>

        {excerpt && <p className="card-text text-muted small mb-2">{excerpt}</p>}

        <div className="d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            {author} {timeAgo ? <>· {timeAgo}</> : null}
          </div>

          <div className="text-muted small">
            <span className="me-3">👍 {likes ?? 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
