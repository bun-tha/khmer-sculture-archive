import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Runs once per request, before the page renders (see root middleware.js).
// It refreshes an expired auth session and writes the refreshed cookies onto
// the response, so server-rendered pages always see a valid session.
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser(). Refreshing the session only
  // happens because getUser() loads it through the cookie store above.
  // Route protection (redirects for logged-out users) comes in a later
  // sprint; for now every request just exits with a fresh session.
  await supabase.auth.getUser();

  return supabaseResponse;
}