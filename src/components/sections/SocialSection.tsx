import { Instagram, Facebook, ArrowUpRight } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11z" />
    </svg>
  );
}

type SocialLinkData = {
  id: string;
  platform: string;
  handle: string;
  url: string;
};

const platformConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverBg: string;
}> = {
  Instagram: { icon: Instagram, color: "from-[#f09433] via-[#dc2743] to-[#bc1888]", hoverBg: "hover:bg-[#E1306C]" },
  Facebook: { icon: Facebook, color: "from-[#1877F2] to-[#0C5DC7]", hoverBg: "hover:bg-[#1877F2]" },
  TikTok: { icon: TikTokIcon, color: "from-[#000000] via-[#25F4EE] to-[#FE2C55]", hoverBg: "hover:bg-[#000000]" },
  YouTube: { icon: Instagram, color: "from-[#FF0000] to-[#CC0000]", hoverBg: "hover:bg-[#FF0000]" },
  Twitter: { icon: Instagram, color: "from-[#1DA1F2] to-[#0C85D0]", hoverBg: "hover:bg-[#1DA1F2]" },
  LinkedIn: { icon: Instagram, color: "from-[#0077B5] to-[#005E93]", hoverBg: "hover:bg-[#0077B5]" },
};

const fallbackSocials: SocialLinkData[] = [
  { id: "1", platform: "Instagram", handle: "@assocultureafro", url: "https://www.instagram.com/assocultureafro/" },
  { id: "2", platform: "Facebook", handle: "assocultureafro", url: "https://www.facebook.com/assocultureafro/" },
  { id: "3", platform: "TikTok", handle: "@assocultureafro", url: "https://www.tiktok.com/@assocultureafro" },
];

export default function SocialSection({
  socialLinks,
}: {
  socialLinks?: SocialLinkData[];
}) {
  const data = socialLinks && socialLinks.length > 0 ? socialLinks : fallbackSocials;

  return (
    <section
      id="communaute"
      aria-labelledby="social-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-3 inline-block rounded-full bg-afro-magenta/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-magenta">
          Restons connectés
        </span>
        <h2
          id="social-title"
          className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
        >
          Suivez-nous
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-afro-dark/60">
          Retrouvez nos ateliers, nos événements sur le terrain — festivals,
          pop-up, journées découvertes — et toute l&apos;actualité de
          l&apos;association sur nos réseaux.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {data.map((s) => {
            const config = platformConfig[s.platform] || platformConfig.Instagram;
            const Icon = config.icon;
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex min-h-[44px] items-center gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${config.hoverBg} hover:text-white`}
                aria-label={`Suivez-nous sur ${s.platform}`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.color} text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-afro-dark group-hover:text-white">
                    {s.platform}
                  </p>
                  <p className="text-sm text-afro-dark/60 group-hover:text-white/80">
                    {s.handle}
                  </p>
                </div>
                <ArrowUpRight
                  className="ml-auto h-5 w-5 text-afro-dark/30 transition-all duration-300 group-hover:text-white"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
