import { notFound } from "next/navigation";
import ContributeForm from "../../../../components/ContributeForm.js";
import { createClient } from "../../../../utils/supabase/server.js";
import authStyles from "../../../authStyles.js";

export default async function EditEntryPage({ params }) {
  const { id } = await params;

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
      <p style={authStyles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={authStyles.title}>Edit entry</h1>

      {!user ? (
        <p style={authStyles.description}>
          You need to <a href="/login" style={authStyles.link}>log in</a>{" "}
          to edit this entry.
        </p>
      ) : entry.owner !== user.id ? (
        <p style={authStyles.description}>
          You can only edit your own entries.
        </p>
      ) : (
        <>
          <p style={authStyles.description}>
            Update this entry. Fields left unchanged keep their values.
          </p>
          <ContributeForm entry={entry} />
        </>
      )}
    </main>
  );
}