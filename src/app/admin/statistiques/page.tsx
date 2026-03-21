import { getStats } from "@/lib/actions";
import StatsAdmin from "./StatsAdmin";

export default async function Page() {
  try {
    const stats = await getStats();
    return <StatsAdmin items={JSON.parse(JSON.stringify(stats))} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-serif text-xl font-bold text-red-700">Erreur de chargement</h1>
        <p className="mt-2 text-sm text-red-600">{message}</p>
      </div>
    );
  }
}
