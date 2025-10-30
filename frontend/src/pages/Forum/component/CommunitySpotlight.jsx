import React from "react";

/**
 * CommunitySpotlight
 * props:
 *  - slides: array of { image: string, caption?: string, alt?: string }
 *  - interval: number (ms) carousel auto-advance interval (default 4000)
 */
export default function CommunitySpotlight({ slides = [], interval = 4000 }) {

  const id = "communityCarousel-" + Math.random().toString(36).slice(2, 9);

  return (
    <div id="communitySpotlight" className="carousel slide" data-bs-ride="carousel">
      {/* Carousel indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#communitySpotlight"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Carousel slides */}
      <div className="carousel-inner rounded-4 overflow-hidden">
        {slides.map((slide, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img
              src={slide.image}
              className="d-block w-100"
              style={{ height: "400px", objectFit: "cover" }}
            />
            {/* Caption overlay */}
            <div className="carousel-caption d-none d-md-block" 
                 style={{ 
                   background: 'rgba(0,0,0,0.5)', 
                   borderRadius: '8px',
                   padding: '15px'
                 }}>
              <h5>{slide.caption}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#communitySpotlight" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#communitySpotlight" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

