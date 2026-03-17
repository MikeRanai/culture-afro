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
  { id: "1", icon: "Users", value: "150+", label: "Membres actifs", color: "orange" },
  { id: "2", icon: "CalendarDays", value: "40+", label: "Ateliers gratuits organisés", color: "magenta" },
  { id: "3", icon: "MapPin", value: "Tout le territoire", label: "Festivals, pop-up, quartiers", color: "orange" },
  { id: "4", icon: "Award", value: "2022", label: "Année de création", color: "magenta" },
];

export default function StatsSection({ stats }: { stats?: StatData[] }) {
  const data = stats && stats.length > 0 ? stats : fallbackStats;

  return (
    <section aria-label="Chiffres clés" className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-afro-dark px-6 py-10 shadow-xl sm:px-10 md:py-14">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
            {data.map((s) => {
              const Icon = iconMap[s.icon] || Users;
              const colorClass = s.color === "magenta" ? "text-afro-magenta" : "text-afro-orange";
              return (
                <div key={s.id} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Icon className={`h-6 w-6 ${colorClass}`} aria-hidden="true" />
                  </div>
                  <p className={`font-serif text-2xl font-bold sm:text-3xl ${colorClass}`}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
