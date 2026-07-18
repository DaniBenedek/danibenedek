import Link from "next/link";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Cursor />
      <Nav />
      <main style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px", textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(80px, 14vw, 180px)", lineHeight: 1, letterSpacing: "-0.03em" }}>404</span>
        <p style={{ fontSize: "16px", color: "var(--muted)", marginBottom: "32px", maxWidth: "360px" }}>
          Ez az oldal nem létezik — vagy csak most robbant szét, mint egy kiterített motor.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--bg)", background: "var(--ink)", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Vissza a főoldalra
          </Link>
          <Link href="/gallery" style={{ fontSize: "13px", color: "var(--ink)", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", border: "1px solid var(--border)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Gallery
          </Link>
        </div>
      </main>
      
      <Footer />
    </>
  );
}