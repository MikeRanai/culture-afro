"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-5xl font-bold text-afro-dark">Oups</h1>
      <p className="mt-4 text-lg text-afro-dark/60">
        Une erreur inattendue est survenue.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-afro-orange px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
      >
        Réessayer
      </button>
    </main>
  );
}
