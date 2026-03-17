import { getStats } from "@/lib/actions";
import StatsAdmin from "./StatsAdmin";

export default async function Page() {
  const stats = await getStats();
  return <StatsAdmin items={JSON.parse(JSON.stringify(stats))} />;
}
