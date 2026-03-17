import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes admin protégées (sauf login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
    } catch {
      // Token invalide ou expiré
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // Si déjà connecté et sur /admin/login, rediriger vers /admin
  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // Token invalide, laisser accéder au login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protéger /admin et sous-routes
    "/admin/:path*",
    // Exclure les assets statiques, manifests, etc.
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|images/).*)",
  ],
};
