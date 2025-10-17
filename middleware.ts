import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/profile", "/home"];
const authPages = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("accessToken")?.value;
  const isAuthPage = authPages.includes(path);

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  const isPathProtected = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  if (!token && isPathProtected) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * API routes
     * Static files
     * _next/static
     * _next/image
     * favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/login",
    "/signup",
    "/profile/:path*",
    "/home/:path*",
  ],
};
