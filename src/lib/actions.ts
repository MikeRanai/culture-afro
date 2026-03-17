"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { getSession } from "./auth";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Non autorisé");
  return session;
}

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
  await prisma.testimonial.create({ data });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

export async function updateTestimonial(
  id: string,
  data: { name?: string; quote?: string; image?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  await prisma.testimonial.update({ where: { id }, data });
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await requireAuth();
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
  await prisma.fAQ.create({ data });
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function updateFaq(
  id: string,
  data: { question?: string; answer?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  await prisma.fAQ.update({ where: { id }, data });
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function deleteFaq(id: string) {
  await requireAuth();
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
  await prisma.socialLink.create({ data });
  revalidatePath("/admin/reseaux-sociaux");
  revalidatePath("/");
}

export async function updateSocialLink(
  id: string,
  data: { platform?: string; handle?: string; url?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  await prisma.socialLink.update({ where: { id }, data });
  revalidatePath("/admin/reseaux-sociaux");
  revalidatePath("/");
}

export async function deleteSocialLink(id: string) {
  await requireAuth();
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
  await prisma.stat.create({ data });
  revalidatePath("/admin/statistiques");
  revalidatePath("/");
}

export async function updateStat(
  id: string,
  data: { value?: string; label?: string; icon?: string; color?: string; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  await prisma.stat.update({ where: { id }, data });
  revalidatePath("/admin/statistiques");
  revalidatePath("/");
}

export async function deleteStat(id: string) {
  await requireAuth();
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
  await prisma.partner.create({ data });
  revalidatePath("/admin/partenaires");
  revalidatePath("/");
}

export async function updatePartner(
  id: string,
  data: { name?: string; logo?: string; url?: string | null; sortOrder?: number; active?: boolean }
) {
  await requireAuth();
  await prisma.partner.update({ where: { id }, data });
  revalidatePath("/admin/partenaires");
  revalidatePath("/");
}

export async function deletePartner(id: string) {
  await requireAuth();
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
  await prisma.contactInfo.create({ data });
  revalidatePath("/admin/contact");
  revalidatePath("/");
}

export async function updateContactInfo(
  id: string,
  data: { type?: string; title?: string; value?: string; href?: string | null; sortOrder?: number }
) {
  await requireAuth();
  await prisma.contactInfo.update({ where: { id }, data });
  revalidatePath("/admin/contact");
  revalidatePath("/");
}

export async function deleteContactInfo(id: string) {
  await requireAuth();
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
