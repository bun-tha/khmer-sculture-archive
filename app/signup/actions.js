"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";

// Creates an account with email/password. On success:
// - with email confirmation switched on, the user gets a confirmation email
//   and lands on /login?check=1 with a plain "check your email" message;
// - with confirmation switched off, the new user is signed in already and
//   goes straight to the home page.
// If Supabase reports an error, /signup?error=1 shows a generic message.
export async function signUp(formData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (error) {
    redirect("/signup?error=1");
  }

  if (data.session) {
    redirect("/");
  }

  redirect("/login?check=1");
}