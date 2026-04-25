import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sion Émergence — Lettres d'intention",
  description:
    "Tiers-lieu éducatif et communautaire au Lamentin (Martinique) — Sion Academy, Joy Club & partenaires.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
