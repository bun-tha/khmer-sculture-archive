"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import collection from "../collection.config.js";
import { createClient } from "../utils/supabase/client.js";
import { t } from "../utils/i18n.js";
import HomeGridCard from "./HomeGridCard.js";

const styles = {
  wrap: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 clamp(1rem, 4vw, 3rem)",
  },
  kicker: {
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    color: "var(--moss)",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    margin: 0,
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontWeight: 400,
    fontSize: "var(--text-hero)",
    letterSpacing: "-0.01em",
    lineHeight: 1.12,
    color: "var(--ink)",
    margin: "18px 0 12px",
  },
  intro: {
    maxWidth: "34em",
    color: "var(--mute)",
    fontSize: "var(--text-lg)",
    lineHeight: 1.6,
    margin: 0,
  },
  creditLine: {
    margin: "14px 0 0",
    color: "var(--mute)",
    fontSize: "var(--text-sm)",
    lineHeight: 1.5,
  },
  arch: {
    position: "relative",
    aspectRatio: "4 / 5",
    borderRadius: "999px 999px 4px 4px",
    overflow: "hidden",
    background: "linear-gradient(160deg, var(--stone-a), var(--stone-b))",
    border: "1px solid var(--line)",
  },
  search: {
    width: "100%",
    marginTop: 16,
    padding: "12px 16px",
    fontSize: 16,
    color: "var(--ink)",
    backgroundColor: "var(--surf)",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
  },
  count: {
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    color: "var(--moss)",
    marginTop: 32,
  },
  error: {
    fontSize: "var(--text-base)",
    color: "var(--mute)",
    marginTop: 32,
  },
  chips: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    margin: "16px 0 24px",
  },
  chip: {
    fontFamily: "inherit",
    fontSize: 14,
    padding: "8px 14px",
    minHeight: "var(--control-min-height)",
    cursor: "pointer",
    color: "var(--ink)",
    background: "transparent",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
  },
  chipActive: {
    background: "var(--ink)",
    color: "var(--bg)",
    borderColor: "var(--ink)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "1.5rem",
  },
  empty: {
    padding: "2rem",
    border: "1px dashed var(--line)",
    color: "var(--mute)",
  },
  skeletonThumb: {
    aspectRatio: "1 / 1",
    borderRadius: "var(--radius)",
  },
  skeletonText: {
    height: 16,
    marginTop: 12,
    borderRadius: "var(--radius)",
  },
  skeletonSmall: {
    height: 12,
    width: "60%",
    marginTop: 8,
    borderRadius: "var(--radius)",
  },
  retryLink: {
    display: "inline-block",
    marginTop: 12,
    color: "var(--moss)",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid var(--line)",
    fontSize: 13,
    color: "var(--mute)",
  },
};

function matchesQuery(entry, q) {
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    (entry.titleKhmer && entry.titleKhmer.includes(q))
  );
}

// Maps Supabase columns to the shapes HomeGridCard and the search expect.
function mapRow(row) {
  return {
    ...row,
    titleKhmer: row.title_km,
    era: row.period,
    image: row.photo_url,
  };
}

// Client half of the home page. Lang comes from the server wrapper
// (app/page.js) and is passed to every t() call; rendering never depends on
// client-side state.
export default function HomeClient({ lang }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("loading");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("entries")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setStatus("error");
          return;
        }
        setEntries((data ?? []).map(mapRow));
        setStatus("ready");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const materials = [
    "all",
    ...new Set(entries.map((e) => e.material).filter(Boolean)),
  ];
  const q = query.toLowerCase();
  const visibleEntries = entries.filter(
    (entry) =>
      (filter === "all" || entry.material === filter) &&
      matchesQuery(entry, q)
  );
  const featured = entries.find((entry) => entry.image);

  return (
    <main style={styles.wrap}>
      <section className="hero">
        <div>
          <p style={styles.kicker}>{t("home.kicker", lang)}</p>
          <h1 style={styles.title}>{collection.name}</h1>
          <p style={styles.intro}>{collection.description}</p>
          <p style={styles.creditLine}>
            <strong>{t("home.curatedBy", lang)}</strong> {collection.curator}
          </p>
          <p style={styles.creditLine}>
            <strong>{t("home.source", lang)}</strong> {collection.source}
          </p>
        </div>
        <div className="hero-media">
          <div style={styles.arch}>
            {featured && (
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(min-width: 768px) 40vw, 92vw"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      </section>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("home.searchPlaceholder", lang)}
        style={styles.search}
      />

      {status === "loading" ? (
        <div style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} aria-hidden>
              <div className="skeleton" style={styles.skeletonThumb} />
              <div className="skeleton" style={styles.skeletonText} />
              <div className="skeleton" style={styles.skeletonSmall} />
            </div>
          ))}
        </div>
      ) : status === "error" ? (
        <div style={styles.empty}>
          <p style={styles.error}>{t("home.error", lang)}</p>
          <a href="/" style={styles.retryLink}>{t("common.retry", lang)}</a>
        </div>
      ) : (
        <>
          <p style={styles.count}>
            {t("home.count", lang, {
              shown: visibleEntries.length,
              total: entries.length,
            })}
          </p>

          <div style={styles.chips}>
            {materials.map((material) => {
              const active = filter === material;
              return (
                <button
                  key={material}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(material)}
                  style={
                    active
                      ? { ...styles.chip, ...styles.chipActive }
                      : styles.chip
                  }
                >
                  {material === "all" ? t("home.all", lang) : material}
                </button>
              );
            })}
          </div>

          {entries.length === 0 ? (
            <div style={styles.empty}>
              <p>{t("home.emptyInvite", lang)}</p>
              <a href="/contribute" style={styles.retryLink}>
                {t("my.contributeLink", lang)}
              </a>
            </div>
          ) : visibleEntries.length === 0 ? (
            <div style={styles.empty}>{t("home.emptySearch", lang)}</div>
          ) : (
            <div style={styles.grid}>
              {visibleEntries.map((entry) => (
                <HomeGridCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </>
      )}

      <footer style={styles.footer}>{t("home.footer", lang)}</footer>
    </main>
  );
}