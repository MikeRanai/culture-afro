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
