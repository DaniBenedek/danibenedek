"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import TrackAnimation from "./TrackAnimation";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.set(".hero-line", { yPercent: 110 })
        .set([".hero-meta", ".hero-sub", ".hero-cta"], { opacity: 0, y: 24 })
        .to(".hero-line", { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.15)
        .to(".hero-meta", { opacity: 1, y: 0, duration: 0.7 }, 0)
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.7 }, 0.7)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7 }, 0.85);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const tags = ["SolidWorks","·","Fusion 360","·","Inventor","·","GSAP","·","Three.js","·","Next.js","·","Motorsport","·","Makó HU","·"];

  return (
    <section ref={rootRef} style={{ minHeight: "100svh", padding: "0 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "48vw", height: "70vh", pointerEvents: "none" }}>
        <TrackAnimation />
      </div>

      <div className="hero-meta" style={{ display: "flex", alignItems: "center", marginBottom: "32px", marginTop: "80px" }}>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{time} · Makó, HU</span>
      </div>

      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(64px, 11vw, 160px)", lineHeight: 0.88, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "40px" }}>
        <span style={{ display: "block", overflow: "hidden" }}><span className="hero-line" style={{ display: "block" }}>MECHANICAL</span></span>
        <span style={{ display: "block", overflow: "hidden" }}><span className="hero-line" style={{ display: "block", fontStyle: "italic" }}>DESIGNER</span></span>
        <span style={{ display: "block", overflow: "hidden" }}><span className="hero-line" style={{ display: "block" }}>&amp; DEVELOPER</span></span>
      </h1>

      <p className="hero-sub" style={{ maxWidth: "400px", fontSize: "16px", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, marginBottom: "48px" }}>
        19 éves fejlesztő és mechanikai tervező Makóról. SolidWorks-től Three.js-ig — és ha épp nem tervezek, valószínűleg egy Forma-1 futamot nézek.
      </p>

      <div className="hero-cta" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a data-magnetic href="#projektek" style={{ fontSize: "13px", color: "var(--bg)", background: "var(--ink)", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", display: "inline-block" }}>
          Projektek ↓
        </a>
        <a data-magnetic href="/gallery" style={{ fontSize: "13px", color: "var(--ink)", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", border: "1px solid var(--border)", letterSpacing: "0.04em", textTransform: "uppercase", display: "inline-block" }}>
          Gallery ↗
        </a>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid var(--border)", padding: "14px 0", overflow: "hidden" }}>
        <div className="marquee-inner" style={{ display: "flex", gap: "40px", width: "max-content" }}>
          {[...tags, ...tags].map((t, i) => (
            <span key={i} style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: t === "·" ? "var(--accent)" : "var(--muted)", whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}