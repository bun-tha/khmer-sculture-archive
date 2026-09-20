// Shared inline styles for the auth pages (/login, /signup).
// Colors and shapes mirror app/page.js so the site feels like one piece:
// light #FAFAF9 background, white cards, #DDDDDA borders, #5B7CAD accent.
const authStyles = {
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
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#6B6B68",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#5B7CAD",
    margin: "20px 0 0",
  },
  input: {
    width: "100%",
    marginTop: 2,
    padding: "12px 16px",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 8,
    color: "#242426",
  },
  button: {
    width: "100%",
    marginTop: 24,
    padding: "14px 16px",
    fontSize: 16,
    fontWeight: 600,
    color: "#FFFFFF",
    backgroundColor: "#5B7CAD",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  notice: {
    fontSize: 15,
    color: "#6B6B68",
    margin: "24px 0 0",
  },
  footer: {
    marginTop: 48,
    fontSize: 14,
    color: "#242426",
  },
  link: {
    color: "#5B7CAD",
  },
};

export default authStyles;