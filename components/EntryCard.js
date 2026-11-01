import { t } from "../utils/i18n.js";

const styles = {
  card: {
    padding: "14px 0",
    borderBottom: "0.5px solid var(--line)",
  },
  row: {
    display: "flex",
    gap: 14,
  },
  number: {
    fontFamily: "Georgia, 'Iowan Old Style', serif",
    fontSize: 13,
    color: "var(--moss)",
    minWidth: 20,
  },
  imageWrap: {
    flexShrink: 0,
    width: 120,
  },
  image: {
    width: "100%",
    display: "block",
    borderRadius: 6,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: "Georgia, 'Iowan Old Style', serif",
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "var(--ink)",
    margin: "0 0 4px",
  },
  titleLink: {
    color: "var(--ink)",
    textDecoration: "none",
  },
  titleKhmer: {
    fontFamily: "Georgia, 'Iowan Old Style', serif",
    fontSize: 20,
    color: "var(--mute)",
    margin: "0 0 8px",
  },
  description: {
    fontSize: 14,
    color: "var(--mute)",
    lineHeight: 1.6,
    margin: "0 0 8px",
  },
  meta: {
    fontSize: 12,
    color: "var(--mute)",
    margin: 0,
  },
  credit: {
    fontSize: 12,
    color: "var(--mute)",
    fontStyle: "italic",
    margin: "8px 0 0",
  },
};

export default function EntryCard({ entry, index, lang = "en" }) {
  const meta = [entry.location, entry.material, entry.era]
    .filter(Boolean)
    .join(" · ");

  return (
    <article style={styles.card}>
      <div style={styles.row}>
        <span style={styles.number}>{String(index + 1).padStart(2, "0")}</span>
        {entry.image && (
          <div style={styles.imageWrap}>
            <img src={entry.image} alt={entry.title} style={styles.image} />
          </div>
        )}
        <div style={styles.content}>
          <h3 style={styles.title}>
            <a href={`/entries/${entry.id}`} style={styles.titleLink}>
              {entry.title}
            </a>
          </h3>
          {entry.titleKhmer && (
            <p style={styles.titleKhmer}>{entry.titleKhmer}</p>
          )}
          <p style={styles.description}>{entry.description}</p>
          <p style={styles.meta}>{meta}</p>
          {entry.contributor_name && (
            <p style={styles.credit}>
              {t("entry.contributedBy", lang, { name: entry.contributor_name })}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}