import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decodeAdminCookie } from "./src/lib/admin"; // <-- helper functions we wrote
import {redirect} from './src/i18n/navigation';
import { getLocale } from "next-intl/server";
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Detect current locale
  const locale = await getLocale();
  // Only protect /admin (and subroutes), not /admin/login
  if (pathname.includes("/admin") ) {
    const cookie = request.cookies.get("admin-auth")?.value;
    const isAdmin = cookie ? await decodeAdminCookie(cookie) : false;
    if (!isAdmin) {
      console.log(`Not admin → redirecting to /${locale}/admin/login`);
      return redirect({ href: "/admin/login", locale });
    }
  }

  return intlMiddleware(request);
  }


export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
