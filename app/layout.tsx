import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benedek Dani | Mechanikai Tervező & Szoftverfejlesztő Portfólió",
  description: "Benedek Dani portfólió oldala. Mechanikai design (SolidWorks, Fusion 360, Inventor) és webfejlesztés szoftverfejlesztő végzettséggel. CAD tervezés és programozás Makón.",
  metadataBase: new URL("https://danibenedek.com"),
  alternates: { 
    canonical: "https://danibenedek.com" 
  },
  openGraph: {
    title: "Benedek Dani | Mechanikai Tervező & Szoftverfejlesztő",
    description: "CAD mechanikai tervezés (SolidWorks, Fusion 360) és modern webfejlesztés egy helyen. Tekintsd meg a projektjeimet!",
    url: "https://danibenedek.com",
    siteName: "Benedek Dani Portfólió",
    images: [
      {
        url: "/og-image.png", // Készíts egy 1200x630-as képet az oldalszerkezetről és tedd a public/ mappába ezen a néven!
        width: 1200,
        height: 630,
        alt: "Benedek Dani Portfólió - Mechanikai Design & Webfejlesztés",
      },
    ],
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benedek Dani | Mechanikai Tervező & Szoftverfejlesztő",
    description: "CAD mechanikai tervezés és webfejlesztés szoftverfejlesztő végzettséggel.",
    images: ["/og-image.png"],
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Benedek Dani", "mechanikai design", "SolidWorks", "Fusion 360", "Inventor", 
    "CAD tervezés", "CAD tervező", "szoftverfejlesztő", "webfejlesztő", "frontend", 
    "diákmunka", "Makó", "portfólió", "számítógépes tervezés"
  ],
  icons: {
    icon: "/favicon.ico", // Ellenőrizd, hogy a public mappában van-e favicon
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Opcionális, ha van apple ikonod
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body className="antialiased">{children}</body>
    </html>
  );
}