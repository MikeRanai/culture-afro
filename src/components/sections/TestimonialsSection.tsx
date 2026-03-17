import Image from "next/image";

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  image: string;
};

// Fallback data used when DB is empty
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Amandine",
    quote: "Ma mère se lisse les cheveux et, enfant, j'ai toujours eu envie de faire comme elle. Grâce aux ateliers, j'ai appris à aimer mes boucles naturelles.",
    image: "/images/testimonial-1.jpg",
  },
  {
    id: "2",
    name: "Fatou",
    quote: "J'ai été adoptée et je n'ai reçu aucune transmission autour de la culture de mes cheveux crépus. Ici, j'ai enfin trouvé un espace pour apprendre.",
    image: "/images/testimonial-2.jpg",
  },
  {
    id: "3",
    name: "Michel",
    quote: "Dans ma famille, le défrisage était la seule option connue. Aujourd'hui, j'ai envie de montrer à mes enfants qu'on peut entretenir ses cheveux naturels… et les aimer.",
    image: "/images/testimonial-3.jpg",
  },
  {
    id: "4",
    name: "Joseph",
    quote: "J'ai découvert une communauté soudée et bienveillante. Chaque événement est un moment de partage et de fierté inoubliable.",
    image: "/images/testimonial-4.jpg",
  },
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-magenta/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-magenta">
            Vos témoignages
          </span>
          <h2
            id="testimonials-title"
            className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-afro-dark md:text-base"
          >
            Impact &amp; Témoignages
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((t) => (
            <article
              key={t.id}
              className="group rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-36 w-full overflow-hidden rounded-xl">
                <Image
                  src={t.image}
                  alt={`Portrait de ${t.name}, membre de l'association`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-afro-dark/20 to-transparent"
                />
              </div>

              <blockquote className="mt-4 text-sm italic leading-relaxed text-afro-dark/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <p className="mt-3 text-sm font-bold text-afro-orange">
                — {t.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
