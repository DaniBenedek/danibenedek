import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benedek Dani – Mechanikai designer & developer",
  description: "SolidWorks, Fusion 360, Inventor, web. Szoftverfejlesztő végzettség, 4 éves munkatapasztalat, folyékony angol. Nyári diákmunkára elérhető.",
  metadataBase: new URL("https://danibenedek.com"),
  alternates: { canonical: "https://danibenedek.com" },
  openGraph: {
    title: "Benedek Dani – Mechanikai designer & developer",
    description: "SolidWorks, Fusion 360, Inventor, web. Nyári diákmunkára elérhető – Makó.",
    url: "https://danibenedek.com",
    siteName: "danibenedek.com",
    locale: "hu_HU",
    type: "website",
  },
  robots: { index: true, follow: true },
  keywords: ["mechanikai design", "SolidWorks", "Fusion 360", "Inventor", "CAD", "webfejlesztő", "diákmunka", "Makó"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
