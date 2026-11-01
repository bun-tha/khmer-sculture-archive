import { createClient } from "../../utils/supabase/server.js";
import ContributeForm from "../../components/ContributeForm.js";
import authStyles from "../authStyles.js";
import { t } from "../../utils/i18n.js";

export default async function ContributePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={authStyles.wrap}>
      <p style={authStyles.kicker}>{t("home.kicker")}</p>
      <h1 style={authStyles.title}>{t("contributePage.title")}</h1>

      {user ? (
        <>
          <p style={authStyles.description}>
            {t("contributePage.description")}
          </p>
          <ContributeForm />
        </>
      ) : (
        <>
          <p style={authStyles.description}>
            {t("contributePage.needLoginPre")}{" "}
            <a href="/login" style={authStyles.link}>{t("nav.login")}</a>{" "}
            {t("contributePage.needLoginPost")}
          </p>
          <p style={authStyles.footer}>
            {t("contributePage.noAccountYet")}{" "}
            <a href="/signup" style={authStyles.link}>
              {t("login.createAccount")}
            </a>
            .
          </p>
        </>
      )}
    </main>
  );
}