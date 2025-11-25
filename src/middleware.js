import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value || null;

  const protectedRoutes = [
    "/",
    "/productImport/reportIn",
    "/productImport/reportSg",
    "/orders/shipmentStatusReport"
  ];

  const path = req.nextUrl.pathname;

  // if (protectedRoutes.includes(path) && !token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return NextResponse.next();
}

// Required matcher so middleware runs
export const config = {
  matcher: [
    "/",
    "/productImport/reportIn",
    "/productImport/reportSg",
    "/orders/shipmentStatusReport"
  ]
};
