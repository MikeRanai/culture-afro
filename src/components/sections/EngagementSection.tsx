import Image from "next/image";
import { Send } from "lucide-react";

export default function EngagementSection() {
  return (
    <section
      id="benevole"
      aria-labelledby="engagement-title"
      className="px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem]">
        {/* Image de fond */}
        <Image
          src="/images/benevoles.webp"
          alt="Groupe de bénévoles de l'association Culture Afro"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />

        {/* Overlay sombre */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-afro-dark/65 mix-blend-multiply"
        />

        {/* Contenu */}
        <div className="relative z-10 grid min-h-[500px] grid-cols-1 items-center gap-10 p-8 md:p-16 lg:grid-cols-2 lg:gap-16">
          {/* Colonne gauche — Texte */}
          <div>
            <span className="mb-4 inline-block text-sm font-bold uppercase tracking-widest text-white/80">
              Engagement
            </span>

            <h2
              id="engagement-title"
              className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl"
            >
              La cause t&apos;inspire&nbsp;?
              <br />
              <span className="text-afro-orange">Deviens bénévole&nbsp;!</span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75">
              L&apos;association, c&apos;est avant tout une aventure humaine.
              Rejoins des bénévoles passionnées, présentes sur tout le
              territoire — festivals, pop-up, journées découvertes, quartiers.
              Rien n&apos;aurait été possible sans elles.
            </p>
          </div>

          {/* Colonne droite — Formulaire glassmorphism */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
            <h3 className="mb-6 text-xl font-bold text-white">
              Rejoindre l&apos;équipe
            </h3>

            <form
              action="#"
              method="POST"
              className="flex flex-col gap-4"
              aria-label="Formulaire d'inscription bénévole"
            >
              {/* Nom */}
              <div>
                <label htmlFor="volunteer-name" className="sr-only">
                  Nom complet
                </label>
                <input
                  id="volunteer-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ton nom"
                  autoComplete="name"
                  className="min-h-[44px] w-full border-b border-white/50 bg-transparent px-1 pb-2 text-base text-white placeholder:text-white/60 transition-colors focus:border-white focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="volunteer-email" className="sr-only">
                  Adresse email
                </label>
                <input
                  id="volunteer-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  required
                  placeholder="Ton email"
                  autoComplete="email"
                  className="min-h-[44px] w-full border-b border-white/50 bg-transparent px-1 pb-2 text-base text-white placeholder:text-white/60 transition-colors focus:border-white focus:outline-none"
                />
              </div>

              {/* Message optionnel */}
              <div>
                <label htmlFor="volunteer-message" className="sr-only">
                  Message (optionnel)
                </label>
                <textarea
                  id="volunteer-message"
                  name="message"
                  rows={3}
                  placeholder="Un petit mot ? (optionnel)"
                  className="min-h-[44px] w-full resize-none border-b border-white/50 bg-transparent px-1 pb-2 text-base text-white placeholder:text-white/60 transition-colors focus:border-white focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-afro-orange font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-afro-orange/30"
              >
                Rejoindre
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
