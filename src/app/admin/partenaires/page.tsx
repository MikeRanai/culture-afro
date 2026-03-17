import { getPartners } from "@/lib/actions";
import PartnersAdmin from "./PartnersAdmin";

export default async function Page() {
  const partners = await getPartners();
  return <PartnersAdmin items={JSON.parse(JSON.stringify(partners))} />;
}
