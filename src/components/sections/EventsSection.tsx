import {
  PartyPopper,
  Store,
  Sun,
  ShoppingBag,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const eventTypes = [
  {
    icon: PartyPopper,
    title: "Festivals",
    description:
      "On participe aux festivals culturels de l'île pour célébrer et partager notre culture avec le plus grand nombre.",
    color: "bg-afro-orange/10 text-afro-orange",
  },
  {
    icon: Store,
    title: "Pop-up & Boutiques solidaires",
    description:
      "Des espaces éphémères pour découvrir des produits capillaires adaptés, échanger et s'entraider.",
    color: "bg-afro-magenta/10 text-afro-magenta",
  },
  {
    icon: Sun,
    title: "Journées découvertes",
    description:
      "Des journées ouvertes pour apprendre, poser vos questions et repartir avec des astuces concrètes pour vos cheveux.",
    color: "bg-afro-orange/10 text-afro-orange",
  },
  {
    icon: MapPin,
    title: "Dans les quartiers",
    description:
      "On va au plus près de vous, sur tous les terrains, partout où l'échange et le partage ont leur place.",
    color: "bg-afro-magenta/10 text-afro-magenta",
  },
];

export default function EventsSection() {
  return (
    <section
      id="evenements"
      aria-labelledby="events-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="mb-3 inline-block rounded-full bg-afro-orange/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-orange">
            On vient à vous
          </span>
          <h2
            id="events-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
          >
            Nos Événements
          </h2>
          <p className="mt-4 text-base leading-relaxed text-afro-dark/60">
            Cette année, on a décidé d&apos;aller au plus près de vous — sur
            tous les terrains. Malgré nos moyens modestes, on s&apos;est donné à
            fond pour être là, répondre à vos questions et vos doutes, avec le
            sourire.
          </p>
        </div>

        {/* Grille types d'événements */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {eventTypes.map((event) => (
            <div
              key={event.title}
              className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${event.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <event.icon className="h-6 w-6" aria-hidden="true" />
              </div>

              <h3 className="mb-2 font-serif text-lg font-bold text-afro-dark">
                {event.title}
              </h3>

              <p className="text-sm leading-relaxed text-afro-dark/60">
                {event.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA réseaux */}
        <div className="mt-12 rounded-2xl bg-afro-dark/5 p-8 text-center">
          <p className="mb-1 font-serif text-lg font-bold text-afro-dark">
            Prochain événement&nbsp;?
          </p>
          <p className="mb-5 text-sm text-afro-dark/60">
            Suivez-nous sur nos réseaux pour ne rien manquer des prochaines
            dates et lieux.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.instagram.com/assocultureafro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-afro-magenta px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            >
              Instagram
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.facebook.com/assocultureafro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            >
              Facebook
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.tiktok.com/@assocultureafro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-afro-dark px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            >
              TikTok
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
