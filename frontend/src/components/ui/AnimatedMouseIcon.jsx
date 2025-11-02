import React from "react";
import styles from "../../styles/Scroll.module.css";
 
export default function ScrollMouse({
  size = 36,
  stroke = "rgba(0, 0, 0, 0.85)",
  fill = "#000000ff",
  bottom = 24,
  className = "",
  z = undefined,
}) {
  const style = { bottom: `${bottom}px` };
  if (typeof z !== "undefined") style.zIndex = z;

  return (
    <div
      className={`${styles.scrollMouse} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <span
        className={styles.body}
        style={{
          "--size": `${size}px`,
          "--stroke": stroke,
          "--fill": fill,
        }}
      >
        <span className={styles.wheel} />
      </span>
    </div>
  );
}
