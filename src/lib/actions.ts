"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { getSession } from "./auth";
import { z } from "zod/v4";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  return session;
}

// ─── Schemas de validation ──────────────────────────────

const testimonialSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100).transform((s) => s.trim()),
  quote: z.string().min(1, "Citation requise").max(1000).transform((s) => s.trim()),
  image: z.string().min(1, "Image requise").max(500),
  sortOrder: z.number().int().min(0).optional(),
});

const faqSchema = z.object({
  question: z.string().min(1, "Question requise").max(500).transform((s) => s.trim()),
  answer: z.string().min(1, "Réponse requise").max(2000).transform((s) => s.trim()),
  sortOrder: z.number().int().min(0).optional(),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Plateforme requise").max(50).transform((s) => s.trim()),
  handle: z.string().min(1, "Handle requis").max(100).transform((s) => s.trim()),
  url: z.url("URL invalide"),
  sortOrder: z.number().int().min(0).optional(),
});

const statSchema = z.object({
  value: z.string().min(1, "Valeur requise").max(50).transform((s) => s.trim()),
  label: z.string().min(1, "Label requis").max(100).transform((s) => s.trim()),
  icon: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const partnerSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100).transform((s) => s.trim()),
  logo: z.string().min(1, "Logo requis").max(500),
  url: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const contactInfoSchema = z.object({
  type: z.string().min(1, "Type requis").max(50),
  title: z.string().min(1, "Titre requis").max(100).transform((s) => s.trim()),
  value: z.string().min(1, "Valeur requise").max(200).transform((s) => s.trim()),
  href: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Testimonials ────────────────────────────────────────
export async function getTestimonials() {
  await requireAuth();
  return prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActiveTestimonials() {
  return prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createTestimonial(data: {
  name: string;
  quote: string;
  image: string;
  sortOrder?: number;
}) {
  await requireAuth();
  const validated = testimonialSchema.parse(data);
  await prisma.testimonial.create({ data: validated });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

export async function updateTestimonial(
  id: string,
  data: { name?: string; quote?: string; image?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  const partial = testimonialSchema.partial().extend({ active: z.boolean().optional() });
  const validated = partial.parse(data);
  await prisma.testimonial.update({ where: { id }, data: validated });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await requireAuth();
  z.string().uuid().parse(id);
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

// ─── FAQ ─────────────────────────────────────────────────
export async function getFaqs() {
  await requireAuth();
  return prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActiveFaqs() {
  return prisma.fAQ.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createFaq(data: {
  question: string;
  answer: string;
  sortOrder?: number;
}) {
  await requireAuth();
  const validated = faqSchema.parse(data);
  await prisma.fAQ.create({ data: validated });
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function updateFaq(
  id: string,
  data: { question?: string; answer?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  const partial = faqSchema.partial().extend({ active: z.boolean().optional() });
  const validated = partial.parse(data);
  await prisma.fAQ.update({ where: { id }, data: validated });
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function deleteFaq(id: string) {
  await requireAuth();
  z.string().uuid().parse(id);
  await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

// ─── Social Links ────────────────────────────────────────
export async function getSocialLinks() {
  await requireAuth();
  return prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActiveSocialLinks() {
  return prisma.socialLink.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createSocialLink(data: {
  platform: string;
  handle: string;
  url: string;
  sortOrder?: number;
}) {
  await requireAuth();
  const validated = socialLinkSchema.parse(data);
  await prisma.socialLink.create({ data: validated });
  revalidatePath("/admin/reseaux-sociaux");
  revalidatePath("/");
}

export async function updateSocialLink(
  id: string,
  data: { platform?: string; handle?: string; url?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  const partial = socialLinkSchema.partial().extend({ active: z.boolean().optional() });
  const validated = partial.parse(data);
  await prisma.socialLink.update({ where: { id }, data: validated });
  revalidatePath("/admin/reseaux-sociaux");
  revalidatePath("/");
}

export async function deleteSocialLink(id: string) {
  await requireAuth();
  z.string().uuid().parse(id);
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/admin/reseaux-sociaux");
  revalidatePath("/");
}

// ─── Stats ───────────────────────────────────────────────
export async function getStats() {
  await requireAuth();
  return prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActiveStats() {
  return prisma.stat.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createStat(data: {
  value: string;
  label: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}) {
  await requireAuth();
  const validated = statSchema.parse(data);
  await prisma.stat.create({ data: validated });
  revalidatePath("/admin/statistiques");
  revalidatePath("/");
}

export async function updateStat(
  id: string,
  data: { value?: string; label?: string; icon?: string; color?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  const partial = statSchema.partial().extend({ active: z.boolean().optional() });
  const validated = partial.parse(data);
  await prisma.stat.update({ where: { id }, data: validated });
  revalidatePath("/admin/statistiques");
  revalidatePath("/");
}

export async function deleteStat(id: string) {
  await requireAuth();
  z.string().uuid().parse(id);
  await prisma.stat.delete({ where: { id } });
  revalidatePath("/admin/statistiques");
  revalidatePath("/");
}

// ─── Partners ────────────────────────────────────────────
export async function getPartners() {
  await requireAuth();
  return prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActivePartners() {
  return prisma.partner.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createPartner(data: {
  name: string;
  logo: string;
  url?: string;
  sortOrder?: number;
}) {
  await requireAuth();
  const validated = partnerSchema.parse(data);
  await prisma.partner.create({ data: validated });
  revalidatePath("/admin/partenaires");
  revalidatePath("/");
}

export async function updatePartner(
  id: string,
  data: { name?: string; logo?: string; url?: string | null; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  const partial = partnerSchema.partial().extend({ active: z.boolean().optional() });
  const validated = partial.parse(data);
  await prisma.partner.update({ where: { id }, data: validated });
  revalidatePath("/admin/partenaires");
  revalidatePath("/");
}

export async function deletePartner(id: string) {
  await requireAuth();
  z.string().uuid().parse(id);
  await prisma.partner.delete({ where: { id } });
  revalidatePath("/admin/partenaires");
  revalidatePath("/");
}

// ─── Contact Info ────────────────────────────────────────
export async function getContactInfos() {
  return prisma.contactInfo.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createContactInfo(data: {
  type: string;
  title: string;
  value: string;
  href?: string;
  sortOrder?: number;
}) {
  await requireAuth();
  const validated = contactInfoSchema.parse(data);
  await prisma.contactInfo.create({ data: validated });
  revalidatePath("/admin/contact");
  revalidatePath("/");
}

export async function updateContactInfo(
  id: string,
  data: { type?: string; title?: string; value?: string; href?: string | null; sortOrder?: number }
) {
  await requireAuth();
  const partial = contactInfoSchema.partial();
  const validated = partial.parse(data);
  await prisma.contactInfo.update({ where: { id }, data: validated });
  revalidatePath("/admin/contact");
  revalidatePath("/");
}

export async function deleteContactInfo(id: string) {
  await requireAuth();
  z.string().uuid().parse(id);
  await prisma.contactInfo.delete({ where: { id } });
  revalidatePath("/admin/contact");
  revalidatePath("/");
}

// ─── Dashboard Stats ─────────────────────────────────────
export async function getDashboardCounts() {
  await requireAuth();
  const [testimonials, faqs, socialLinks, stats, partners, contacts] =
    await Promise.all([
      prisma.testimonial.count(),
      prisma.fAQ.count(),
      prisma.socialLink.count(),
      prisma.stat.count(),
      prisma.partner.count(),
      prisma.contactInfo.count(),
    ]);
  return { testimonials, faqs, socialLinks, stats, partners, contacts };
}
