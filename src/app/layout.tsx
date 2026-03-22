import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

// Police pour le corps du texte
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
});

// Police élégante pour les titres (Stature professionnelle)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Police cursive/manuscrite pour les accents éditoriaux
const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: '--font-handwriting',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.assocultureafro.fr"),
  title: "Association Culture Afro | Éducation Capillaire à La Réunion",
  description: "Révélez la beauté de vos boucles naturelles. Éducation capillaire et loisirs créatifs afro à La Réunion.",
  verification: {
    google: "QURsNRlnqEzCOs3nJZoycCljXDAhhwo7ZcQLzVnmbDc",
  },
  icons: {
    icon: "/images/logo-culture-afro.svg",
    apple: "/images/logo-culture-afro.svg",
  },
  other: {
    "theme-color": "#e96a35",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Association Culture Afro | Éducation Capillaire à La Réunion",
    description: "Révélez la beauté de vos boucles naturelles. Éducation capillaire et loisirs créatifs afro à La Réunion.",
    url: "https://www.assocultureafro.fr",
    siteName: "Association Culture Afro",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/hero-img.webp",
        width: 1200,
        height: 630,
        alt: "Association Culture Afro - Éducation capillaire à La Réunion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Association Culture Afro | Éducation Capillaire à La Réunion",
    description: "Révélez la beauté de vos boucles naturelles. Éducation capillaire et loisirs créatifs afro à La Réunion.",
    images: ["/images/hero-img.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${dancing.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Association Culture Afro",
              url: "https://www.assocultureafro.fr",
              logo: "https://www.assocultureafro.fr/images/logo-culture-afro.svg",
              description:
                "Éducation capillaire et loisirs créatifs afro à La Réunion. Association loi 1901 dédiée à l'éducation populaire.",
              foundingDate: "2017-07-04",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Saint-Denis",
                addressRegion: "La Réunion",
                addressCountry: "FR",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "associationcultureafro@gmail.com",
                telephone: "+262692259007",
                contactType: "customer service",
                availableLanguage: "French",
              },
              sameAs: [
                "https://www.instagram.com/assocultureafro/",
                "https://www.facebook.com/assocultureafro/",
                "https://www.tiktok.com/@assocultureafro",
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans scrollbar-thin overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
