const styles = {
  card: {
    padding: "14px 0",
    borderBottom: "0.5px solid #DDDDDA",
  },
  row: {
    display: "flex",
    gap: 14,
  },
  number: {
    fontFamily: "Georgia, 'Iowan Old Style', serif",
    fontSize: 13,
    color: "#5B7CAD",
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
    fontSize: 17,
    fontWeight: 500,
    color: "#242426",
    margin: "0 0 6px",
  },
  titleKhmer: {
    fontSize: 14,
    color: "#7C8894",
    margin: "-2px 0 6px",
  },
  description: {
    fontSize: 14,
    color: "#6B6B68",
    lineHeight: 1.6,
    margin: "0 0 8px",
  },
  meta: {
    fontSize: 12,
    color: "#7C8894",
    margin: 0,
  },
};

export default function EntryCard({ entry, index }) {
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
          <h3 style={styles.title}>{entry.title}</h3>
          {entry.titleKhmer && (
            <p style={styles.titleKhmer}>{entry.titleKhmer}</p>
          )}
          <p style={styles.description}>{entry.description}</p>
          <p style={styles.meta}>{meta}</p>
        </div>
      </div>
    </article>
  );
}