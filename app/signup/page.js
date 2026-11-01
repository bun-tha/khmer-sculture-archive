import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";
import { signUp } from "./actions.js";
import authStyles from "../authStyles.js";
import { t } from "../../utils/i18n.js";

export default async function SignupPage({ searchParams }) {
  const sp = await searchParams;

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
      <p style={authStyles.kicker}>{t("home.kicker")}</p>
      <h1 style={authStyles.title}>{t("signup.title")}</h1>
      <p style={authStyles.description}>
        {t("signup.description")}
      </p>

      {sp.error !== undefined && (
        <p style={authStyles.notice}>
          {t("signup.error")}
        </p>
      )}

      <form action={signUp} style={authStyles.card}>
        <label style={authStyles.cardLabel} htmlFor="email">
          {t("field.email").toUpperCase()}
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
          {t("field.password").toUpperCase()}
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
          {t("signup.title")}
        </button>
      </form>

      <p style={authStyles.footer}>
        {t("signup.hasAccount")}{" "}
        <a href="/login" style={authStyles.link}>{t("nav.login")}</a>.
      </p>
    </main>
  );
}