import { getSocialLinks } from "@/lib/actions";
import SocialsAdmin from "./SocialsAdmin";

export default async function Page() {
  const socialLinks = await getSocialLinks();
  return <SocialsAdmin items={JSON.parse(JSON.stringify(socialLinks))} />;
}
