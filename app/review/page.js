import ReviewQueueItem from "../../components/ReviewQueueItem.js";
import { createClient } from "../../utils/supabase/server.js";
import { t } from "../../utils/i18n.js";
import { serverLang } from "../../utils/server-lang.js";

const styles = {
  wrap: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "0 clamp(1rem, 4vw, 3rem)",
    paddingBottom: 80,
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
    fontSize: "var(--text-2xl)",
    lineHeight: 1.12,
    color: "var(--ink)",
    margin: "16px 0 12px",
  },
  muted: {
    color: "var(--mute)",
    fontSize: "var(--text-base)",
    lineHeight: 1.6,
  },
};

// Server gates this page: a non-reviewer sees a short message and no list.
export default async function ReviewPage() {
  const lang = await serverLang();
  const supabase = await createClient();

  const { data: isReviewer } = await supabase.rpc("is_reviewer");
  if (isReviewer !== true) {
    return (
      <main style={styles.wrap}>
        <p style={styles.kicker}>{t("home.kicker", lang)}</p>
        <h1 style={styles.title}>{t("review.title", lang)}</h1>
        <p style={styles.muted}>{t("review.notReviewer", lang)}</p>
      </main>
    );
  }

  const { data: pending, error } = await supabase
    .from("entries")
    .select("id, title, title_km, period, material, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>{t("home.kicker", lang)}</p>
      <h1 style={styles.title}>{t("review.title", lang)}</h1>
      {error ? (
        <p style={styles.muted}>{t("review.error", lang)}</p>
      ) : !pending || pending.length === 0 ? (
        <p style={styles.muted}>{t("review.empty", lang)}</p>
      ) : (
        pending.map((entry) => (
          <ReviewQueueItem key={entry.id} entry={entry} lang={lang} />
        ))
      )}
    </main>
  );
}