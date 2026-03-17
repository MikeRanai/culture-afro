"use server";

import { z } from "zod";
import { prisma } from "./prisma";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  MAX_LOGIN_ATTEMPTS,
  LOCK_DURATION_MS,
} from "./auth";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email requis")
    .email("Email invalide")
    .max(254),
  password: z
    .string()
    .min(1, "Mot de passe requis")
    .max(128),
});

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  // 1. Validation Zod
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

  // 2. Recherche utilisateur
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      loginAttempts: true,
      lockUntil: true,
    },
  });

  // Message générique pour ne pas révéler si l'email existe
  const genericError = "Email ou mot de passe incorrect";

  if (!user) {
    return { error: genericError };
  }

  // 3. Vérification verrouillage brute-force
  if (user.lockUntil && user.lockUntil > new Date()) {
    const remainingMs = user.lockUntil.getTime() - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60000);
    return {
      error: `Compte verrouillé. Réessayez dans ${remainingMin} minute${remainingMin > 1 ? "s" : ""}.`,
    };
  }

  // 4. Vérification mot de passe
  const valid = await verifyPassword(user.passwordHash, password);

  if (!valid) {
    const attempts = user.loginAttempts + 1;
    const lockUntil =
      attempts >= MAX_LOGIN_ATTEMPTS
        ? new Date(Date.now() + LOCK_DURATION_MS)
        : null;

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        loginAttempts: attempts,
        lockUntil,
      },
    });

    if (lockUntil) {
      return {
        error: `Trop de tentatives. Compte verrouillé pour 15 minutes.`,
      };
    }

    return { error: genericError };
  }

  // 5. Succès : reset compteur + créer session
  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      loginAttempts: 0,
      lockUntil: null,
      lastLoginAt: new Date(),
    },
  });

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  await setSessionCookie(token);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
