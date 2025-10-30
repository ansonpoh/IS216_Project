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
    <div className="card mb-3 h-100">
      <div className="card-body d-flex flex-column">
        <h6 className="mb-2 text-center fs-2">Community Spotlight</h6>
        <p className="small text-muted text-center mb-3">
          Share the joy! Highlight memorable moments from your volunteering experiences.
        </p>
        <div className="mb-3">
          <div
            id={id}
            className="carousel slide"
            data-bs-ride={slides.length > 1 ? "carousel" : undefined}
            data-bs-interval={interval}
          >
            <div className="carousel-inner">
              {slides.length === 0 && (
                <div className="carousel-item active">
                  <div className="d-flex align-items-center justify-content-center" style={{ height: "300px", background: "#f0f0f0" }}>
                    <small className="text-muted">No spotlight images yet</small>
                  </div>
                </div>
              )}
              {slides.map((s, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                  <img
                    src={s.image}
                    className="d-block w-100"
                    alt={s.alt || `slide-${i + 1}`}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  {s.caption && (
                    <div className="carousel-caption d-none d-md-block">
                      <small>{s.caption}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {slides.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

