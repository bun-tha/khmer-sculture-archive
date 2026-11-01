import { notFound } from "next/navigation";
import ContributeForm from "../../../../components/ContributeForm.js";
import { createClient } from "../../../../utils/supabase/server.js";
import authStyles from "../../../authStyles.js";
import { t } from "../../../../utils/i18n.js";
import { serverLang } from "../../../../utils/server-lang.js";

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  const lang = await serverLang();

  const supabase = await createClient();
  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !entry) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={authStyles.wrap}>
      <p style={authStyles.kicker}>{t("home.kicker", lang)}</p>
      <h1 style={authStyles.title}>{t("editPage.title", lang)}</h1>

      {!user ? (
        <p style={authStyles.description}>
          {t("editPage.needLoginPre", lang)}{" "}
          <a href="/login" style={authStyles.link}>{t("nav.login", lang)}</a>{" "}
          {t("editPage.needLoginPost", lang)}
        </p>
      ) : entry.owner !== user.id ? (
        <p style={authStyles.description}>
          {t("errors.ownEntriesOnly", lang)}
        </p>
      ) : (
        <>
          <p style={authStyles.description}>
            {t("editPage.description", lang)}
          </p>
          <ContributeForm entry={entry} lang={lang} />
        </>
      )}
    </main>
  );
}