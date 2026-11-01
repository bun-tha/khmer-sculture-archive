"use client";

// EN / ខ្មែរ switcher. Writes the "lang" cookie and reloads, so the server
// (html lang, server actions, rendered labels) picks up the change.
export default function LanguageToggle({ lang }) {
  function choose(nextLang) {
    document.cookie = `lang=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => choose("en")}
        style={toggleStyle(lang === "en")}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={lang === "km"}
        onClick={() => choose("km")}
        style={toggleStyle(lang === "km")}
      >
        ខ្មែរ
      </button>
    </div>
  );
}

function toggleStyle(active) {
  return {
    fontFamily: "inherit",
    fontSize: 14,
    padding: "6px 10px",
    minHeight: 44,
    cursor: "pointer",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
    background: active ? "var(--ink)" : "transparent",
    color: active ? "var(--bg)" : "var(--ink)",
  };
}