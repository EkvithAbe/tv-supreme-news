import createMiddleware from "next-intl/middleware";
import {
  type NextRequest,
  NextResponse,
} from "next/server";
import { routing } from "./src/i18n/routing";

const intlProxy = createMiddleware(routing);

const AUTH_SESSION_COOKIE =
  "tv_supreme_session";

/**
 * This is a fast, optimistic redirect only. Every API route and
 * sensitive server page independently verifies the database session.
 */
export default function proxy(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const hasSessionCookie = Boolean(
    request.cookies.get(
      AUTH_SESSION_COOKIE,
    )?.value,
  );

  if (
    isAdminRoute &&
    !hasSessionCookie
  ) {
    const loginUrl = new URL(
      "/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  return intlProxy(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
