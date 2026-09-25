   "use client";

import { useState, useEffect } from "react";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import { createClient } from "../utils/supabase/client.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#5B7CAD",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#6B6B68",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#5B7CAD",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#5B7CAD",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #DDDDDA",
    fontSize: 13,
    color: "#6B6B68",
  },
};
function filterEntries(entries, query) {
  const q = query.toLowerCase();
  return entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      (entry.titleKhmer && entry.titleKhmer.includes(q))
  );
}
// Map Supabase columns to the shapes EntryCard and the search expect.
function mapRow(row) {
  return {
    ...row,
    titleKhmer: row.title_km,
    era: row.period,
    image: row.photo_url,
  };
}
export default function Home() {
  const [query, setQuery] = useState("");
  // status is "loading" while the first fetch is in flight, "error" if it
  // failed, and "ready" once the entries have arrived from Supabase.
  const [status, setStatus] = useState("loading");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("entries")
      .select("*")
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

  const visibleEntries = filterEntries(entries, query);

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the archive..."
        style={{
          width: "100%",
          marginTop: 48,
          padding: "12px 16px",
          fontSize: 16,
          backgroundColor: "#FFFFFF",
          border: "1px solid #DDDDDA",
          borderRadius: 8,
          color: "#242426",
        }}
      />

      {status === "loading" ? (
        <p style={styles.count}>Loading the archive…</p>
      ) : status === "error" ? (
        <p style={styles.description}>
          The archive is unreachable right now — try again in a moment.
        </p>
      ) : (
        <>
          <p style={styles.count}>
            showing {visibleEntries.length} of {entries.length} entries
          </p>
          {visibleEntries.length === 0 ? (
            <p style={styles.description}>
              Nothing carved from that search yet — try a shorter word, or
              clear the box to see everything.
            </p>
          ) : (
            visibleEntries.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} index={i} />
            ))
          )}
        </>
      )}

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
