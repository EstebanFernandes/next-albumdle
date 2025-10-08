import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decodeAdminCookie } from "./src/utils/crypto.helper"; // <-- helper functions we wrote
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? "en"
  // Protect only /admin routes
  if (pathname.includes("/login")) {
    const cookie = request.cookies.get("admin-auth")?.value;
    const isAdmin = cookie ? await decodeAdminCookie(cookie) : false;
    if (isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }
  else if (pathname.includes("/admin")) {
    const cookie = request.cookies.get("admin-auth")?.value;
    const isAdmin = cookie ? await decodeAdminCookie(cookie) : false;
    console.log("Is admin =", isAdmin)
    // Case: not logged in and tries to access /admin (but not /admin/login) → redirect to login
    if (!isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

  }

  // Default: run intl middleware for locale handling
  return intlMiddleware(request);
}


export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
