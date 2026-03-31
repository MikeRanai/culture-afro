import { getSiteSettings } from "@/lib/actions";
import PartageAdmin from "./PartageAdmin";

export default async function PartagePage() {
  const settings = await getSiteSettings();

  const data = settings
    ? {
        ogImage: settings.ogImage,
        ogTitle: settings.ogTitle,
        ogDescription: settings.ogDescription,
      }
    : null;

  return <PartageAdmin initial={data} />;
}
