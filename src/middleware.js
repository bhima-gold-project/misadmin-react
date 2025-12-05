import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode('qwerty1234567testuser123');

export async function middleware(req) {
  const token = req.cookies.get("token")?.value || null;
  const path = req.nextUrl.pathname;

  const protectedPrefixes = ["/", "/productImport", "/orders", "/bmc","/productAttrsUpdate"];

  const isProtected = protectedPrefixes.some(prefix =>
    path === prefix || path.startsWith(prefix + "/")
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const verified = await jwtVerify(token, SECRET);
      const role = verified.payload.role;

      // Home page allowed for all
      if (path === "/") {
        const res = NextResponse.next();
        res.headers.set("x-middleware-cache", "no-cache");
        return res;
      }

      // PRODUCT USER
      if (role === "product") {
        if (!path.startsWith("/productImport")) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        const res = NextResponse.next();
        res.headers.set("x-middleware-cache", "no-cache");
        return res;
      }

      // BMC USER
      if (role === "bmc") {
        if (!path.startsWith("/bmc")) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        const res = NextResponse.next();
        res.headers.set("x-middleware-cache", "no-cache");
        return res;
      }

      // ORDER USER
      if (role === "order") {
        if (!path.startsWith("/orders")) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        const res = NextResponse.next();
        res.headers.set("x-middleware-cache", "no-cache");
        return res;
      }

      // ADMIN → allow everything
      if (role === "admin") {
        const res = NextResponse.next();
        res.headers.set("x-middleware-cache", "no-cache");
        return res;
      }

      return NextResponse.redirect(new URL("/unauthorized", req.url));

    } catch (e) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Unprotected routes
  const res = NextResponse.next();
  res.headers.set("x-middleware-cache", "no-cache");
  return res;
}

export const config = {
  matcher: ["/:path*"],
};



//////////////////////////////////////////////////////////////////////////////////
// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode('qwerty1234567testuser123');

// export async function middleware(req) {
//   const token = req.cookies.get("token")?.value || null;
//   const path = req.nextUrl.pathname;

//   // Define protected route prefixes
//   const protectedPrefixes = [
//     "/",
//     "/productImport",
//     "/orders",
//     "/bmc"
//   ];

//   const isProtected = protectedPrefixes.some(prefix =>
//     path === prefix || path.startsWith(prefix + "/")
//   );

//   if (isProtected) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     try {
//       const verified = await jwtVerify(token, SECRET);
//       const payload = verified.payload;
//       const role = payload.role;

//       // Allow home page "/" for ALL roles
//       if (path === "/") {
//         return NextResponse.next();
//       }

//       // PRODUCT USER → only productImport/*
//       if (role === "product") {
//         if (!path.startsWith("/productImport")) {
//           return NextResponse.redirect(new URL("/unauthorized", req.url));
//         }
//         return NextResponse.next();
//       }

//       // BMC USER → only /bmc/*
//       if (role === "bmc") {
//         if (!path.startsWith("/bmc")) {
//           return NextResponse.redirect(new URL("/unauthorized", req.url));
//         }
//         return NextResponse.next();
//       }

      
//       // BMC USER → only /order/*
//       if (role === "order") {
//         if (!path.startsWith("/orders")) {
//           return NextResponse.redirect(new URL("/unauthorized", req.url));
//         }
//         return NextResponse.next();
//       }


//       // ADMIN → allow everything
//       if (role === "admin") {
//         return NextResponse.next();
//       }

//       // Unknown role → block
//       return NextResponse.redirect(new URL("/unauthorized", req.url));

//     } catch (e) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // Unprotected route → allow access
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/:path*"], // Run middleware on all paths
// };
