import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
  weight: ['600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Association Culture Afro | Éducation Capillaire à La Réunion",
  description: "Révélez la beauté de vos boucles naturelles. Éducation capillaire et loisirs créatifs afro à La Réunion.",
  verification: {
    google: "QURsNRlnqEzCOs3nJZoycCljXDAhhwo7ZcQLzVnmbDc",
  },
  icons: {
    icon: "/images/logo-culture-afro.svg",
    apple: "/images/logo-culture-afro.svg",
  },
  openGraph: {
    title: "Association Culture Afro | Éducation Capillaire à La Réunion",
    description: "Révélez la beauté de vos boucles naturelles. Éducation capillaire et loisirs créatifs afro à La Réunion.",
    url: "https://cultureafro.re",
    siteName: "Association Culture Afro",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/hero-img.webp",
        width: 1200,
        height: 1200,
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
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans scrollbar-thin overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
