import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Gallery from "@/components/gallery";
import Footer from "@/components/Footer";

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