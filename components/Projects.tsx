"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const projects = [
  { num: "01", title: "Robbantott motor", sub: "CAD · SolidWorks", desc: "Hamarosan — robbantott nézet animációval, interaktív alkatrész-kiemeléssel.", type: "cad", placeholder: true },
  { num: "02", title: "CAD projekt #2", sub: "Fusion 360 · Assembly", desc: "Ide kerül a Fusion 360 projekted — assembly vagy alkatrész GLB renderrel.", type: "cad", placeholder: true },
  { num: "03", title: "Kémény Technika Kft.", sub: "Web · Frontend", desc: "Elkészített weboldal — kemenytechnikakft.com", url: "https://kemenytechnikakft.com", type: "web", placeholder: false },
  { num: "04", title: "Danijel Scarving Art", sub: "Web · Design", desc: "Elkészített weboldal — danijelscarvingart.hu", url: "https://danijelscarvingart.hu", type: "web", placeholder: false },
];

export default function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.fromTo(card, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-panel").forEach((panel) => {
        gsap.fromTo(panel, { scaleY: 1 }, {
          scaleY: 0, duration: 1, ease: "power4.inOut",
          scrollTrigger: { trigger: panel, start: "top 80%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".proj-num").forEach((el) => {
        const target = parseInt(el.textContent || "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => { el.textContent = String(Math.floor(obj.val)).padStart(2, "0"); },
        });
      });

      gsap.utils.toArray<HTMLElement>(".tilt-card").forEach((card) => {
        const rotX = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power3" });
        const rotY = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power3" });
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          rotY(px * 10);
          rotX(-py * 10);
        };
        const onLeave = () => { rotX(0); rotY(0); };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="projektek" style={{ padding: "120px 48px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "80px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em" }}>
          Selected<br /><em>Work</em>
        </h2>
        <span style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>04 projekt</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginBottom: "2px" }}>
        {projects.filter(p => p.type === "cad").map(p => (
          <div key={p.num} className="project-card tilt-card" style={{ position: "relative", background: "#f0ede8", aspectRatio: "4/3", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px", overflow: "hidden", transformStyle: "preserve-3d", willChange: "transform" }}>
            <span className="proj-num" style={{ position: "absolute", top: 24, left: 32, fontSize: "13px", color: "var(--muted)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em" }}>
              {p.num}
            </span>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 80, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
              <div style={{ width: 64, height: 64, border: "1.5px dashed #aaa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <span style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {p.num === "01" ? "GLB modell · hamarosan" : "Kép · hamarosan"}
              </span>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{p.sub}</span>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.02em" }}>{p.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        {projects.filter(p => p.type === "web").map(p => (
          <div key={p.num} className="project-card" style={{ background: "#f0ede8", position: "relative" }}>
            <span className="proj-num" style={{ position: "absolute", top: 16, left: 20, fontSize: "13px", color: "var(--bg)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em", zIndex: 2 }}>
              {p.num}
            </span>
            <div className="reveal-mask" style={{ position: "relative", height: "340px", overflow: "hidden", background: "#e8e4dc" }}>
              <iframe src={p.url} style={{ width: "200%", height: "200%", transform: "scale(0.5)", transformOrigin: "top left", border: "none", pointerEvents: "none" }} loading="lazy" title={p.title} />
              <div className="reveal-panel" style={{ position: "absolute", inset: 0, background: "var(--ink)", transformOrigin: "top" }} />
              <a data-magnetic href={p.url} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "16px", textDecoration: "none" }}>
                <span style={{ fontSize: "12px", background: "var(--ink)", color: "var(--bg)", padding: "6px 14px", borderRadius: "100px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Megnyitás ↗</span>
              </a>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>{p.sub}</span>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", letterSpacing: "-0.02em" }}>{p.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "6px" }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}