import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions Légales | Association Culture Afro",
  description:
    "Mentions légales du site de l'Association Culture Afro à La Réunion.",
};

export default function MentionsLegales() {
  return (
    <>
      <header className="border-b border-afro-dark/5 bg-afro-light/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-afro-dark/70 transition-colors hover:bg-afro-orange/10 hover:text-afro-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl">
          Mentions Légales
        </h1>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-afro-dark/70">
          {/* Éditeur */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Éditeur du site
            </h2>
            <ul className="space-y-1">
              <li>
                <strong>Nom :</strong> Association Culture Afro
              </li>
              <li>
                <strong>Forme juridique :</strong> Association loi 1901
              </li>
              <li>
                <strong>SIREN :</strong> 924 516 842
              </li>
              <li>
                <strong>Date de création :</strong> 4 juillet 2017
              </li>
              <li>
                <strong>Catégorie :</strong> Éducation populaire
              </li>
              <li>
                <strong>Siège social :</strong> Saint-Denis, La Réunion
              </li>
              <li>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:associationcultureafro@gmail.com"
                  className="text-afro-orange underline-offset-2 hover:underline"
                >
                  associationcultureafro@gmail.com
                </a>
              </li>
              <li>
                <strong>Téléphone :</strong>{" "}
                <a
                  href="tel:+262692259007"
                  className="text-afro-orange underline-offset-2 hover:underline"
                >
                  +262 692 25 90 07
                </a>
              </li>
            </ul>
          </section>

          {/* Objet */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Objet de l&apos;association
            </h2>
            <p>
              Promotion et mise en &oelig;uvre d&apos;activités, d&apos;échange
              d&apos;ordre socioculturel et communautaire tel que
              l&apos;initiation à prendre soin de ses cheveux texturés (afro,
              crépus, frisés, bouclés), associer vie quotidienne et écologie,
              développement durable ; initier et proposer des projets par la
              pratique d&apos;activités ludiques, artistiques et musicales ; mise
              en &oelig;uvre d&apos;activité de solidarité et d&apos;entraide.
            </p>
          </section>

          {/* Conception */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Conception et développement
            </h2>
            <p>
              Site conçu et développé par{" "}
              <strong>Mickael Ranaivoson</strong> &mdash;{" "}
              <a
                href="https://mickaelranaivoson.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-afro-orange underline-offset-2 hover:underline"
              >
                MR Digital Solutions
              </a>
            </p>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Hébergement
            </h2>
            <ul className="space-y-1">
              <li>
                <strong>Hébergeur :</strong> Vercel Inc.
              </li>
              <li>
                <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA
                91723, États-Unis
              </li>
              <li>
                <strong>Site :</strong>{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-afro-orange underline-offset-2 hover:underline"
                >
                  vercel.com
                </a>
              </li>
            </ul>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logo,
              graphismes) est la propriété exclusive de l&apos;Association
              Culture Afro ou de ses partenaires. Toute reproduction, même
              partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Protection des données personnelles
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, vous disposez d&apos;un
              droit d&apos;accès, de rectification et de suppression des données
              vous concernant.
            </p>
            <p className="mt-2">
              Les données collectées via le formulaire de contact (nom, email,
              message) sont utilisées uniquement pour répondre à vos demandes.
              Elles ne sont ni vendues, ni transmises à des tiers.
            </p>
            <p className="mt-2">
              Pour exercer vos droits, contactez-nous à{" "}
              <a
                href="mailto:associationcultureafro@gmail.com"
                className="text-afro-orange underline-offset-2 hover:underline"
              >
                associationcultureafro@gmail.com
              </a>
              .
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Cookies
            </h2>
            <p>
              Ce site n&apos;utilise pas de cookies de suivi ou de publicité. Seuls
              des cookies techniques strictement nécessaires au fonctionnement
              du site peuvent être utilisés.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-afro-dark">
              Limitation de responsabilité
            </h2>
            <p>
              L&apos;Association Culture Afro s&apos;efforce de fournir des
              informations aussi précises que possible. Toutefois, elle ne
              pourra être tenue responsable des omissions, des inexactitudes ou
              des carences dans la mise à jour des informations.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-afro-dark/10 pt-6 text-center text-sm text-afro-dark/40">
          Dernière mise à jour : mars 2026
        </div>
      </main>
    </>
  );
}
