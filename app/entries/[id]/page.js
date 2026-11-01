import EntryImage from "../../../components/EntryImage.js";
import EntryActions from "../../../components/EntryActions.js";
import HomeGridCard from "../../../components/HomeGridCard.js";
import { createClient } from "../../../utils/supabase/server.js";
import { t } from "../../../utils/i18n.js";
import { serverLang } from "../../../utils/server-lang.js";

const styles = {
  wrap: {
    maxWidth: 1180,
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
  back: {
    display: "inline-block",
    margin: "24px 0 8px",
    fontSize: 14,
    color: "var(--moss)",
    textDecoration: "none",
    fontWeight: 600,
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontWeight: 400,
    fontSize: "var(--text-2xl)",
    lineHeight: 1.12,
    color: "var(--ink)",
    margin: 0,
  },
  titleKm: {
    color: "var(--mute)",
    fontSize: "var(--text-lg)",
    margin: "6px 0 0",
  },
  credit: {
    color: "var(--mute)",
    fontSize: "var(--text-sm)",
    fontStyle: "italic",
    margin: "12px 0 0",
  },
  metaList: {
    margin: "24px 0 0",
    display: "grid",
    gap: 12,
  },
  metaLabel: {
    fontFamily: "var(--font-sans)",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--moss)",
    margin: 0,
  },
  metaValue: {
    margin: "2px 0 0",
    color: "var(--ink)",
    fontSize: "var(--text-base)",
  },
  sectionLabel: {
    fontFamily: "var(--font-sans)",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--moss)",
    margin: "40px 0 8px",
  },
  storyText: {
    color: "var(--ink)",
    lineHeight: 1.8,
    maxWidth: "65ch",
    margin: 0,
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "1.5rem",
  },
  box: {
    marginTop: 24,
    padding: "2rem",
    border: "1px dashed var(--line)",
    color: "var(--mute)",
  },
};

function mapRow(row) {
  return {
    ...row,
    titleKhmer: row.title_km,
    era: row.period,
    image: row.photo_url,
  };
}

export default async function EntryPage({ params }) {
  const { id } = await params;
  const lang = await serverLang();
  const supabase = await createClient();

  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Three cases kept separate: a query error must never look like "not found".
  if (error) {
    return (
      <main style={styles.wrap}>
        <p style={styles.kicker}>{t("home.kicker", lang)}</p>
        <a href="/" style={styles.back}>{t("entry.back", lang)}</a>
        <div style={styles.box}>
          <p>{t("entry.error", lang)}</p>
          <a href={`/entries/${id}`} style={styles.back}>
            {t("common.retry", lang)}
          </a>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main style={styles.wrap}>
        <p style={styles.kicker}>{t("home.kicker", lang)}</p>
        <a href="/" style={styles.back}>{t("entry.back", lang)}</a>
        <div style={styles.box}>
          <p>{t("entry.notFound", lang)}</p>
          <a href="/" style={styles.back}>{t("entry.back", lang)}</a>
        </div>
      </main>
    );
  }

  // Edit and Delete are shown only to the logged-in owner of the entry.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canEdit = user !== null && entry.owner === user.id;

  const { data: relatedRows } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "published")
    .neq("id", id)
    .limit(20);
  const related = (relatedRows ?? [])
    .map((row) => ({
      row,
      score:
        (row.material === entry.material ? 1 : 0) +
        (row.period === entry.period ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => mapRow(item.row));

  // Metadata list using real schema fields; skip anything empty.
  const meta = [
    { label: t("field.period", lang), value: entry.period },
    { label: t("field.material", lang), value: entry.material },
    { label: t("field.location", lang), value: entry.location },
    { label: t("field.source", lang), value: entry.source },
  ].filter((row) => row.value && String(row.value).trim() !== "");

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>{t("home.kicker", lang)}</p>
      <a href="/" style={styles.back}>{t("entry.back", lang)}</a>

      <div className="entry-layout">
        <div>
          {entry.photo_url && (
            <EntryImage
              src={entry.photo_url}
              alt={entry.title}
              zoomInLabel={t("entry.zoomIn", lang)}
              zoomOutLabel={t("entry.zoomOut", lang)}
            />
          )}
        </div>
        <div>
          <h1 style={styles.title}>{entry.title}</h1>
          {entry.title_km && <p style={styles.titleKm}>{entry.title_km}</p>}
          {entry.contributor_name && (
            <p style={styles.credit}>
              {t("entry.contributedBy", lang, { name: entry.contributor_name })}
            </p>
          )}
          <dl style={styles.metaList}>
            {meta.map((row) => (
              <div key={row.label}>
                <dt style={styles.metaLabel}>{row.label}</dt>
                <dd style={styles.metaValue}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <h2 style={styles.sectionLabel}>{t("entry.story", lang)}</h2>
      <p style={styles.storyText}>{entry.description}</p>

      {related.length > 0 && (
        <section>
          <h2 style={styles.sectionLabel}>{t("entry.related", lang)}</h2>
          <div style={styles.relatedGrid}>
            {related.map((item) => (
              <HomeGridCard key={item.id} entry={item} />
            ))}
          </div>
        </section>
      )}

      {canEdit && <EntryActions id={entry.id} lang={lang} />}
    </main>
  );
}