"use client";

import { useEffect, useState } from "react";

// Natural-aspect entry photo inside a focusable zoom button. It keeps the
// photo's own proportions (width 100%, height auto) instead of cropping it
// into a fixed box. Click (or Enter/Space on the focused button) toggles
// ~2x zoom; the transition is off for reduced-motion users.
export default function EntryImage({ src, alt, zoomInLabel, zoomOutLabel }) {
  const [zoomed, setZoomed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMediaChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onMediaChange);
    return () => mq.removeEventListener?.("change", onMediaChange);
  }, []);

  function toggle() {
    setZoomed((current) => !current);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={zoomed ? zoomOutLabel : zoomInLabel}
      aria-pressed={zoomed}
      style={{
        display: "block",
        position: "relative",
        width: "100%",
        overflow: "hidden",
        padding: 0,
        margin: 0,
        cursor: zoomed ? "zoom-out" : "zoom-in",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        background: "linear-gradient(160deg, var(--stone-a), var(--stone-b))",
      }}
    >
      <div
        style={{
          width: "100%",
          lineHeight: 0,
          transform: zoomed ? "scale(2)" : "scale(1)",
          transformOrigin: "center center",
          transition: reduced ? "none" : "transform 0.25s ease-in-out",
        }}
      >
        {/* Height auto + width 100% keeps the photo's true aspect ratio. */}
        <img
          src={src}
          alt={alt}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
    </button>
  );
}