"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ContactPeek from "./ContactPeek";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);

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
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: scrolled ? "100%" : "min(1040px, 94vw)",
        padding: scrolled ? "0 48px" : "0 28px",
        height: "60px",
        borderRadius: scrolled ? "0px" : "100px",
        border: "1px solid var(--border)",
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
          <Link href="/gallery" className="line-link" style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Gallery</Link>
          <a href="/#rólam" className="line-link" style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Rólam</a>

          <button
            data-magnetic
            onClick={() => setPeekOpen((v) => !v)}
            style={{
              fontSize: "13px", padding: "8px 20px",
              border: "1px solid var(--ink)", borderRadius: "100px",
              background: peekOpen ? "var(--ink)" : "transparent",
              color: peekOpen ? "var(--bg)" : "var(--ink)",
              letterSpacing: "0.04em", textTransform: "uppercase",
              cursor: "pointer", transition: "background 0.2s, color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            Kapcsolat
          </button>
        </div>

        {peekOpen && <ContactPeek onClose={() => setPeekOpen(false)} />}
      </nav>
    </div>
  );
}