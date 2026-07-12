"use client";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animId: number;
    import("three").then((THREE) => {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.z = 3;
      const geo = new THREE.IcosahedronGeometry(1.2, 1);
      const mat = new THREE.MeshNormalMaterial({ wireframe: true, opacity: 0.55, transparent: true });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      const resize = () => { renderer.setSize(canvas.clientWidth, canvas.clientHeight); camera.aspect = canvas.clientWidth / canvas.clientHeight; camera.updateProjectionMatrix(); };
      window.addEventListener("resize", resize);
      const animate = () => { animId = requestAnimationFrame(animate); mesh.rotation.x += 0.004; mesh.rotation.y += 0.007; renderer.render(scene, camera); };
      animate();
      return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); renderer.dispose(); };
    });
    return () => cancelAnimationFrame(animId);
  }, []);

  const tags = ["SolidWorks","·","Fusion 360","·","Inventor","·","GSAP","·","Three.js","·","Next.js","·","Angol B2/C1","·","Makó HU","·","Diákmunka 2025","·"];

  return (
    <section style={{ minHeight: "100svh", padding: "0 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>

      {/* Three.js canvas – jobb oldal */}
      <canvas ref={canvasRef} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "50vw", height: "80vh", pointerEvents: "none" }} />

      {/* Meta sor */}
      <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", marginTop: "80px" }}>
        {/* <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)", display: "inline-block" }} /> */}
        {/* <span style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Elérhető nyári munkára</span> */}
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{time} · Makó, HU</span>
      </div>

      {/* Nagy cím */}
      <h1 className="fade-up delay-1" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(64px, 11vw, 160px)", lineHeight: 0.88, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: "40px" }}>
        MECHANICAL<br /><em style={{ fontStyle: "italic" }}>DESIGNER</em><br />&amp; DEVELOPER
      </h1>

      <p className="fade-up delay-2" style={{ maxWidth: "400px", fontSize: "16px", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, marginBottom: "48px" }}>
        19 éves fejlesztő és mechanikai tervező. SolidWorks, Fusion 360, Inventor — és a weben is itthon vagyok. Szoftverfejlesztő végzettség, 4 éve dolgozom nyaranként.
      </p>

      <div className="fade-up delay-3" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="#projektek" style={{ fontSize: "13px", color: "var(--bg)", background: "var(--ink)", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--accent)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--ink)"}>
          Projektek ↓
        </a>
        <a href="/cv-benedek-dani.pdf" style={{ fontSize: "13px", color: "var(--ink)", padding: "14px 32px", borderRadius: "100px", textDecoration: "none", border: "1px solid var(--border)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          CV ↗
        </a>
      </div>

      {/* Marquee alul */}
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
