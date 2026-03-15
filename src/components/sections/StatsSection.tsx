import { Users, CalendarDays, MapPin, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "150+",
    label: "Membres actifs",
    color: "text-afro-orange",
  },
  {
    icon: CalendarDays,
    value: "40+",
    label: "Ateliers gratuits organisés",
    color: "text-afro-magenta",
  },
  {
    icon: MapPin,
    value: "Tout le territoire",
    label: "Festivals, pop-up, quartiers",
    color: "text-afro-orange",
  },
  {
    icon: Award,
    value: "2022",
    label: "Année de création",
    color: "text-afro-magenta",
  },
];

export default function StatsSection() {
  return (
    <section aria-label="Chiffres clés" className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-afro-dark px-6 py-10 shadow-xl sm:px-10 md:py-14">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <s.icon
                    className={`h-6 w-6 ${s.color}`}
                    aria-hidden="true"
                  />
                </div>

                <p
                  className={`font-serif text-2xl font-bold sm:text-3xl ${s.color}`}
                >
                  {s.value}
                </p>

                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
