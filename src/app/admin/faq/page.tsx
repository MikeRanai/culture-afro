import { getFaqs } from "@/lib/actions";
import FaqAdmin from "./FaqAdmin";

export default async function Page() {
  const faqs = await getFaqs();
  return <FaqAdmin items={JSON.parse(JSON.stringify(faqs))} />;
}
