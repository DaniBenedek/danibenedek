import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Gallery from "@/components/gallery";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Galéria | Benedek Dani",
  description: "Fotók, behind the scenes pillanatok és CAD renderek Benedek Dani munkáiból és mindennapjaiból.",
  alternates: { canonical: "https://danibenedek.com/gallery/" },
};

export default function GalleryPage() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Gallery />
      </main>
      <Footer />
    </>
  );
}