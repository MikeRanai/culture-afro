import Image from "next/image";
import { ArrowRight, ArrowUpRight, Phone, Mail, Clock } from "lucide-react";
import FAQSection from "@/components/sections/FAQSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PartnersSection from "@/components/sections/PartnersSection";
import StatsSection from "@/components/sections/StatsSection";
import DirectorySection from "@/components/sections/DirectorySection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import Header from "@/components/ui/Header";
import {
  getActiveTestimonials,
  getActiveFaqs,
  getActivePartners,
  getActiveStats,
  getActiveSocialLinks,
  getContactInfos,
  getActiveDirectoryEntries,
  getActiveGalleryImages,
  getHeroBanner,
} from "@/lib/actions";

/* ─────────────────────────────────────────────
   HERO — Fullscreen immersif
   ───────────────────────────────────────────── */
function HeroSection({
  hero,
}: {
  hero: {
    image: string;
    subtitle: string;
    quote: string;
    ctaLabel1: string;
    ctaLink1: string;
    ctaLabel2: string;
    ctaLink2: string;
    decorWord: string;
  } | null;
}) {
  const h = hero ?? {
    image: "/images/hero-img.webp",
    subtitle: "Association Culture Afro · La Réunion",
    quote:
      "Ensemble, célébrons la beauté des cheveux crépus, frisés et bouclés, comme un héritage vivant. Transmettons, avec fierté et douceur, l\u2019âme de notre identité capillaire au naturel.",
    ctaLabel1: "Consulter l\u2019annuaire",
    ctaLink1: "#annuaire",
    ctaLabel2: "Découvrir nos pôles",
    ctaLink2: "#poles",
    decorWord: "Héritage",
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative h-screen min-h-[600px]"
    >
      {/* Image fullscreen avec parallax */}
      <div className="absolute inset-0">
        <ParallaxImage
          src={h.image || "/images/hero-img.webp"}
          alt="Femmes aux cheveux texturés lors d'un événement Culture Afro"
          sizes="100vw"
          priority
          scaleRange={[1.12, 1]}
        />
        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c2825]/70 via-[#2c2825]/30 to-[#2c2825]/20" />
      </div>

      {/* Contenu centré sur l'image */}
      <div className="relative flex h-full flex-col justify-end pb-16 sm:pb-20 md:pb-24">
        <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
          {h.subtitle && (
            <ScrollReveal animation="fade-in" duration={600}>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
                {h.subtitle}
              </p>
            </ScrollReveal>
          )}

          {h.quote && (
            <ScrollReveal animation="blur-in" delay={200} duration={900}>
              <blockquote className="mt-6 sm:mt-8">
                <p
                  id="hero-title"
                  className="font-serif text-2xl font-normal italic leading-snug text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-snug"
                >
                  &ldquo;{h.quote}&rdquo;
                </p>
              </blockquote>
            </ScrollReveal>
          )}

          <ScrollReveal animation="fade-up" delay={500}>
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
              {h.ctaLabel1 && (
                <a
                  href={h.ctaLink1 || "#"}
                  className="group inline-flex min-h-[44px] items-center gap-3 border border-white/50 px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white hover:text-[#2c2825]"
                >
                  {h.ctaLabel1}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              )}
              {h.ctaLabel2 && (
                <a
                  href={h.ctaLink2 || "#"}
                  className="inline-flex min-h-[44px] items-center gap-2 px-2 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-white/60 underline underline-offset-4 decoration-white/20 transition-colors duration-300 hover:text-white hover:decoration-white/50"
                >
                  {h.ctaLabel2}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Mot cursif décoratif */}
        {h.decorWord && (
          <span
            aria-hidden="true"
            className="absolute bottom-8 right-6 font-handwriting text-5xl text-white/10 sm:bottom-12 sm:right-12 sm:text-7xl md:text-8xl lg:text-9xl"
          >
            {h.decorWord}
          </span>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PÔLES D'ACTION — Asymétrique, éditorial
   ───────────────────────────────────────────── */
const poles = [
  {
    surtitre: "Pôle 01",
    titre: "Ateliers capillaires",
    description:
      "Apprendre à connaître, entretenir et sublimer ses cheveux texturés. Des ateliers pratiques animés par nos bénévoles passionnées, pour retrouver confiance et autonomie dans sa routine capillaire.",
    image: "/images/education-hair.webp",
  },
  {
    surtitre: "Pôle 02",
    titre: "Loisirs créatifs",
    description:
      "Teinture végétale, création de bijoux, couture… Des moments de partage et de créativité qui renforcent le lien communautaire et célèbrent notre culture dans toute sa richesse.",
    image: "/images/loisir-creatif.webp",
  },
  {
    surtitre: "Pôle 03",
    titre: "Conférences & Talks",
    description:
      "Interventions en événements, campus et collectivités. Sensibiliser le grand public à la diversité capillaire, à l'estime de soi et à l'histoire de nos traditions de beauté.",
    image: "/images/benevoles.webp",
  },
];

function PolesSection() {
  return (
    <section id="poles" className="bg-[#fcfaf5]" aria-labelledby="poles-title">
      {/* En-tête de section */}
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:pt-28 lg:px-8">
        <ScrollReveal animation="fade-up">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2c2825]/40">
            Nos engagements
          </p>
          <h2
            id="poles-title"
            className="mt-4 font-serif text-3xl font-normal text-[#2c2825] sm:text-4xl md:text-5xl"
          >
            Trois pôles, une même{" "}
            <span className="font-handwriting text-[1.15em] not-italic text-afro-orange">
              passion
            </span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Liste éditoriale des pôles */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-12 sm:pb-28 sm:pt-16 lg:px-8">
        {poles.map((pole, i) => (
          <div
            key={pole.titre}
            className={`grid items-center gap-8 border-t border-[#2c2825]/10 py-12 sm:py-16 md:grid-cols-2 md:gap-16 lg:gap-24 ${
              i % 2 !== 0 ? "md:[direction:rtl]" : ""
            }`}
          >
            {/* Texte */}
            <ScrollReveal animation={i % 2 === 0 ? "slide-right" : "slide-left"} delay={100}>
              <div className={i % 2 !== 0 ? "md:[direction:ltr]" : ""}>
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-afro-orange">
                  {pole.surtitre}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-normal text-[#2c2825] sm:text-3xl">
                  {pole.titre}
                </h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-[#2c2825]/60">
                  {pole.description}
                </p>
              </div>
            </ScrollReveal>

            {/* Image */}
            <ScrollReveal animation={i % 2 === 0 ? "slide-left" : "slide-right"} delay={250}>
              <div className={`relative aspect-[4/3] w-full overflow-hidden ${i % 2 !== 0 ? "md:[direction:ltr]" : ""}`}>
                <Image
                  src={pole.image}
                  alt={pole.titre}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────
   GALERIE ÉVÉNEMENTIELLE — Masonry asymétrique
   ───────────────────────────────────────────── */
const fallbackGallery = [
  { id: "f1", src: "/images/prog1.webp", alt: "Atelier coiffure lors d'un événement Culture Afro", legend: "Atelier coiffure — BarreF 2024", tall: true },
  { id: "f2", src: "/images/prog2.webp", alt: "Démonstration de tressage traditionnel", legend: "Tressage traditionnel", tall: false },
  { id: "f3", src: "/images/prog3.webp", alt: "Conférence sur l'identité capillaire", legend: "Conférence identité capillaire", tall: false },
  { id: "f4", src: "/images/prog4.webp", alt: "Moment de partage entre participantes", legend: "Moments de partage", tall: true },
];

type GalleryImageData = { id: string; src: string; alt: string; legend: string; tall: boolean };

function GalerieSection({ images }: { images?: GalleryImageData[] }) {
  const data = images && images.length > 0 ? images : fallbackGallery;

  return (
    <section
      id="galerie"
      className="bg-[#fcfaf5]"
      aria-labelledby="galerie-title"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2c2825]/40">
                Sur le terrain
              </p>
              <h2
                id="galerie-title"
                className="mt-4 font-serif text-3xl font-normal text-[#2c2825] sm:text-4xl md:text-5xl"
              >
                Revivez nos{" "}
                <span className="font-handwriting text-[1.15em] not-italic text-afro-magenta">
                  événements
                </span>
              </h2>
            </div>
          </div>
        </ScrollReveal>

        {/* Grille Masonry asymétrique */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-4 lg:gap-6">
          {data.map((img, i) => (
            <ScrollReveal
              key={img.id}
              animation="zoom-in"
              delay={i * 120}
              className={`${
                img.tall ? "lg:row-span-2" : ""
              } ${i === 0 ? "lg:col-span-2" : ""} ${
                i === 3 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="group relative overflow-hidden">
                <div
                  className={`relative w-full overflow-hidden ${
                    img.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                  } ${i === 0 ? "lg:aspect-[4/3]" : ""} ${
                    i === 3 ? "lg:aspect-[4/3]" : ""
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.1em] text-[#2c2825]/40">
                  {img.legend}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION ENGAGEMENT — Rejoindre la communauté
   ───────────────────────────────────────────── */
function EngagementSection() {
  return (
    <section className="bg-[#f0ebe3]" aria-labelledby="engagement-title">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* Texte */}
          <ScrollReveal animation="slide-right">
            <div>
              <span
                aria-hidden="true"
                className="block font-handwriting text-4xl text-[#2c2825]/8 sm:text-5xl"
              >
                Communauté
              </span>
              <h2
                id="engagement-title"
                className="mt-4 font-serif text-3xl font-normal text-[#2c2825] sm:text-4xl"
              >
                Rejoignez le mouvement
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#2c2825]/60">
                Que vous souhaitiez devenir bénévole, adhérer à l&apos;association ou
                simplement participer à nos événements, il y a une place pour vous.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href="https://www.helloasso.com/associations/culture-afro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] w-fit items-center gap-3 border border-[#2c2825] px-7 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[#2c2825] transition-colors duration-300 hover:bg-[#2c2825] hover:text-[#fcfaf5]"
                >
                  Adhérer via HelloAsso
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-[44px] w-fit items-center text-[11px] font-medium uppercase tracking-[0.15em] text-[#2c2825]/60 underline underline-offset-4 decoration-[#2c2825]/20 transition-colors duration-300 hover:text-[#2c2825]"
                >
                  Devenir bénévole
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Image */}
          <ScrollReveal animation="slide-left" delay={200}>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/benevoles.webp"
                alt="Bénévoles de l'association Culture Afro"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER — Éditorial, informations pratiques
   ───────────────────────────────────────────── */
type SocialLinkData = { id: string; platform: string; handle: string; url: string };
type ContactInfoData = { id: string; type: string; title: string; value: string; href: string | null };

function FooterEditorial({ socialLinks, contactInfos }: { socialLinks: SocialLinkData[]; contactInfos: ContactInfoData[] }) {
  const phone = contactInfos.find((c) => c.type === "phone");
  const email = contactInfos.find((c) => c.type === "email");
  const hours = contactInfos.find((c) => c.type === "hours");
  return (
    <footer className="bg-[#2c2825]" role="contentinfo" id="contact">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        {/* Grille principale */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Colonne 1 — Identité */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-3" aria-label="Accueil">
              <img
                src="/images/logo-culture-afro.svg"
                alt="Logo Culture Afro"
                className="h-10 w-auto brightness-0 invert"
                width={40}
                height={40}
              />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Célébrer, transmettre et sublimer la beauté des cheveux texturés
              à La Réunion. Association loi 1901.
            </p>
          </div>

          {/* Colonne 2 — Navigation */}
          <nav aria-label="Navigation pied de page">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
              Navigation
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {[
                { label: "Nos pôles", href: "#poles" },
                { label: "Annuaire", href: "#annuaire" },
                { label: "Galerie", href: "#galerie" },
                { label: "FAQ", href: "#faq" },
                { label: "Mentions légales", href: "/mentions-legales" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="min-h-[44px] inline-flex items-center text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne 3 — Horaires */}
          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
              Horaires
            </h3>
            <div className="mt-4 flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/25" aria-hidden="true" />
              <div>
                {hours ? (
                  <>
                    <p className="text-sm text-white/70">{hours.title}</p>
                    <p className="text-sm font-medium text-white/90">{hours.value}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-white/70">Mercredi au Samedi</p>
                    <p className="text-sm font-medium text-white/90">09h00 — 18h00</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Colonne 4 — Contact & Réseaux */}
          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
              Contact
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {phone && (
                <a
                  href={phone.href || `tel:${phone.value}`}
                  className="flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {phone.value}
                </a>
              )}
              {email && (
                <a
                  href={email.href || `mailto:${email.value}`}
                  className="flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {email.value}
                </a>
              )}
              {!phone && !email && (
                <>
                  <a href="tel:+262692259007" className="flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white">
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    0692 25 90 07
                  </a>
                  <a href="mailto:associationcultureafro@gmail.com" className="flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-white">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    associationcultureafro@gmail.com
                  </a>
                </>
              )}
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-6 flex gap-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.platform} ${link.handle}`}
                    className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-afro-orange"
                  >
                    {link.platform}
                  </a>
                ))
              ) : (
                <>
                  <a href="https://www.instagram.com/assocultureafro/" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-afro-orange">Instagram</a>
                  <a href="https://www.facebook.com/assocultureafro/" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-afro-orange">Facebook</a>
                  <a href="https://www.tiktok.com/@assocultureafro" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-afro-orange">TikTok</a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Séparateur + Copyright */}
        <div className="mt-14 border-t border-white/8 pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} Association Culture Afro. Tous
            droits réservés.
          </p>
          <a
            href="https://mickaelranaivoson.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/25 transition-colors hover:text-white/50"
          >
            MR Digital Solutions
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE
   ───────────────────────────────────────────── */
export default async function HomePage() {
  const [testimonials, faqs, partners, stats, socialLinks, contactInfos, directoryEntries, galleryImages, heroBanner] = await Promise.all([
    getActiveTestimonials(),
    getActiveFaqs(),
    getActivePartners(),
    getActiveStats(),
    getActiveSocialLinks(),
    getContactInfos(),
    getActiveDirectoryEntries(),
    getActiveGalleryImages(),
    getHeroBanner(),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection hero={heroBanner} />

        {/* Chiffres clés */}
        <div className="bg-[#fcfaf5]">
          <ScrollReveal animation="fade-up">
            <StatsSection stats={stats} />
          </ScrollReveal>
        </div>

        <PolesSection />
        <DirectorySection entries={directoryEntries} />
        <GalerieSection images={galleryImages} />

        {/* Témoignages — conservé dynamique */}
        <div className="bg-[#fcfaf5]">
          <TestimonialsSection testimonials={testimonials} />
        </div>

        <EngagementSection />

        {/* Partenaires — conservé dynamique */}
        <div className="bg-[#fcfaf5]">
          <PartnersSection partners={partners} />
        </div>

        {/* FAQ — conservé dynamique */}
        <div id="faq" className="bg-[#fcfaf5]">
          <FAQSection faqs={faqs} />
        </div>
      </main>
      <FooterEditorial socialLinks={socialLinks} contactInfos={contactInfos} />
    </>
  );
}
