import { Quote, ExternalLink } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  image: string;
  socialUrl?: string | null;
};

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Un homme",
    quote: "C'est important ce que vous faites car on minimise cette partie de nous. Moi j'ai pris la décision de laisser mes cheveux longs et ça dérange. Grâce à vous, je vois que je peux assumer mon choix aujourd'hui.",
    image: "",
  },
  {
    id: "2",
    name: "Une femme",
    quote: "Je suis issue d'une famille malbar et je suis la seule aux cheveux frisés. J'ai assumé mon identité capillaire et le fait que je sois unique.",
    image: "",
  },
  {
    id: "3",
    name: "Une mère",
    quote: "Ma fille n'assume pas ses cheveux en public, alors merci à vous d'avoir mis en place une matinée pour qu'on puisse venir et apprendre en toute intimité.",
    image: "",
  },
];

const accentColors = [
  { bg: "bg-afro-orange/10", text: "text-afro-orange", border: "border-afro-orange/20" },
  { bg: "bg-afro-magenta/10", text: "text-afro-magenta", border: "border-afro-magenta/20" },
  { bg: "bg-afro-orange/10", text: "text-afro-orange", border: "border-afro-orange/20" },
];

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials?: Testimonial[];
}) {
  const data = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section
      id="temoignages"
      aria-labelledby="testimonials-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-magenta/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-magenta">
            Vos témoignages
          </span>
          <h2
            id="testimonials-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
          >
            Ils &amp; elles témoignent
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-afro-dark/60">
            Des mots recueillis lors de nos ateliers, qui rappellent pourquoi
            notre action compte.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {data.map((t, i) => {
            const color = accentColors[i % accentColors.length];
            return (
              <article
                key={t.id}
                className={`group relative rounded-2xl border ${color.border} bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8`}
              >
                {/* Icône citation */}
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${color.bg}`}
                >
                  <Quote className={`h-5 w-5 ${color.text}`} aria-hidden="true" />
                </div>

                <blockquote className="text-sm leading-relaxed text-afro-dark/75 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="mt-5 flex items-center gap-2">
                  <p className={`text-sm font-bold ${color.text}`}>
                    — {t.name}
                  </p>
                  {t.socialUrl && (
                    <a
                      href={t.socialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${color.text} opacity-60 transition-opacity hover:opacity-100`}
                      aria-label={`Profil de ${t.name}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
