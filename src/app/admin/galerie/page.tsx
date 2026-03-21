import { getGalleryImages } from "@/lib/actions";
import GalleryAdmin from "./GalleryAdmin";

export default async function Page() {
  const images = await getGalleryImages();
  return <GalleryAdmin items={JSON.parse(JSON.stringify(images))} />;
}
