"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "center",
      padding: scrolled ? "0" : "20px 24px",
      transition: "padding 0.5s cubic-bezier(0.16,1,0.3,1)",
      pointerEvents: "none",
    }}>
      <nav style={{
        pointerEvents: "auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: scrolled ? "100%" : "min(1040px, 94vw)",
        padding: scrolled ? "0 48px" : "0 28px",
        height: "60px",
        borderRadius: scrolled ? "0px" : "100px",
        
        // JAVÍTÁS: Külön kezeljük a kereteket, így nincs ütközés és hibaüzenet
        borderTop: scrolled ? "1px solid transparent" : "1px solid var(--border)",
        borderLeft: scrolled ? "1px solid transparent" : "1px solid var(--border)",
        borderRight: scrolled ? "1px solid transparent" : "1px solid var(--border)",
        borderBottom: "1px solid var(--border)", // Ez mindkét állapotban ugyanaz, így maradhat fixen
        
        background: scrolled ? "rgba(253,251,247,0.92)" : "rgba(253,251,247,0.7)",
        backdropFilter: "blur(14px)",
        boxShadow: scrolled ? "none" : "0 8px 30px rgba(26,26,26,0.06)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <Link href="/" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", letterSpacing: "-0.01em", textDecoration: "none", color: "var(--ink)" }}>
          Dani Benedek
        </Link>
        <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          <a href="/#projektek" className="line-link" style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Projektek</a>
          <Link href="/gallery/" className="line-link" style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Gallery</Link>
          <a href="/#rólam" className="line-link" style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Rólam</a>
          <a data-magnetic href="mailto:hello@danibenedek.com" style={{
            fontSize: "13px", padding: "8px 20px",
            border: "1px solid var(--ink)", borderRadius: "100px",
            textDecoration: "none", color: "var(--ink)",
            letterSpacing: "0.04em", textTransform: "uppercase",
            transition: "background 0.2s, color 0.2s", display: "inline-block", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--ink)"; (e.currentTarget as HTMLElement).style.color = "var(--bg)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
          >Kapcsolat</a>
        </div>
      </nav>
    </div>
  );
}