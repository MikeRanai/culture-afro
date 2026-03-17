import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod/v4";

const contactSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100).transform((s) => s.trim()),
  email: z.email("Email invalide"),
  subject: z
    .string()
    .min(1, "Sujet requis")
    .max(200)
    .transform((s) => s.trim()),
  message: z
    .string()
    .min(1, "Message requis")
    .max(5000)
    .transform((s) => s.trim()),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Rate limiting simple en mémoire
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de messages envoyés. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Site Culture Afro" <${process.env.GMAIL_USER}>`,
      to: "associationcultureafro@gmail.com",
      replyTo: email,
      subject: `[Contact Site] ${escapeHtml(subject)}`,
      html: `
        <h2>Nouveau message depuis le site</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
