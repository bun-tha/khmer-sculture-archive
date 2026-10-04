import { notFound } from "next/navigation";
import EntryCard from "../../../components/EntryCard.js";
import { createClient } from "../../../utils/supabase/server.js";

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
  back: {
    display: "inline-block",
    margin: "24px 0 8px",
    fontSize: 14,
    color: "#5B7CAD",
    textDecoration: "none",
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

  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !entry) {
    notFound();
  }

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <a href="/" style={styles.back}>
        ← Back to the archive
      </a>
      <EntryCard entry={mapRow(entry)} index={0} />
    </main>
  );
}