import Link from "next/link";
import {
  MessageSquareQuote,
  HelpCircle,
  Share2,
  BarChart3,
  Handshake,
  Phone,
  ArrowRight,
} from "lucide-react";
import { getDashboardCounts } from "@/lib/actions";

const sections = [
  { label: "Témoignages", href: "/admin/temoignages", icon: MessageSquareQuote, key: "testimonials" as const, color: "bg-afro-orange/10 text-afro-orange" },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle, key: "faqs" as const, color: "bg-afro-magenta/10 text-afro-magenta" },
  { label: "Réseaux sociaux", href: "/admin/reseaux-sociaux", icon: Share2, key: "socialLinks" as const, color: "bg-blue-100 text-blue-600" },
  { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3, key: "stats" as const, color: "bg-green-100 text-green-600" },
  { label: "Partenaires", href: "/admin/partenaires", icon: Handshake, key: "partners" as const, color: "bg-purple-100 text-purple-600" },
  { label: "Contact", href: "/admin/contact", icon: Phone, key: "contacts" as const, color: "bg-amber-100 text-amber-600" },
];

export default async function AdminDashboard() {
  const counts = await getDashboardCounts();

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-afro-dark sm:text-3xl">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-afro-dark/60">
          Gerez le contenu de votre site Culture Afro
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.color}`}
            >
              <s.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-afro-dark">{s.label}</p>
              <p className="text-2xl font-bold text-afro-dark">
                {counts[s.key]}
              </p>
            </div>
            <ArrowRight
              className="h-5 w-5 shrink-0 text-afro-dark/20 transition-transform group-hover:translate-x-1 group-hover:text-afro-dark/40"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </>
  );
}
