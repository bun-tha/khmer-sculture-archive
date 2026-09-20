"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";

// Logs a user in with email/password. On success: home page.
// On failure the page is re-opened with `?error=1`, and /login shows only
// "Invalid email or password" — the real Supabase error is never surfaced.
export async function login(formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (error) {
    redirect("/login?error=1");
  }

  redirect("/");
}