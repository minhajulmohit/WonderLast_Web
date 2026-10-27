import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const publicAuthPaths = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublicPage =
    pathname === "/" || pathname === "/all-destinations";
  const isPublicAuthPage = publicAuthPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublicPage || isPublicAuthPage) {
    return NextResponse.next();
  }

  if (getSessionCookie(request)) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set("callbackURL", `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
