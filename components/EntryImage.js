"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Zoomable entry photo. Click (or Enter/Space on the focused button) toggles
// between 1x and 2x. The transition is disabled for reduced-motion users. The
// button carries an aria-label, so the zoom works from the keyboard.
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
        aspectRatio: "4 / 5",
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
          position: "absolute",
          inset: 0,
          transform: zoomed ? "scale(2)" : "scale(1)",
          transformOrigin: "center center",
          transition: reduced ? "none" : "transform 0.25s ease-in-out",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 880px) 40vw, 92vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </button>
  );
}