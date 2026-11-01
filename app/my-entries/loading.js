// Shown while the /my-entries server page is loading its query. Stone-
// gradient skeleton rows; the pulse animation is disabled via globals.css
// when the visitor prefers reduced motion.
export default function Loading() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ marginTop: 16, padding: "16px 20px" }}>
          <div
            className="skeleton"
            style={{ height: 20, width: "50%", marginBottom: 8, borderRadius: "var(--radius)" }}
          />
          <div
            className="skeleton"
            style={{ height: 14, width: "80%", borderRadius: "var(--radius)" }}
          />
        </div>
      ))}
    </main>
  );
}