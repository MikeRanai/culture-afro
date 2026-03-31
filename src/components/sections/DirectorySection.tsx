import Image from "next/image";
import { ArrowUpRight, Heart, Scissors, ShoppingBag, Wrench } from "lucide-react";

type DirectoryEntry = {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string | null;
  category: string;
};

const categories = [
  { key: "salons", label: "Coiffeurs & Salons", icon: Scissors },
  { key: "produits", label: "Produits & Soins", icon: ShoppingBag },
  { key: "friperies", label: "Friperies Solidaires", icon: Heart },
  { key: "partenaires_techniques", label: "Partenaires Techniques", icon: Wrench },
];

export default function DirectorySection({ entries }: { entries: DirectoryEntry[] }) {
  if (entries.length === 0) return null;

  const grouped = categories
    .map((cat) => ({
      ...cat,
      items: entries.filter((e) => e.category === cat.key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <section
      id="annuaire"
      className="relative overflow-hidden"
      aria-labelledby="annuaire-title"
      style={{ background: "linear-gradient(135deg, #fd9a00 0%, #feb801 100%)" }}
    >
      {/* Motif géométrique africain subtil */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(0,0,0,0.15) 30px, rgba(0,0,0,0.15) 32px), repeating-linear-gradient(-60deg, transparent, transparent 30px, rgba(0,0,0,0.15) 30px, rgba(0,0,0,0.15) 32px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
        {/* En-tête */}
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full bg-afro-dark/10 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-afro-dark/70">
            Notre réseau
          </span>
          <h2
            id="annuaire-title"
            className="mt-4 font-serif text-3xl font-normal text-afro-dark sm:text-4xl md:text-5xl"
          >
            Nos partenaires qui{" "}
            <span className="font-handwriting text-[1.15em] not-italic text-white">
              soutiennent
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-afro-dark/60">
            Ils nous font confiance et accompagnent notre mission au quotidien, par secteur d&apos;activité.
          </p>
        </div>

        {/* Grille par catégorie */}
        <div className={`grid grid-cols-1 gap-10 ${grouped.length >= 3 ? "lg:grid-cols-3" : grouped.length === 2 ? "md:grid-cols-2" : ""} md:gap-8`}>
          {grouped.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.key}
                className="rounded-2xl border border-afro-dark/[0.06] bg-white/60 p-6 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
              >
                {/* Titre catégorie */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-afro-dark/10">
                    <Icon className="h-5 w-5 text-afro-dark/70" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-afro-dark/80">
                    {group.label}
                  </h3>
                </div>

                {/* Entrées */}
                <div className="flex flex-col">
                  {group.items.map((entry, i) => {
                    const Tag = entry.url ? "a" : "div";
                    const linkProps = entry.url
                      ? {
                          href: entry.url,
                          target: "_blank" as const,
                          rel: "noopener noreferrer",
                        }
                      : {};

                    return (
                      <Tag
                        key={entry.id}
                        {...linkProps}
                        className={`group/item flex items-center gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-afro-amber/10 ${
                          i !== group.items.length - 1 ? "border-b border-afro-dark/[0.06]" : ""
                        } ${entry.url ? "cursor-pointer" : "cursor-default"}`}
                      >
                        {/* Logo */}
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-afro-dark/10 bg-white p-1 shadow-sm">
                          {entry.logo ? (
                            <Image
                              src={entry.logo}
                              alt={`Logo ${entry.name}`}
                              fill
                              sizes="44px"
                              className="object-contain"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-md bg-afro-amber/15 text-sm font-bold text-afro-amber">
                              {entry.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Texte */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-afro-dark transition-colors group-hover/item:text-afro-dark">
                            {entry.name}
                          </p>
                          {entry.description && (
                            <p className="mt-0.5 text-xs text-afro-dark/45">
                              {entry.description}
                            </p>
                          )}
                        </div>

                        {/* Flèche */}
                        {entry.url && (
                          <ArrowUpRight
                            className="h-4 w-4 flex-shrink-0 text-afro-dark/20 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:text-afro-amber"
                            aria-hidden="true"
                          />
                        )}
                      </Tag>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
