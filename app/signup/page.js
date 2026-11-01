import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";
import { signUp } from "./actions.js";
import authStyles from "../authStyles.js";
import { t } from "../../utils/i18n.js";
import { serverLang } from "../../utils/server-lang.js";

export default async function SignupPage({ searchParams }) {
  const sp = await searchParams;
  const lang = await serverLang();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already logged in — send the user home instead of showing the form.
  if (user) {
    redirect("/");
  }

  return (
    <main style={authStyles.wrap}>
      <p style={authStyles.kicker}>{t("home.kicker", lang)}</p>
      <h1 style={authStyles.title}>{t("signup.title", lang)}</h1>
      <p style={authStyles.description}>
        {t("signup.description", lang)}
      </p>

      {sp.error !== undefined && (
        <p style={authStyles.notice}>
          {t("signup.error", lang)}
        </p>
      )}

      <form action={signUp} style={authStyles.card}>
        <label style={authStyles.cardLabel} htmlFor="email">
          {t("field.email", lang).toUpperCase()}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          style={authStyles.input}
        />

        <label style={authStyles.cardLabel} htmlFor="password">
          {t("field.password", lang).toUpperCase()}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          style={authStyles.input}
        />

        <button type="submit" style={authStyles.button}>
          {t("signup.title", lang)}
        </button>
      </form>

      <p style={authStyles.footer}>
        {t("signup.hasAccount", lang)}{" "}
        <a href="/login" style={authStyles.link}>{t("nav.login", lang)}</a>.
      </p>
    </main>
  );
}