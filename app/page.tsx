import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EngineExplode from "@/components/EngineExplode";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <EngineExplode />
        <Projects />
        <About />
        <Footer />
      </main>
    </>
  );
}