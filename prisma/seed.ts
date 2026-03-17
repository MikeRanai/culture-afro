import "dotenv/config";
import { PrismaClient } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Amandine",
        quote: "Ma mère se lisse les cheveux et, enfant, j'ai toujours eu envie de faire comme elle. Grâce aux ateliers, j'ai appris à aimer mes boucles naturelles.",
        image: "/images/testimonial-1.jpg",
        sortOrder: 0,
      },
      {
        name: "Fatou",
        quote: "J'ai été adoptée et je n'ai reçu aucune transmission autour de la culture de mes cheveux crépus. Ici, j'ai enfin trouvé un espace pour apprendre.",
        image: "/images/testimonial-2.jpg",
        sortOrder: 1,
      },
      {
        name: "Michel",
        quote: "Dans ma famille, le défrisage était la seule option connue. Aujourd'hui, j'ai envie de montrer à mes enfants qu'on peut entretenir ses cheveux naturels… et les aimer.",
        image: "/images/testimonial-3.jpg",
        sortOrder: 2,
      },
      {
        name: "Joseph",
        quote: "J'ai découvert une communauté soudée et bienveillante. Chaque événement est un moment de partage et de fierté inoubliable.",
        image: "/images/testimonial-4.jpg",
        sortOrder: 3,
      },
    ],
  });

  // FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "Les ateliers sont-ils ouverts à tous ?",
        answer: "Oui ! Nos ateliers sont ouverts à toutes et tous, du plus petit à l'adulte, quel que soit votre type de cheveux ou votre niveau de connaissance.",
        sortOrder: 0,
      },
      {
        question: "Combien coûte la participation aux ateliers ?",
        answer: "Nos ateliers capillaires sont 100% gratuits. Les produits capillaires, accessoires et matériel sont mis à disposition sur place.",
        sortOrder: 1,
      },
      {
        question: "Où et quand se déroulent les ateliers capillaires ?",
        answer: "Les ateliers ont lieu à la BARRE F – Château Morange, Saint-Denis, chaque 1er samedi du mois de 9h à 12h. Sur inscription uniquement, places limitées.",
        sortOrder: 2,
      },
      {
        question: "Où peut-on vous retrouver en dehors des ateliers ?",
        answer: "On est présentes sur tout le territoire : festivals, pop-up, journées découvertes, boutiques solidaires, dans les quartiers… Partout où l'échange et le partage ont leur place. Suivez-nous sur nos réseaux pour les prochaines dates !",
        sortOrder: 3,
      },
      {
        question: "Comment devenir bénévole ?",
        answer: "Il suffit de remplir le formulaire dans la section Engagement ci-dessus, ou de nous contacter directement par email ou sur nos réseaux sociaux. On vous accueille avec plaisir !",
        sortOrder: 4,
      },
      {
        question: "Faut-il être membre pour participer ?",
        answer: "Non, vous pouvez assister à un premier atelier sans adhésion. Si l'aventure vous plaît, l'adhésion annuelle est proposée à un tarif accessible.",
        sortOrder: 5,
      },
    ],
  });

  // Social Links
  await prisma.socialLink.createMany({
    data: [
      { platform: "Instagram", handle: "@assocultureafro", url: "https://www.instagram.com/assocultureafro/", sortOrder: 0 },
      { platform: "Facebook", handle: "assocultureafro", url: "https://www.facebook.com/assocultureafro/", sortOrder: 1 },
      { platform: "TikTok", handle: "@assocultureafro", url: "https://www.tiktok.com/@assocultureafro", sortOrder: 2 },
    ],
  });

  // Stats
  await prisma.stat.createMany({
    data: [
      { value: "150+", label: "Membres actifs", icon: "Users", color: "orange", sortOrder: 0 },
      { value: "40+", label: "Ateliers gratuits organisés", icon: "CalendarDays", color: "magenta", sortOrder: 1 },
      { value: "Tout le territoire", label: "Festivals, pop-up, quartiers", icon: "MapPin", color: "orange", sortOrder: 2 },
      { value: "2022", label: "Année de création", icon: "Award", color: "magenta", sortOrder: 3 },
    ],
  });

  // Contact Info
  await prisma.contactInfo.createMany({
    data: [
      { type: "phone", title: "Téléphone", value: "+262 692 25 90 07", href: "tel:+262692259007", sortOrder: 0 },
      { type: "email", title: "Email", value: "contact@cultureafro.re", href: "mailto:contact@cultureafro.re", sortOrder: 1 },
      { type: "location", title: "Localisation", value: "Saint-Denis, La Réunion", sortOrder: 2 },
      { type: "hours", title: "Disponibilité", value: "Lun – Sam, 9h – 18h", sortOrder: 3 },
    ],
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
