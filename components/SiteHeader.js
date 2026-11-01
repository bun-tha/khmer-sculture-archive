import collection from "../collection.config.js";
import { createClient } from "../utils/supabase/server.js";
import { logout } from "../app/logout/actions.js";
import { t } from "../utils/i18n.js";
import { serverLang } from "../utils/server-lang.js";
import LanguageToggle from "./LanguageToggle.js";

const styles = {
  header: {
    borderBottom: "1px solid #DDDDDA",
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    fontFamily: "'Courier New', monospace",
    color: "#5B7CAD",
    fontSize: 14,
    letterSpacing: 1,
    textDecoration: "none",
  },
  email: {
    fontSize: 14,
    color: "#6B6B68",
  },
  link: {
    fontSize: 14,
    color: "#5B7CAD",
    textDecoration: "none",
  },
  logoutButton: {
    color: "#242426",
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
};

// Server component: reads the current user from the request cookies so the
// header can show the right state (email + logout vs. login/signup links).
export default async function SiteHeader() {
  const lang = await serverLang();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header style={styles.header}>
      <a href="/" style={styles.brand}>
        {collection.name}
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={styles.email}>{user.email}</span>
            <a href="/my-entries" style={styles.link}>
              {t("nav.myEntries", lang)}
            </a>
            <form action={logout} style={{ margin: 0 }}>
              <button type="submit" style={styles.logoutButton}>
                {t("nav.logout", lang)}
              </button>
            </form>
          </div>
        ) : (
          <nav style={{ display: "flex", gap: 16 }}>
            <a href="/login" style={styles.link}>
              {t("nav.login", lang)}
            </a>
            <a href="/signup" style={styles.link}>
              {t("nav.signup", lang)}
            </a>
          </nav>
        )}
        <LanguageToggle lang={lang} />
      </div>
    </header>
  );
}