import { getPoles } from "@/lib/actions";
import PolesAdmin from "./PolesAdmin";

export default async function Page() {
  const poles = await getPoles();
  return <PolesAdmin items={JSON.parse(JSON.stringify(poles))} />;
}
