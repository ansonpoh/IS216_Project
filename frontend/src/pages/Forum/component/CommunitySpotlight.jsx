import React from "react";
import styles from "../../../styles/Community.module.css";

/**
 * CommunitySpotlight
 * props:
 *  - slides: array of { image: string, caption?: string, alt?: string, author?: string }
 *  - interval: number (ms) carousel auto-advance interval (default 4000)
 */
export default function CommunitySpotlight({ slides = [], interval = 4000 }) {
  const id = "communityCarousel-" + Math.random().toString(36).slice(2, 9);

  return (
    <div
      id={id}
      className={`${styles['carousel-wrapper']} carousel slide`}
      data-bs-ride="carousel"
      data-bs-interval={interval}
    >
      {/* Carousel indicators */}
            <div className={`${styles['carousel-inner']} carousel-indicators`}>
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Carousel slides */}
            <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""} ${styles['carousel-item']}`}
          >
            <img
              src={slide.image}
              alt={slide.alt || `Slide ${index + 1}`}
              className="d-block w-100"
            />
            {slide.caption && (
              <div className={`${styles['carousel-caption']} carousel-caption d-none d-md-block`}>
                <h5>{slide.caption}</h5>
                {slide.author && <p>By {slide.author}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Navigation controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}