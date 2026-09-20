import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";
import { login } from "./actions.js";
import authStyles from "../authStyles.js";

export default async function LoginPage({ searchParams }) {
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
      <h1 style={authStyles.title}>Log in</h1>
      <p style={authStyles.description}>
        Log in to contribute entries to the archive.
      </p>

      {sp.error !== undefined && (
        <p style={authStyles.notice}>Invalid email or password</p>
      )}
      {sp.check !== undefined && (
        <p style={authStyles.notice}>
          Account created — check your email for a confirmation link, then log
          in.
        </p>
      )}

      <form action={login} style={authStyles.card}>
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
          autoComplete="current-password"
          required
          style={authStyles.input}
        />

        <button type="submit" style={authStyles.button}>
          Log in
        </button>
      </form>

      <p style={authStyles.footer}>
        New here? <a href="/signup" style={authStyles.link}>Create an account</a>.
      </p>
    </main>
  );
}