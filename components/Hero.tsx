"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import type * as THREE from "three";
import RevCounter from "./RevCounter";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLElement>(null);
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
    let disposed = false;

    import("three").then((ThreeLib) => {
      if (disposed) return;
      const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      const scene = new ThreeLib.Scene();
      const camera = new ThreeLib.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(3.5, 1.8, 4.5);
      camera.lookAt(0, 0, 0);

      const rig = new ThreeLib.Group();
      scene.add(rig);

      const matMetal = new ThreeLib.MeshNormalMaterial({ wireframe: true });

      const crank = new ThreeLib.Mesh(new ThreeLib.CylinderGeometry(0.15, 0.15, 2.4, 12), matMetal);
      crank.rotation.z = Math.PI / 2;
      rig.add(crank);

      const cylinderCount = 3;
      const pistons: THREE.Mesh[] = [];
      const cylinders: THREE.Mesh[] = [];

      for (let i = 0; i < cylinderCount; i++) {
        const offsetX = (i - 1) * 0.9;

        const cyl = new ThreeLib.Mesh(new ThreeLib.CylinderGeometry(0.35, 0.35, 1.6, 16, 1, true), matMetal);
        cyl.position.set(offsetX, 1.0, 0);
        rig.add(cyl);
        cylinders.push(cyl);

        const piston = new ThreeLib.Mesh(new ThreeLib.CylinderGeometry(0.32, 0.32, 0.4, 16), matMetal);
        piston.position.set(offsetX, 1.0, 0);
        rig.add(piston);
        pistons.push(piston);

        const rod = new ThreeLib.Mesh(new ThreeLib.CylinderGeometry(0.05, 0.05, 1, 6), matMetal);
        rod.position.set(offsetX, 0.5, 0);
        rig.add(rod);
      }

      const flywheel = new ThreeLib.Mesh(new ThreeLib.TorusGeometry(0.9, 0.12, 8, 24), matMetal);
      flywheel.position.set(1.8, 0, 0);
      flywheel.rotation.y = Math.PI / 2;
      rig.add(flywheel);

      rig.rotation.y = -0.4;
      rig.scale.setScalar(0.85);

      const resize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);

      let crankAngle = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        crankAngle += 0.06;
        crank.rotation.x = crankAngle;
        flywheel.rotation.x = crankAngle;

        pistons.forEach((piston, i) => {
          const phase = crankAngle + (i * (Math.PI * 2)) / cylinderCount;
          piston.position.y = 1.0 + Math.sin(phase) * 0.35;
        });

        rig.rotation.y += 0.0015;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        disposed = true;
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", resize);
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
    };
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
      <canvas ref={canvasRef} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "50vw", height: "80vh", pointerEvents: "none" }} />

      <div className="hero-meta" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px", marginTop: "80px" }}>
        <RevCounter />
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