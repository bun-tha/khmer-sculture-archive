// Shared inline styles for the auth pages (/login, /signup).
// All colors are design tokens from app/globals.css.
const authStyles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "var(--moss)",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "var(--mute)",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "var(--surf)",
    border: "1px solid var(--line)",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "var(--moss)",
    margin: "20px 0 0",
  },
  input: {
    width: "100%",
    marginTop: 2,
    padding: "12px 16px",
    fontSize: 16,
    backgroundColor: "var(--surf)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    color: "var(--ink)",
  },
  button: {
    width: "100%",
    marginTop: 24,
    padding: "14px 16px",
    fontSize: 16,
    fontWeight: 600,
    color: "var(--moss-ink)",
    backgroundColor: "var(--moss)",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  notice: {
    fontSize: 15,
    color: "var(--mute)",
    margin: "24px 0 0",
  },
  footer: {
    marginTop: 48,
    fontSize: 14,
    color: "var(--ink)",
  },
  link: {
    color: "var(--moss)",
  },
};

export default authStyles;