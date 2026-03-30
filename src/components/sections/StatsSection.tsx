import { Users, CalendarDays, MapPin, Award, Heart, Star, TrendingUp, Globe } from "lucide-react";

type StatData = {
  id: string;
  value: string;
  label: string;
  icon: string;
  color: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, CalendarDays, MapPin, Award, Heart, Star, TrendingUp, Globe,
};

const fallbackStats: StatData[] = [
  { id: "1", icon: "Heart", value: "100%", label: "Ateliers gratuits et accessibles", color: "amber" },
  { id: "2", icon: "CalendarDays", value: "40+", label: "Ateliers organisés", color: "gold" },
  { id: "3", icon: "MapPin", value: "Tout le territoire", label: "Festivals, pop-up, quartiers", color: "tangerine" },
  { id: "4", icon: "Star", value: "Chaque mois", label: "Ateliers BarreF le 1er samedi", color: "amber" },
];

const colorClasses: Record<string, { text: string; bg: string }> = {
  orange: { text: "text-afro-orange", bg: "bg-afro-orange/15" },
  magenta: { text: "text-afro-magenta", bg: "bg-afro-magenta/15" },
  amber: { text: "text-afro-amber", bg: "bg-afro-amber/15" },
  tangerine: { text: "text-afro-tangerine", bg: "bg-afro-tangerine/15" },
  gold: { text: "text-afro-gold", bg: "bg-afro-gold/15" },
  navy: { text: "text-white", bg: "bg-white/10" },
};

export default function StatsSection({ stats }: { stats?: StatData[] }) {
  const data = stats && stats.length > 0 ? stats : fallbackStats;

  return (
    <section aria-label="Chiffres clés" className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-10 shadow-xl sm:px-10 md:py-14"
          style={{ background: "linear-gradient(135deg, #fd9a00 0%, #feb801 100%)" }}
        >
          {/* Motif décoratif léger */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(0,0,0,0.2) 30px, rgba(0,0,0,0.2) 32px), repeating-linear-gradient(-60deg, transparent, transparent 30px, rgba(0,0,0,0.2) 30px, rgba(0,0,0,0.2) 32px)",
            }}
          />
          <div className="relative">
            <div className={`grid gap-8 lg:gap-6 ${data.length <= 2 ? "grid-cols-1 sm:grid-cols-2 mx-auto max-w-2xl" : "grid-cols-2 lg:grid-cols-4"}`}>
              {data.map((s) => {
                const Icon = iconMap[s.icon] || Users;
                const colors = colorClasses[s.color] || colorClasses.amber;
                return (
                  <div key={s.id} className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-afro-dark/10">
                      <Icon className="h-6 w-6 text-afro-dark/70" aria-hidden="true" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-afro-dark sm:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-afro-dark/60">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
