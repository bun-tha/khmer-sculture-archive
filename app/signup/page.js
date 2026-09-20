import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";
import { signUp } from "./actions.js";
import authStyles from "../authStyles.js";

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
      <p style={authStyles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={authStyles.title}>Create an account</h1>
      <p style={authStyles.description}>
        Sign up to contribute entries to the archive.
      </p>

      {sp.error !== undefined && (
        <p style={authStyles.notice}>
          That account could not be created — try again.
        </p>
      )}

      <form action={signUp} style={authStyles.card}>
        <label style={authStyles.cardLabel} htmlFor="email">
          EMAIL
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
          PASSWORD
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
          Create account
        </button>
      </form>

      <p style={authStyles.footer}>
        Already have an account?{" "}
        <a href="/login" style={authStyles.link}>Log in</a>.
      </p>
    </main>
  );
}