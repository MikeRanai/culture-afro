import { Heart, Sparkles, Users, Leaf } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description:
      "Écouter, conseiller, partager vos histoires et vos expériences, toujours dans la bonne humeur et la convivialité.",
    accent: "text-afro-terracotta",
    line: "bg-afro-terracotta/30",
  },
  {
    icon: Sparkles,
    title: "Transmission",
    description:
      "Des bénévoles et coiffeuses qui s'entraident et partagent leurs connaissances pour mieux répondre aux besoins de chacun·e.",
    accent: "text-afro-dark",
    line: "bg-afro-dark/20",
  },
  {
    icon: Users,
    title: "Communauté",
    description:
      "Revenir à ce temps où l'on échangeait sans retenue, où chaque partage pouvait transformer la vie de quelqu'un.",
    accent: "text-afro-terracotta",
    line: "bg-afro-terracotta/30",
  },
  {
    icon: Leaf,
    title: "Autonomie",
    description:
      "Accompagner du plus petit à l'adulte pour mieux comprendre ses cheveux et apprendre à les entretenir en toute autonomie.",
    accent: "text-afro-dark",
    line: "bg-afro-dark/20",
  },
];

export default function MissionSection() {
  return (
    <section
      id="mission"
      className="bg-afro-terracotta-light"
      aria-labelledby="mission-title"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
        {/* En-tête éditorial */}
        <ScrollReveal animation="fade-up">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-afro-dark/50">
            Qui sommes-nous
          </p>
          <h2
            id="mission-title"
            className="mt-4 font-serif text-3xl font-normal text-afro-dark sm:text-4xl md:text-5xl"
          >
            Portées par une même{" "}
            <span className="font-handwriting text-[1.15em] not-italic text-afro-terracotta">
              mission
            </span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-afro-dark/70">
            L&apos;Association Culture Afro, c&apos;est avant tout un groupe de
            femmes passionnées, engagées et présentes sur tout le territoire.
            Notre mission&nbsp;? Vous aider à vous reconnecter à vous-mêmes et
            à vos racines, avec fierté et authenticité.
          </p>
        </ScrollReveal>

        {/* Valeurs — style éditorial avec lignes séparatrices */}
        <div className="mt-16 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} animation="fade-up" delay={i * 120}>
              <div className="group relative border-t border-afro-dark/10 py-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-0 lg:first:border-l-0 lg:first:pl-0">
                <v.icon
                  className={`h-5 w-5 ${v.accent}`}
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-serif text-xl font-normal text-afro-dark">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-afro-dark/70">
                  {v.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
