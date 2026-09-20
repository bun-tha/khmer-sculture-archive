import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client for Server Components, Server Actions, and Route Handlers.
// It reads the session from the incoming request cookies and returns any new
// cookies through the same store, so a request reads and writes the same
// session. Note: in this Next.js version `cookies()` is async and must be
// awaited before use.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookieStore.setAll(cookiesToSet);
          } catch {
            // `cookieStore.setAll` only exists in Next.js 15.11.0+. On this
            // project's Next.js version the cookie store still exposes `set`,
            // so write each updated auth cookie individually. Without this
            // fallback, Server Actions (login, signup, logout) would never
            // persist session cookies.
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          }
        },
      },
    }
  );
}