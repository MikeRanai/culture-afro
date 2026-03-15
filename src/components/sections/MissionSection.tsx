import { Heart, Sparkles, Users, Leaf } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description:
      "Écouter, conseiller, partager vos histoires et vos expériences, toujours dans la bonne humeur et la convivialité.",
    color: "bg-afro-magenta/10 text-afro-magenta",
  },
  {
    icon: Sparkles,
    title: "Transmission",
    description:
      "Des bénévoles et coiffeuses qui s'entraident et partagent leurs connaissances pour mieux répondre aux besoins de chacun·e.",
    color: "bg-afro-orange/10 text-afro-orange",
  },
  {
    icon: Users,
    title: "Communauté",
    description:
      "Revenir à ce temps où l'on échangeait sans retenue, où chaque partage pouvait transformer la vie de quelqu'un.",
    color: "bg-afro-magenta/10 text-afro-magenta",
  },
  {
    icon: Leaf,
    title: "Autonomie",
    description:
      "Accompagner du plus petit à l'adulte pour mieux comprendre ses cheveux et apprendre à les entretenir en toute autonomie.",
    color: "bg-afro-orange/10 text-afro-orange",
  },
];

export default function MissionSection() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <span className="mb-3 inline-block rounded-full bg-afro-magenta/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-magenta">
            Qui sommes-nous
          </span>
          <h2
            id="mission-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
          >
            Notre Mission
          </h2>
          <p className="mt-4 text-base leading-relaxed text-afro-dark/60">
            L&apos;Association Culture Afro, c&apos;est avant tout un groupe de
            femmes passionnées, engagées et présentes sur tout le territoire.
            Notre mission&nbsp;? Vous aider à vous reconnecter à vous-mêmes et
            à vos racines, avec fierté et authenticité — à travers des ateliers
            gratuits, des événements sur le terrain et un espace
            d&apos;échange bienveillant.
          </p>
        </div>

        {/* Grille valeurs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${v.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <v.icon className="h-6 w-6" aria-hidden="true" />
              </div>

              <h3 className="mb-2 font-serif text-lg font-bold text-afro-dark">
                {v.title}
              </h3>

              <p className="text-sm leading-relaxed text-afro-dark/60">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
