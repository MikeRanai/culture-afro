import Image from "next/image";

type Partner = {
  id: string;
  name: string;
  logo: string;
  url: string | null;
};

function PartnerItem({ partner }: { partner: Partner }) {
  const content = (
    <div className="flex flex-col items-center gap-2 px-6 sm:px-10">
      <div className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          sizes="(max-width: 640px) 64px, 80px"
          className="object-contain transition-all duration-300 grayscale hover:grayscale-0"
        />
      </div>
      <p className="whitespace-nowrap text-center text-xs font-medium text-afro-dark/50 sm:text-sm">
        {partner.name}
      </p>
    </div>
  );

  return partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visiter le site de ${partner.name}`}
    >
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

export default function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  // On duplique la liste pour le défilement infini seamless
  const track = [...partners, ...partners];

  return (
    <section
      id="partenaires"
      aria-labelledby="partners-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-amber/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-amber">
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
      </div>

      {/* Bandeau défilant infini */}
      <div className="relative overflow-hidden">
        {/* Masques dégradés sur les bords */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-afro-light to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-afro-light to-transparent sm:w-24" />

        <div className="flex w-max animate-marquee items-center py-4 hover:[animation-play-state:paused]">
          {track.map((partner, i) => (
            <PartnerItem key={`${partner.id}-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
