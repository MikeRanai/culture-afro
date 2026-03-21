import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type DirectoryEntry = {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string | null;
  category: string;
};

const categoryLabels: Record<string, string> = {
  salons: "Salons & Coiffeuses",
  produits: "Produits & Soins",
};

export default function DirectorySection({ entries }: { entries: DirectoryEntry[] }) {
  const salons = entries.filter((e) => e.category === "salons");
  const produits = entries.filter((e) => e.category === "produits");

  if (entries.length === 0) return null;

  return (
    <section id="annuaire" className="bg-[#2c2825]" aria-labelledby="annuaire-title">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
        {/* En-tête */}
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
          Notre réseau
        </p>
        <h2
          id="annuaire-title"
          className="mt-4 font-serif text-3xl font-normal text-white sm:text-4xl md:text-5xl"
        >
          L&apos;Annuaire du Cheveu{" "}
          <span className="font-handwriting text-[1.15em] not-italic text-afro-orange">
            Texturé
          </span>
        </h2>

        {/* Grille deux colonnes */}
        <div className="mt-14 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
          {[salons, produits].map((group, gi) => {
            const catKey = gi === 0 ? "salons" : "produits";
            if (group.length === 0) return null;
            return (
              <div key={catKey}>
                <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.3em] text-white/25">
                  {categoryLabels[catKey]}
                </p>
                <div className="flex flex-col">
                  {group.map((entry, i) => {
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
                        className={`group flex items-center gap-6 py-5 transition-colors hover:bg-white/[0.03] ${
                          i !== group.length - 1 ? "border-b border-white/8" : ""
                        } ${entry.url ? "cursor-pointer" : "cursor-default"}`}
                      >
                        {/* Logo */}
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm border border-white/10 bg-white p-1">
                          {entry.logo ? (
                            <Image
                              src={entry.logo}
                              alt={`Logo ${entry.name}`}
                              fill
                              sizes="48px"
                              className="object-contain"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#2c2825]/40">
                              {entry.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Texte */}
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-semibold text-white transition-colors group-hover:text-afro-orange">
                            {entry.name}
                          </p>
                          {entry.description && (
                            <p className="mt-0.5 text-sm text-white/35">
                              {entry.description}
                            </p>
                          )}
                        </div>

                        {/* Flèche */}
                        {entry.url && (
                          <ArrowUpRight
                            className="h-4 w-4 flex-shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-afro-orange"
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
