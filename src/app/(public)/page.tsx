import Image from "next/image";
import { ArrowRight, Heart, Sparkles, Menu, X } from "lucide-react";
import MissionSection from "@/components/sections/MissionSection";
import ActivitiesSection from "@/components/sections/ActivitiesSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import EngagementSection from "@/components/sections/EngagementSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import SocialSection from "@/components/sections/SocialSection";
import ProgrammeSection from "@/components/sections/ProgrammeSection";
import PartnersSection from "@/components/sections/PartnersSection";
import Footer from "@/components/layout/Footer";
import {
  getActiveTestimonials,
  getActiveFaqs,
  getActiveSocialLinks,
  getActiveStats,
  getActivePartners,
  getContactInfos,
} from "@/lib/actions";

function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-afro-dark/5 bg-afro-light/80 backdrop-blur-md">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {/* Logo + Nom */}
        <a href="/" className="flex items-center gap-3" aria-label="Accueil">
          <img
            src="/images/logo-culture-afro.svg"
            alt="Logo Culture Afro"
            className="h-12 w-auto"
            width={48}
            height={48}
          />
          <span className="hidden font-serif text-lg font-semibold text-afro-dark sm:block">
            Association Culture Afro
          </span>
        </a>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {[
            { label: "Mission", href: "#mission" },
            { label: "Ateliers", href: "#ateliers" },
            { label: "FAQ", href: "#faq" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="relative min-h-[44px] flex items-center text-sm font-medium text-afro-dark/70 transition-colors duration-200 hover:text-afro-magenta"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-afro-magenta transition-all duration-300 hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <a
          href="#benevole"
          className="hidden min-h-[44px] items-center gap-2 rounded-full bg-afro-magenta px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-afro-magenta/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-afro-magenta/30 md:inline-flex"
        >
          <Heart className="h-4 w-4" />
          Nous rejoindre
        </a>

        {/* Menu burger mobile */}
        <MobileMenu />
      </nav>
    </header>
  );
}

function MobileMenu() {
  return (
    <div className="md:hidden">
      <label htmlFor="mobile-menu-toggle" className="sr-only">
        Ouvrir le menu
      </label>
      <input
        type="checkbox"
        id="mobile-menu-toggle"
        className="peer sr-only"
        aria-label="Ouvrir le menu de navigation"
      />
      {/* Bouton burger */}
      <label
        htmlFor="mobile-menu-toggle"
        className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg p-2 text-afro-dark transition-colors hover:bg-afro-dark/5"
        aria-label="Menu de navigation"
        role="button"
        tabIndex={0}
      >
        <Menu className="block h-6 w-6 peer-checked:hidden" />
        <X className="hidden h-6 w-6 peer-checked:block" />
      </label>

      {/* Panel mobile */}
      <div className="invisible fixed inset-x-0 top-[73px] z-40 translate-y-[-10px] border-b border-afro-dark/5 bg-afro-light/95 opacity-0 backdrop-blur-lg transition-all duration-300 peer-checked:visible peer-checked:translate-y-0 peer-checked:opacity-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6">
          {[
            { label: "Mission", href: "#mission" },
            { label: "Ateliers", href: "#ateliers" },
            { label: "FAQ", href: "#faq" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="min-h-[44px] rounded-xl px-4 py-3 text-base font-medium text-afro-dark/80 transition-colors hover:bg-afro-orange/10 hover:text-afro-dark"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#benevole"
            className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-afro-magenta px-6 py-3 text-center font-semibold text-white shadow-lg shadow-afro-magenta/25"
          >
            <Heart className="h-4 w-4" />
            Nous rejoindre
          </a>
        </div>
      </div>
    </div>
  );
}

function FloatingCard() {
  return (
    <div className="animate-float absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-2xl bg-white p-4 shadow-xl shadow-afro-dark/10 sm:-bottom-4 sm:left-1/2 sm:-translate-x-1/2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-afro-orange/10">
          <Sparkles className="h-5 w-5 text-afro-orange" />
        </div>
        <div>
          <p className="text-sm font-semibold text-afro-dark">
            Soin des boucles
          </p>
          <p className="text-xs text-afro-dark/60">Prochain atelier samedi</p>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 md:pb-28 md:pt-20 lg:px-8"
    >
      {/* Blobs décoratifs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-afro-orange/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-60 -left-40 h-[600px] w-[600px] rounded-full bg-afro-magenta/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-afro-orange/5 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        {/* Colonne texte */}
        <div className="flex flex-col items-start gap-6">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-afro-orange/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-afro-orange sm:px-4">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-afro-orange animate-pulse"
              aria-hidden="true"
            />
            La Réunion · Éducation capillaire
          </span>

          <h1
            id="hero-title"
            className="font-serif text-4xl font-bold leading-tight tracking-tight text-afro-dark sm:text-5xl md:text-6xl"
          >
            Révélez la beauté de vos{" "}
            <span className="relative inline-block">
              <span className="relative z-10">boucles naturelles</span>
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-afro-orange/20 sm:bottom-2 sm:h-4"
              />
            </span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-afro-dark/70">
            Éducation capillaire, loisirs créatifs, identité. Un groupe de
            femmes passionnées qui vous accompagne pour mieux comprendre,
            entretenir et aimer vos cheveux texturés en toute autonomie, à La
            Réunion.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#ateliers"
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-afro-orange px-6 py-3 font-semibold text-afro-orange transition-all duration-300 hover:bg-afro-orange hover:text-white"
            >
              Découvrir nos ateliers
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#communaute"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-afro-magenta px-6 py-3 font-semibold text-white shadow-lg shadow-afro-magenta/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-afro-magenta/30"
            >
              Rejoindre la communauté
            </a>
          </div>

        </div>

        {/* Colonne visuelle */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <Image
              src="/images/hero-img.webp"
              alt="Membre de l'association Culture Afro lors d'un atelier capillaire"
              width={1200}
              height={1200}
              sizes="(max-width: 768px) 90vw, 45vw"
              className="h-auto w-full rounded-3xl object-contain shadow-2xl"
              priority
            />
          </div>

          {/* Carte flottante */}
          <FloatingCard />

          {/* Élément décoratif supplémentaire */}
          <div
            aria-hidden="true"
            className="absolute -right-4 top-8 h-20 w-20 rounded-2xl bg-afro-magenta/10 backdrop-blur-sm"
            style={{ rotate: "12deg" }}
          />
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [testimonials, faqs, socialLinks, stats, partners, contactInfos] =
    await Promise.all([
      getActiveTestimonials(),
      getActiveFaqs(),
      getActiveSocialLinks(),
      getActiveStats(),
      getActivePartners(),
      getContactInfos(),
    ]);

  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <MissionSection />
        <ActivitiesSection />
        <StatsSection stats={stats} />
        <TestimonialsSection testimonials={testimonials} />
        <ProgrammeSection />
        <PartnersSection partners={partners} />
        <EngagementSection />
        <FAQSection faqs={faqs} />
        <ContactSection contactInfos={contactInfos} />
        <SocialSection socialLinks={socialLinks} />
      </main>
      <Footer />
    </>
  );
}
