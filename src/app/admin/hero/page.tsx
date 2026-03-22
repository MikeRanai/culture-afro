import { getHeroBanner } from "@/lib/actions";
import HeroAdmin from "./HeroAdmin";

export default async function HeroPage() {
  const hero = await getHeroBanner();

  const data = hero
    ? {
        image: hero.image,
        subtitle: hero.subtitle,
        quote: hero.quote,
        ctaLabel1: hero.ctaLabel1,
        ctaLink1: hero.ctaLink1,
        ctaLabel2: hero.ctaLabel2,
        ctaLink2: hero.ctaLink2,
        decorWord: hero.decorWord,
      }
    : null;

  return <HeroAdmin initial={data} />;
}
