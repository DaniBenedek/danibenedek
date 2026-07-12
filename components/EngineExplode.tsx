"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type * as THREE from "three";

type PartKey = "head" | "piston" | "block" | "crank" | "pan";

const parts: { key: PartKey; label: string; assembledY: number; explodedY: number }[] = [
  { key: "head", label: "Hengerfej", assembledY: 0.9, explodedY: 3.4 },
  { key: "piston", label: "Dugattyú + hajtórúd", assembledY: 0.45, explodedY: 1.6 },
  { key: "block", label: "Hengerblokk", assembledY: 0, explodedY: 0 },
  { key: "crank", label: "Forgattyús tengely", assembledY: -0.5, explodedY: -1.6 },
  { key: "pan", label: "Olajteknő", assembledY: -0.95, explodedY: -3.4 },
];

export default function EngineExplode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    let animId: number;
    let disposed = false;
    let st: ScrollTrigger | undefined;

    import("three").then((ThreeLib) => {
      if (disposed) return;

      const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      const scene = new ThreeLib.Scene();
      const camera = new ThreeLib.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(4.2, 0.4, 5.5);
      camera.lookAt(0, 0, 0);

      const mat = new ThreeLib.MeshNormalMaterial({ wireframe: true });
      const meshes: Record<PartKey, THREE.Mesh> = {} as Record<PartKey, THREE.Mesh>;

      const headGeo = new ThreeLib.BoxGeometry(1.6, 0.5, 1.2);
      meshes.head = new ThreeLib.Mesh(headGeo, mat);

      const pistonGeo = new ThreeLib.CylinderGeometry(0.32, 0.32, 1.1, 16);
      meshes.piston = new ThreeLib.Mesh(pistonGeo, mat);

      const blockGeo = new ThreeLib.BoxGeometry(1.8, 1.0, 1.4);
      meshes.block = new ThreeLib.Mesh(blockGeo, mat);

      const crankGeo = new ThreeLib.CylinderGeometry(0.16, 0.16, 2.2, 12);
      meshes.crank = new ThreeLib.Mesh(crankGeo, mat);
      meshes.crank.rotation.z = Math.PI / 2;

      const panGeo = new ThreeLib.BoxGeometry(1.7, 0.4, 1.3);
      meshes.pan = new ThreeLib.Mesh(panGeo, mat);

      parts.forEach((p) => {
        meshes[p.key].position.y = p.assembledY;
        scene.add(meshes[p.key]);
      });

      const resize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);

      let rotY = -0.5;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        rotY += 0.0012;
        const progress = progressRef.current;

        parts.forEach((p) => {
          const mesh = meshes[p.key];
          mesh.position.y = gsap.utils.interpolate(p.assembledY, p.explodedY, progress);
          mesh.rotation.y = rotY;
        });

        renderer.render(scene, camera);
      };
      animate();

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          setActiveIndex(Math.min(parts.length - 1, Math.floor(self.progress * parts.length)));
        },
      });

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
      st?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", height: "100svh", overflow: "hidden", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", right: 0, top: 0, width: "65vw", height: "100%", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, padding: "0 48px", maxWidth: "420px" }}>
        <span style={{ fontSize: "11px", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>
          Robbantott nézet
        </span>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.02em", marginBottom: "32px", lineHeight: 1.1 }}>
          Görgess, és szedd szét.
        </h2>
        <div>
          {parts.map((p, i) => (
            <div key={p.key} style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "12px 0", borderTop: "1px solid var(--border)",
              opacity: activeIndex === i ? 1 : 0.35,
              transition: "opacity 0.3s",
            }}>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "15px", color: "var(--ink)" }}>{p.label}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  );
}