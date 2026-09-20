"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";

// Signs the user out on the server and returns to the home page. Clearing
// the session writes the expired cookies back through createClient's cookie
// store, so the browser drops them.
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}