import { getTestimonials } from "@/lib/actions";
import TestimonialsAdmin from "./TestimonialsAdmin";

export default async function Page() {
  const testimonials = await getTestimonials();
  return <TestimonialsAdmin items={JSON.parse(JSON.stringify(testimonials))} />;
}
