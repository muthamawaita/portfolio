import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.redirect(new URL("/login", request.url));
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login";
  if (isAdminRoute && !request.cookies.has("portfolio_session")) return NextResponse.redirect(new URL("/login?next=/admin", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };