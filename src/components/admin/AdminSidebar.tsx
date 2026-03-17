"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareQuote,
  HelpCircle,
  Share2,
  BarChart3,
  Handshake,
  Phone,
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";

const navItems = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Témoignages", href: "/admin/temoignages", icon: MessageSquareQuote },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Réseaux sociaux", href: "/admin/reseaux-sociaux", icon: Share2 },
  { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
  { label: "Partenaires", href: "/admin/partenaires", icon: Handshake },
  { label: "Contact", href: "/admin/contact", icon: Phone },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const navContent = (
    <nav aria-label="Navigation admin" className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-afro-orange/10 text-afro-orange"
                : "text-afro-dark/60 hover:bg-afro-dark/5 hover:text-afro-dark"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const bottomActions = (
    <div className="border-t border-afro-dark/10 p-4">
      <Link
        href="/"
        className="flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm text-afro-dark/60 transition-colors hover:bg-afro-dark/5 hover:text-afro-dark"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour au site
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="mt-1 flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500/70 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-afro-dark/10 bg-afro-light px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark transition-colors hover:bg-afro-dark/5"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="font-serif text-lg font-semibold text-afro-dark">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-1 rounded-xl px-3 py-2 text-sm text-afro-dark/60 transition-colors hover:text-afro-dark"
          >
            <ChevronLeft className="h-4 w-4" />
            Site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-red-500/60 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile slide-out */}
      <aside
        className={`fixed left-0 top-0 z-30 flex h-full w-72 transform flex-col bg-afro-light shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-afro-dark/10 px-4 py-4">
          <img
            src="/images/logo-culture-afro.svg"
            alt="Logo"
            className="h-10 w-auto"
            width={40}
            height={40}
          />
          <span className="font-serif text-lg font-semibold text-afro-dark">
            Culture Afro
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">{navContent}</div>
        {bottomActions}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-afro-dark/10 lg:bg-afro-light">
        <div className="flex items-center gap-3 border-b border-afro-dark/10 px-4 py-4">
          <img
            src="/images/logo-culture-afro.svg"
            alt="Logo"
            className="h-10 w-auto"
            width={40}
            height={40}
          />
          <span className="font-serif text-lg font-semibold text-afro-dark">
            Culture Afro
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">{navContent}</div>
        {bottomActions}
      </aside>
    </>
  );
}
