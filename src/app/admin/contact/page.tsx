import { getContactInfos } from "@/lib/actions";
import ContactAdmin from "./ContactAdmin";

export default async function Page() {
  const contacts = await getContactInfos();
  return <ContactAdmin items={JSON.parse(JSON.stringify(contacts))} />;
}
