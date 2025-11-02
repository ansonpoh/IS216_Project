import React, { useState, useEffect } from "react";
import styles from "../../../styles/Community.module.css";

/**
 * CommunitySpotlight
 * A simple image carousel that uses the module CSS in `Community.module.css`.
 * Props:
 *  - slides: [{ image, caption, alt }]
 *  - interval: number ms auto-advance
 */
export default function CommunitySpotlight({ slides = [], interval = 4000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return undefined;
    const t = setInterval(() => setCurrent((s) => (s + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [slides, interval]);

  if (!slides || slides.length === 0) return null;

  const next = () => setCurrent((s) => (s + 1) % slides.length);
  const prev = () => setCurrent((s) => (s - 1 + slides.length) % slides.length);
  const goTo = (i) => setCurrent(i);

  return (
    <div className={styles["carousel-wrapper"]}>
      <div
        className={styles["carousel-inner"]}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className={styles["carousel-item"]}>
            <img src={slide.image} alt={slide.alt || slide.caption || `Slide ${i + 1}`} />
            {slide.caption && (
              <div className={styles["carousel-caption"]}>
                <h5>{slide.caption}</h5>
                {slide.author && <p>By {slide.author}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className={styles["carousel-control-prev"]} onClick={prev} aria-label="Previous slide">
        <span className={styles["carousel-control-prev-icon"]} aria-hidden="true" />
      </button>
      <button className={styles["carousel-control-next"]} onClick={next} aria-label="Next slide">
        <span className={styles["carousel-control-next-icon"]} aria-hidden="true" />
      </button>

      {/* Indicators */}
      <div className={styles["carousel-indicators"]}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === current ? styles.active : undefined}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}