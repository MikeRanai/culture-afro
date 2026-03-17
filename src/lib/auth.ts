import argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const PEPPER = process.env.PEPPER_SECRET!;
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);
const COOKIE_NAME = "admin_session";
const SESSION_DURATION = "8h";

// ─── Argon2id (serverless-safe) ──────────────────────────
// memoryCost: 2^14 = 16 MB, timeCost: 3, parallelism: 1
// PEPPER externe ajouté au mot de passe avant hashage
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password + PEPPER, {
    type: argon2.argon2id,
    memoryCost: 2 ** 14,
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password + PEPPER);
}

// ─── JWT ─────────────────────────────────────────────────
export async function createSessionToken(payload: {
  userId: string;
  email: string;
  name: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(SECRET);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; email: string; name: string };
  } catch {
    return null;
  }
}

// ─── Cookie helpers ──────────────────────────────────────
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60, // 8 heures
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// ─── Brute-force config ──────────────────────────────────
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
