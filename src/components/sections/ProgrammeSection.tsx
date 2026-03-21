import Image from "next/image";
import { Clock, MapPin, CalendarCheck, Users, Sparkles, Scissors, MessageCircle, Hand } from "lucide-react";

const matin = [
  {
    id: "accueil",
    icon: Hand,
    title: "Accueil & Permanence",
    description: "Échanger, témoigner et partager vos expériences capillaires.",
  },
  {
    id: "atelier-prive",
    icon: Scissors,
    title: "Atelier Capillaire en Intimité",
    description: "Un moment privilégié pour prendre soin de vos cheveux en toute confidentialité.",
  },
  {
    id: "boucles-tresses",
    icon: Sparkles,
    title: "Ateliers Boucles & Tresses",
    description: "Apprenez et perfectionnez vos techniques sur cheveux texturés.",
  },
];

const apresMidi = [
  {
    id: "activites",
    icon: Users,
    title: "Activités Artistiques",
    description: "Diverses activités créatives ouvertes à toutes et tous.",
  },
  {
    id: "diagnostic",
    icon: MessageCircle,
    title: "Échange & Diagnostic",
    description: "Diagnostic capillaire personnalisé et conseils adaptés à vos besoins.",
  },
  {
    id: "collectif",
    icon: Scissors,
    title: "Atelier Capillaire Collectif",
    description: "Partagez et apprenez ensemble dans une ambiance conviviale.",
  },
];

export default function ProgrammeSection() {
  return (
    <section
      id="programme"
      aria-labelledby="programme-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-orange/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-orange">
            Notre Programme
          </span>
          <h2
            id="programme-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl md:text-5xl"
          >
            La BARREF à Château Morange
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-afro-dark/70">
            Chaque <strong className="text-afro-dark">1ᵉʳ samedi du mois</strong>, retrouvez-nous aux Camélias pour une journée dédiée à la beauté et à la culture de nos cheveux texturés.
          </p>
        </div>

        {/* Lieu & Info inscription */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-afro-magenta/10 px-4 py-2 font-semibold text-afro-magenta">
            <MapPin className="h-4 w-4" />
            Château Morange, Camélias
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-afro-orange/10 px-4 py-2 font-semibold text-afro-orange">
            <CalendarCheck className="h-4 w-4" />
            1ᵉʳ samedi du mois
          </span>
        </div>

        {/* Galerie photos */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["/prog1.jpg", "/prog2.jpg", "/prog3.jpg", "/prog4.jpg"].map(
            (src, i) => (
              <div
                key={src}
                className="group relative h-64 overflow-hidden rounded-3xl border border-white/50 bg-white/60 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:h-72"
              >
                <Image
                  src={src}
                  alt={`Moment BARREF ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )
          )}
        </div>

        {/* Programme de la journée */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Matin */}
          <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg backdrop-blur-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-afro-orange/10">
                <Clock className="h-5 w-5 text-afro-orange" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-afro-dark">
                  Matin — 9h à 12h
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-afro-magenta">
                  Sur inscription uniquement
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {matin.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-afro-light">
                    <item.icon className="h-4 w-4 text-afro-orange" />
                  </div>
                  <div>
                    <p className="font-semibold text-afro-dark">{item.title}</p>
                    <p className="text-sm text-afro-dark/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Après-midi */}
          <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg backdrop-blur-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-afro-magenta/10">
                <Clock className="h-5 w-5 text-afro-magenta" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-afro-dark">
                  Après-midi — 14h à 18h
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-afro-orange">
                  Portes ouvertes
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {apresMidi.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-afro-light">
                    <item.icon className="h-4 w-4 text-afro-magenta" />
                  </div>
                  <div>
                    <p className="font-semibold text-afro-dark">{item.title}</p>
                    <p className="text-sm text-afro-dark/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="mb-5 font-serif text-xl font-bold text-afro-dark sm:text-2xl">
            Rejoins-nous, ensemble valorisons nos cheveux frisés, crépus, bouclés
          </p>
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-afro-magenta px-8 py-3 font-semibold text-white shadow-lg shadow-afro-magenta/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-afro-magenta/30"
          >
            <CalendarCheck className="h-4 w-4" />
            S&apos;inscrire au prochain samedi
          </a>
        </div>
      </div>
    </section>
  );
}
