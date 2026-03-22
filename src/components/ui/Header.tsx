"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-afro-light/90 backdrop-blur-sm shadow-sm"
          : "bg-gradient-to-b from-black/50 to-transparent"
      }`}
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-afro-orange focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Passer au contenu principal
      </a>

      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8"
      >
        <a href="/" className="flex items-center gap-3" aria-label="Accueil">
          <img
            src="/images/logo-culture-afro.svg"
            alt="Logo Culture Afro"
            className={`h-10 w-auto transition-all duration-500 ${
              scrolled ? "" : "brightness-0 invert"
            }`}
            width={40}
            height={40}
          />
          <span
            className={`hidden text-xs font-medium uppercase tracking-[0.25em] transition-colors duration-500 sm:block ${
              scrolled ? "text-afro-dark" : "text-white"
            }`}
          >
            Culture Afro
          </span>
        </a>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-8 md:flex lg:gap-10">
          {[
            { label: "Nos pôles", href: "#poles" },
            { label: "Annuaire", href: "#annuaire" },
            { label: "Galerie", href: "#galerie" },
            { label: "FAQ", href: "#faq" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`min-h-[44px] flex items-center text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${
                  scrolled
                    ? "text-afro-dark/60 hover:text-afro-dark"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <a
          href="https://www.helloasso.com/associations/culture-afro"
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden min-h-[44px] items-center px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-500 md:inline-flex ${
            scrolled
              ? "border border-afro-dark text-afro-dark hover:bg-afro-dark hover:text-afro-light"
              : "border border-white/80 text-white hover:bg-white hover:text-afro-dark"
          }`}
        >
          Nous rejoindre
        </a>

        {/* Menu burger mobile */}
        <MobileMenu scrolled={scrolled} />
      </nav>

      {/* Ligne de séparation fine */}
      <div
        className={`h-px transition-opacity duration-500 ${
          scrolled ? "bg-afro-dark/8 opacity-100" : "opacity-0"
        }`}
      />
    </header>
  );
}

function MobileMenu({ scrolled }: { scrolled: boolean }) {
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
      <label
        htmlFor="mobile-menu-toggle"
        className={`flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center transition-colors duration-500 ${
          scrolled ? "text-afro-dark" : "text-white"
        }`}
        aria-label="Menu de navigation"
        role="button"
        tabIndex={0}
      >
        <Menu className="block h-5 w-5 peer-checked:hidden" />
        <X className="hidden h-5 w-5 peer-checked:block" />
      </label>

      {/* Panel mobile */}
      <div className="invisible fixed inset-x-0 top-[65px] z-40 translate-y-[-10px] bg-afro-light opacity-0 transition-all duration-300 peer-checked:visible peer-checked:translate-y-0 peer-checked:opacity-100">
        <div className="mx-auto flex max-w-7xl flex-col px-6 py-8">
          {[
            { label: "Nos pôles", href: "#poles" },
            { label: "Annuaire", href: "#annuaire" },
            { label: "Galerie", href: "#galerie" },
            { label: "FAQ", href: "#faq" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="min-h-[44px] border-b border-afro-dark/8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-afro-dark/70 transition-colors hover:text-afro-dark"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://www.helloasso.com/associations/culture-afro"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex min-h-[44px] items-center justify-center border border-afro-dark px-6 py-3 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-afro-dark"
          >
            Nous rejoindre
          </a>
        </div>
      </div>
    </div>
  );
}
