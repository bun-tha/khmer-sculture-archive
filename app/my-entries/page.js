import { createClient } from "../../utils/supabase/server.js";
import { t, t2 } from "../../utils/i18n.js";
import { serverLang } from "../../utils/server-lang.js";
import authStyles from "../authStyles.js";

const styles = {
  row: {
    marginTop: 16,
    padding: "16px 20px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 10,
  },
  title: {
    fontFamily: "Georgia, 'Iowan Old Style', serif",
    fontSize: 20,
    fontWeight: 600,
    color: "#242426",
    textDecoration: "none",
  },
  titleKhmer: {
    fontSize: 16,
    color: "#4A4A46",
    margin: "4px 0 8px",
  },
  rowFooter: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  status: {
    fontSize: 13,
    color: "#5B7CAD",
    margin: 0,
  },
  editLink: {
    fontSize: 13,
    color: "#5B7CAD",
    textDecoration: "none",
  },
};

const STATUS_LABELS = {
  pending: t2("my.status.pending"),
  published: t2("my.status.published"),
  returned: t2("my.status.returned"),
};

// Logged-in users only: lists the user's own entries with their status, and
// a link to edit any of them (edits send the entry back to review).
export default async function MyEntriesPage() {
  const lang = await serverLang();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main style={authStyles.wrap}>
        <p style={authStyles.kicker}>{t("home.kicker", lang)}</p>
        <h1 style={authStyles.title}>{t("my.title", lang)}</h1>
        <p style={authStyles.description}>
          {t("my.needLoginPre", lang)}{" "}
          <a href="/login" style={authStyles.link}>{t("nav.login", lang)}</a>{" "}
          {t("my.needLoginPost", lang)}
        </p>
      </main>
    );
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  const myEntries = entries ?? [];

  return (
    <main style={authStyles.wrap}>
      <p style={authStyles.kicker}>{t("home.kicker", lang)}</p>
      <h1 style={authStyles.title}>{t("my.title", lang)}</h1>
      <p style={authStyles.description}>
        {t(
          myEntries.length === 1 ? "my.countOne" : "my.count",
          lang,
          { n: myEntries.length }
        )} — {user.email}
      </p>

      {myEntries.length === 0 ? (
        <p style={authStyles.description}>
          {t("my.empty", lang)}{" "}
          <a href="/contribute" style={authStyles.link}>{t("my.contributeLink", lang)}</a>.
        </p>
      ) : (
        myEntries.map((entry) => (
          <div key={entry.id} style={styles.row}>
            <a href={`/entries/${entry.id}`} style={styles.title}>
              {entry.title}
            </a>
            <p style={styles.titleKhmer}>{entry.title_km}</p>
            <div style={styles.rowFooter}>
              <p style={styles.status}>
                {STATUS_LABELS[entry.status] ?? entry.status}
              </p>
              <a href={`/entries/${entry.id}/edit`} style={styles.editLink}>
                {t("actions.edit", lang)}
              </a>
            </div>
          </div>
        ))
      )}
    </main>
  );
}