import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-6xl font-bold text-afro-dark">404</h1>
      <p className="mt-4 text-lg text-afro-dark/60">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-afro-magenta px-6 py-3 font-semibold text-white shadow-lg shadow-afro-magenta/25 transition-all duration-300 hover:scale-105"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
