import Image from "next/image";
import { Heart, Users, HandHeart, ExternalLink, Scissors, Eye, Calendar, Gift } from "lucide-react";

const HELLOASSO_URL = "https://www.helloasso.com/associations/asso-culture-afro/formulaires/1";

export default function EngagementSection() {
  return (
    <section
      id="benevole"
      aria-labelledby="engagement-title"
      className="px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Titre de section */}
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-magenta/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-magenta">
            Rejoignez-nous
          </span>
          <h2
            id="engagement-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
          >
            Faites partie de l&apos;aventure
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-afro-dark/60">
            Que vous souhaitiez donner de votre temps, soutenir un projet ou
            simplement faire partie de la communauté, il y a une place pour
            vous.
          </p>
        </div>

        {/* Cartes Bénévole / Adhérent */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Carte Bénévole */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Barre accent */}
            <div
              aria-hidden="true"
              className="h-1.5 w-full bg-gradient-to-r from-afro-orange to-afro-orange/70"
            />

            <div className="p-6 sm:p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-afro-orange/10">
                <Heart className="h-7 w-7 text-afro-orange" aria-hidden="true" />
              </div>

              <h3 className="mb-2 font-serif text-xl font-bold text-afro-dark">
                Devenir Bénévole
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-afro-dark/65">
                Rejoignez une équipe de passionnées ! En tant que bénévole,
                vous participez aux ateliers capillaires, apprenez davantage
                sur les textures de cheveux et partagez vos compétences.
                C&apos;est aussi une manière d&apos;échanger avec le public et
                de s&apos;entraider.
              </p>

              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-afro-orange/10">
                    <Scissors className="h-4 w-4 text-afro-orange" aria-hidden="true" />
                  </div>
                  <p className="pt-1 text-sm text-afro-dark/70">
                    Apprendre sur les textures de cheveux auprès de coiffeuses
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-afro-orange/10">
                    <Users className="h-4 w-4 text-afro-orange" aria-hidden="true" />
                  </div>
                  <p className="pt-1 text-sm text-afro-dark/70">
                    Partager ses compétences et échanger avec le public
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-afro-orange/10">
                    <HandHeart className="h-4 w-4 text-afro-orange" aria-hidden="true" />
                  </div>
                  <p className="pt-1 text-sm text-afro-dark/70">
                    S&apos;entraider au sein d&apos;une communauté bienveillante
                  </p>
                </li>
              </ul>

              <a
                href="mailto:associationcultureafro@gmail.com?subject=Devenir%20bénévole"
                className="group/btn inline-flex min-h-[44px] items-center gap-2 rounded-full bg-afro-orange px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-afro-orange/30"
              >
                Nous contacter
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Carte Adhérent */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Barre accent */}
            <div
              aria-hidden="true"
              className="h-1.5 w-full bg-gradient-to-r from-afro-magenta to-afro-magenta/70"
            />

            <div className="p-6 sm:p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-afro-magenta/10">
                <Users className="h-7 w-7 text-afro-magenta" aria-hidden="true" />
              </div>

              <h3 className="mb-2 font-serif text-xl font-bold text-afro-dark">
                Devenir Adhérent·e
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-afro-dark/65">
                En adhérant à l&apos;association, vous bénéficiez d&apos;un
                accompagnement personnalisé et d&apos;avantages exclusifs pour
                vos projets.
              </p>

              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-afro-magenta/10">
                    <Eye className="h-4 w-4 text-afro-magenta" aria-hidden="true" />
                  </div>
                  <p className="pt-1 text-sm text-afro-dark/70">
                    Soutien à vos projets sociaux ou commerciaux et visibilité
                    de votre activité
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-afro-magenta/10">
                    <Calendar className="h-4 w-4 text-afro-magenta" aria-hidden="true" />
                  </div>
                  <p className="pt-1 text-sm text-afro-dark/70">
                    Participation à chaque événement et informé·e en priorité
                    avant le public
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-afro-magenta/10">
                    <Gift className="h-4 w-4 text-afro-magenta" aria-hidden="true" />
                  </div>
                  <p className="pt-1 text-sm text-afro-dark/70">
                    Accès aux événements privés : festivals, pop-up, ateliers
                    exclusifs
                  </p>
                </li>
              </ul>

              <a
                href={HELLOASSO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex min-h-[44px] items-center gap-2 rounded-full bg-afro-magenta px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-afro-magenta/30"
              >
                S&apos;adhérer sur HelloAsso
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bandeau Don */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-afro-dark">
          <div className="relative">
            {/* Image de fond subtile */}
            <Image
              src="/images/benevoles.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-20"
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-10 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
              <div>
                <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">
                  Soutenez l&apos;association
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
                  Votre don nous aide à maintenir nos ateliers gratuits et à
                  développer nos actions sur tout le territoire.
                </p>
              </div>
              <a
                href={HELLOASSO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-afro-orange px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-afro-orange/30"
              >
                <HandHeart className="h-5 w-5" aria-hidden="true" />
                Faire un don
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
