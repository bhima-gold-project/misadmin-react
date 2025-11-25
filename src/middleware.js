import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode('qwerty1234567testuser123');

export async function middleware(req) {
  const token = req.cookies.get("token")?.value || null;
  const path = req.nextUrl.pathname;

  // Define protected route prefixes
  const protectedPrefixes = [
    "/", 
    "/productImport",
    "/orders",
    "/bmc"
  ];

  const isProtected = protectedPrefixes.some(prefix => 
    path === prefix || path.startsWith(prefix + "/")
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // Validate token
      await jwtVerify(token, SECRET);
      // Token is valid → allow access
      return NextResponse.next();
    } catch (e) {
      // Invalid or expired token → redirect
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Unprotected route → allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Run middleware on all paths
};
