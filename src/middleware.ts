import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);
const SESSION_MAX_AGE = 2 * 60 * 60; // 2 heures
const REFRESH_THRESHOLD = SESSION_MAX_AGE / 2; // Renouveler si < 1h restante

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes admin protégées (sauf login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);

      // ─── Sliding session : renouveler si le token expire bientôt ───
      const exp = payload.exp as number;
      const now = Math.floor(Date.now() / 1000);
      const remaining = exp - now;

      if (remaining < REFRESH_THRESHOLD) {
        const newToken = await new SignJWT({
          userId: payload.userId,
          email: payload.email,
          name: payload.name,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime(`${SESSION_MAX_AGE}s`)
          .sign(SECRET);

        const response = NextResponse.next();
        response.cookies.set("admin_session", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: SESSION_MAX_AGE,
          path: "/",
        });
        return response;
      }
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
