// component/FeaturedCard.jsx
import React from "react";
// import a default image if you want:
// import defaultImg from "../../assets/default-featured.png";

export default function FeaturedCard({
  id,
  image = null,
  title = "Untitled",
  excerpt = "",
  author = "Unknown",
  likes = 0,
  comments = 0,
}) {
  // If you want to use the provided image at /mnt/data during dev preview,
  // import it into your project public or src/assets and pass its path in `image`.
  // Example: <FeaturedCard image="/assets/548abcb1-0c72-48fd-8e44-e0fcabff7db5.png" ... />

  return (
    <div className="card h-100">
      {image ? (
        <img src={image} className="card-img-top" alt={title} style={{ objectFit: "cover", height: 150 }} />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center bg-secondary text-white"
          style={{ height: 150 }}
        >
          <span className="small">Image</span>
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{title}</h6>
        <p className="card-text small text-muted" style={{ flexGrow: 1 }}>{excerpt}</p>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">by {author}</small>

          <div className="small text-muted">
            <span className="me-2">👍 {likes}</span>
            <span>💬 {comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
