import { createBrowserClient } from "@supabase/ssr";

// Browser client for "use client" components (React run in the browser).
// Sessions are stored in Supabase's auth cookies, so each call carries them
// automatically. The server middleware (utils/supabase/middleware.js) keeps
// those cookies fresh.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}