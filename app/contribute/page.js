import { createClient } from "../../utils/supabase/server.js";
import ContributeForm from "../../components/ContributeForm.js";
import authStyles from "../authStyles.js";
import { t } from "../../utils/i18n.js";
import { serverLang } from "../../utils/server-lang.js";

export default async function ContributePage() {
  const lang = await serverLang();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={authStyles.wrap}>
      <p style={authStyles.kicker}>{t("home.kicker", lang)}</p>
      <h1 style={authStyles.title}>{t("contributePage.title", lang)}</h1>

      {user ? (
        <>
          <p style={authStyles.description}>
            {t("contributePage.description", lang)}
          </p>
          <ContributeForm lang={lang} />
        </>
      ) : (
        <>
          <p style={authStyles.description}>
            {t("contributePage.needLoginPre", lang)}{" "}
            <a href="/login" style={authStyles.link}>{t("nav.login", lang)}</a>{" "}
            {t("contributePage.needLoginPost", lang)}
          </p>
          <p style={authStyles.footer}>
            {t("contributePage.noAccountYet", lang)}{" "}
            <a href="/signup" style={authStyles.link}>
              {t("login.createAccount", lang)}
            </a>
            .
          </p>
        </>
      )}
    </main>
  );
}