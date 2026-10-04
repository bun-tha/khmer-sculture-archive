import { createClient } from "../../utils/supabase/server.js";
import ContributeForm from "../../components/ContributeForm.js";
import authStyles from "../authStyles.js";

export default async function ContributePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main style={authStyles.wrap}>
      <p style={authStyles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={authStyles.title}>Contribute</h1>

      {user ? (
        <>
          <p style={authStyles.description}>
            Add a new entry to the archive. Every field is required.
          </p>
          <ContributeForm />
        </>
      ) : (
        <>
          <p style={authStyles.description}>
            You need to <a href="/login" style={authStyles.link}>log in</a>{" "}
            to add an entry to the archive.
          </p>
          <p style={authStyles.footer}>
            No account yet?{" "}
            <a href="/signup" style={authStyles.link}>
              Create an account
            </a>
            .
          </p>
        </>
      )}
    </main>
  );
}