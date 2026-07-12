"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: "64px",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      background: scrolled ? "rgba(253,251,247,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", letterSpacing: "-0.01em" }}>
        Dani Benedek
      </span>
      <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        {["Projektek","Tapasztalat","Rólam"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="line-link"
            style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {l}
          </a>
        ))}
        <a href="mailto:hello@danibenedek.com" style={{
          fontSize: "13px", padding: "8px 20px",
          border: "1px solid var(--ink)", borderRadius: "100px",
          textDecoration: "none", color: "var(--ink)",
          letterSpacing: "0.04em", textTransform: "uppercase",
          transition: "background 0.2s, color 0.2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--ink)"; (e.currentTarget as HTMLElement).style.color = "var(--bg)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
        >Kapcsolat</a>
      </div>
    </nav>
  );
}
