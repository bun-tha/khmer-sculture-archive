import { updateSession } from "./utils/supabase/middleware";

// Next.js runs this once per request, before the route renders. It keeps the
// Supabase auth cookies in sync so server-rendered pages can read the session
// (see utils/supabase/server.js).
export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run for every path except Next.js internals and static image assets:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - svg/png/jpg/jpeg/gif/webp files served from public/
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};