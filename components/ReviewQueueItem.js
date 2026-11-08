"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "../utils/i18n.js";
import { createClient } from "../utils/supabase/client.js";

const styles = {
  item: {
    padding: "18px 0",
    borderBottom: "1px solid var(--line)",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "var(--text-xl)",
    color: "var(--ink)",
    margin: 0,
  },
  titleKm: {
    color: "var(--mute)",
    fontSize: "var(--text-base)",
    margin: "4px 0 8px",
  },
  meta: {
    color: "var(--mute)",
    fontSize: "var(--text-sm)",
    margin: "0 0 12px",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  actPublish: {
    minHeight: 44,
    padding: "8px 16px",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--moss-ink)",
    backgroundColor: "var(--moss)",
    border: "none",
    borderRadius: "var(--radius)",
    cursor: "pointer",
  },
  actReturn: {
    minHeight: 44,
    padding: "8px 16px",
    fontFamily: "inherit",
    fontSize: 14,
    color: "var(--ink)",
    backgroundColor: "transparent",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
    cursor: "pointer",
  },
  error: {
    margin: "10px 0 0",
    color: "var(--danger)",
    fontSize: 14,
  },
};

// One pending entry with the reviewer's two decisions. The real gate is the
// database function review_entry: it refuses non-reviewers and anything that
// is no longer pending. Success is only true when the RPC returns exactly
// true — a plain "no error" is not enough, because a refused call returns
// false without an error.
export default function ReviewQueueItem({ entry, lang }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function review(decision) {
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("review_entry", {
        entry_id: entry.id,
        decision,
      });
      if (rpcError || data !== true) {
        setError(t("review.fail", lang));
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError(t("review.fail", lang));
      setBusy(false);
    }
  }

  return (
    <div style={styles.item}>
      <p style={styles.title}>{entry.title}</p>
      {entry.title_km && <p style={styles.titleKm}>{entry.title_km}</p>}
      <p style={styles.meta}>
        {[entry.period, entry.material].filter(Boolean).join(" · ")}
      </p>
      <div style={styles.actions}>
        <button
          type="button"
          disabled={busy}
          onClick={() => review("published")}
          style={styles.actPublish}
        >
          {t("review.publish", lang)}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => review("returned")}
          style={styles.actReturn}
        >
          {t("review.return", lang)}
        </button>
      </div>
      {error && <p role="alert" style={styles.error}>{error}</p>}
    </div>
  );
}