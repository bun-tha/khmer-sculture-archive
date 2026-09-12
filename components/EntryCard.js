const styles = {
  card: {
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },
  description: {
    fontSize: 14,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: "12px 0 0",
  },
  meta: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    marginTop: 16,
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
        <div>
          {entry.image && (
            <img
              src={entry.image}
              alt={entry.title}
              style={{ width: "100%", maxWidth: 240, borderRadius: 6, marginBottom: 10, display: "block" }}
            />
          )}
          <h3 style={styles.title}>{entry.title}</h3>
          <p style={styles.description}>{entry.description}</p>
          <p style={styles.meta}>{meta}</p>
        </div>
      </div>
    </article>
  );
}