import { createClient } from "../../utils/supabase/server.js";
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
  pending: "Waiting for review / កំពុងរង់ចាំការត្រួតពិនិត្យ",
  published: "Published / បានផ្សព្វផ្សាយ",
  returned: "Returned for changes / ត្រឡប់មកវិញដើម្បីកែសម្រួល",
};

// Logged-in users only: lists the user's own entries with their status, and
// a link to edit any of them (edits send the entry back to review).
export default async function MyEntriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main style={authStyles.wrap}>
        <p style={authStyles.kicker}>KHMER LIVING ARCHIVE</p>
        <h1 style={authStyles.title}>My entries</h1>
        <p style={authStyles.description}>
          You need to <a href="/login" style={authStyles.link}>log in</a> to
          see your entries.
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
      <p style={authStyles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={authStyles.title}>My entries</h1>
      <p style={authStyles.description}>
        {myEntries.length} {myEntries.length === 1 ? "entry" : "entries"} —{" "}
        {user.email}
      </p>

      {myEntries.length === 0 ? (
        <p style={authStyles.description}>
          You have not added anything yet.{" "}
          <a href="/contribute" style={authStyles.link}>Contribute</a>.
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
                Edit
              </a>
            </div>
          </div>
        ))
      )}
    </main>
  );
}