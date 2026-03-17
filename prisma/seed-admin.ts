import "dotenv/config";
import argon2 from "argon2";

const PEPPER = process.env.PEPPER_SECRET!;

async function main() {
  // Dynamic import pour contourner les problèmes ESM/CJS
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const { PrismaClient } = await import("../src/app/generated/prisma/client.js");

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter }) as any;

  const email = "admin@cultureafro.fr";
  const password = "*Zazagasy974";

  const passwordHash = await argon2.hash(password + PEPPER, {
    type: argon2.argon2id,
    memoryCost: 2 ** 14,
    timeCost: 3,
    parallelism: 1,
  });

  // Upsert : crée ou met à jour l'admin
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Administrateur" },
    create: { email, name: "Administrateur", passwordHash },
  });

  // Supprimer l'ancien compte si existant
  await prisma.adminUser.deleteMany({
    where: { email: { not: email } },
  });

  console.log("Admin user ready!");
  console.log("  Email:", email);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
