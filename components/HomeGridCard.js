import Image from "next/image";

const styles = {
  cardLink: {
    display: "block",
    color: "inherit",
    textDecoration: "none",
  },
  thumb: {
    position: "relative",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    borderRadius: "var(--radius)",
    background: "linear-gradient(160deg, var(--stone-a), var(--stone-b))",
  },
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: "var(--text-xl)",
    fontWeight: 600,
    margin: "12px 0 2px",
    color: "var(--ink)",
  },
  small: {
    display: "block",
    color: "var(--mute)",
    fontSize: "var(--text-sm)",
  },
};

// One cell of the home grid: photo thumb, linked title, Khmer title, and
// material. Used only on the home page; the entry detail keeps EntryCard.
export default function HomeGridCard({ entry }) {
  return (
    <article>
      <a href={`/entries/${entry.id}`} style={styles.cardLink}>
        <div style={styles.thumb}>
          {entry.image && (
            <Image
              src={entry.image}
              alt={entry.title}
              fill
              sizes="(min-width: 720px) 25vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <h3 style={styles.title}>{entry.title}</h3>
        {entry.titleKhmer && (
          <small style={styles.small}>{entry.titleKhmer}</small>
        )}
        <small style={styles.small}>{entry.material}</small>
      </a>
    </article>
  );
}