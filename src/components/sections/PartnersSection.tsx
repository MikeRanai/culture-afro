type Partner = {
  id: string;
  name: string;
  logo: string;
  url: string | null;
};

export default function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <section
      id="partenaires"
      aria-labelledby="partners-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-orange/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-orange">
            Ensemble
          </span>
          <h2
            id="partners-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
          >
            Nos Partenaires
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-afro-dark/60">
            Ils nous font confiance et soutiennent notre mission
            d&apos;éducation capillaire à La Réunion.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {partners.map((p) => {
            const content = (
              <div className="flex flex-col items-center gap-2 transition-opacity duration-300 hover:opacity-70">
                <div className="flex h-14 w-14 items-center justify-center sm:h-20 sm:w-20">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-center text-xs font-medium text-afro-dark/70 sm:text-sm">
                  {p.name}
                </p>
              </div>
            );

            return p.url ? (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visiter le site de ${p.name}`}
              >
                {content}
              </a>
            ) : (
              <div key={p.id}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
