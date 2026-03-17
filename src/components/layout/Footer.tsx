import { Instagram, Facebook, Heart } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11z" />
    </svg>
  );
}

const footerLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Ateliers", href: "#ateliers" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "Engagement", href: "#benevole" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/assocultureafro/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/assocultureafro/",
    icon: Facebook,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@assocultureafro",
    icon: TikTokIcon,
  },
];

export default function Footer() {
  return (
    <footer className="bg-afro-dark" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Colonne 1 — Identité */}
          <div>
            <a href="/" className="flex items-center gap-3" aria-label="Accueil">
              <img
                src="/images/logo-culture-afro.svg"
                alt="Logo Culture Afro"
                className="h-10 w-auto brightness-0 invert"
                width={40}
                height={40}
              />
              <span className="font-serif text-lg font-semibold text-white">
                Culture Afro
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Un groupe de femmes passionnées qui accompagnent les
              Réunionnais·es pour mieux comprendre, entretenir et aimer leurs
              cheveux texturés en toute autonomie.
            </p>
          </div>

          {/* Colonne 2 — Navigation */}
          <nav aria-label="Navigation pied de page">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="min-h-[44px] inline-flex items-center text-sm text-white/60 transition-colors duration-200 hover:text-afro-orange"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne 3 — Réseaux + Contact */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
              Réseaux sociaux
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Suivez-nous sur ${s.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-200 hover:bg-afro-orange hover:text-white"
                >
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                Contact
              </h3>
              <div className="flex flex-col gap-1.5">
                <a
                  href="tel:+262692259007"
                  className="text-sm text-white/60 transition-colors hover:text-afro-orange"
                >
                  +262 692 25 90 07
                </a>
                <a
                  href="mailto:associationcultureafro@gmail.com"
                  className="text-sm text-white/60 transition-colors hover:text-afro-orange"
                >
                  associationcultureafro@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur + Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} Association Culture Afro. Tous
            droits réservés.
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-white/35">
            Fait avec
            <Heart className="h-3 w-3 text-afro-magenta" aria-hidden="true" />
            à La Réunion
          </p>
        </div>
      </div>
    </footer>
  );
}
