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

    // Megadjuk az objektumot, ahova az alkatrészek referenciáit mentjük
    const meshes: Record<string, THREE.Object3D> = {};
    let mainEngineModel: THREE.Group | null = null;

    // Háttérben töltjük be a Three.js-t és a betöltőt egyszerre
    Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js")
    ]).then(([ThreeLib, GLTFModule]) => {
      if (disposed) return;

      // 1. Renderer és Scene beállítása
      const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      const scene = new ThreeLib.Scene();
      const camera = new ThreeLib.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(4.2, 0.4, 5.5);
      camera.lookAt(0, 0, 0);

      // 2. Fények (Kötelező a GLB fájlokhoz!)
      const ambientLight = new ThreeLib.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const dirLight = new ThreeLib.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      // 3. Modell betöltése a megadott mappából
      const loader = new GLTFModule.GLTFLoader();
      
      loader.load(
        "/models/sputnikjfkennedy-engine-4331.glb",
        (gltf) => {
          if (disposed) return;

          mainEngineModel = gltf.scene;
          mainEngineModel.scale.set(1.5, 1.5, 1.5);
          mainEngineModel.position.set(0, -0.5, 0); // Kicsit lejjebb visszük, hogy középen legyen
          scene.add(mainEngineModel);

          // Megkeressük a GLB-n belüli alkatrészeket név alapján
          parts.forEach((p) => {
            const partObject = mainEngineModel?.getObjectByName(p.key);
            if (partObject) {
              meshes[p.key] = partObject;
              partObject.position.y = p.assembledY;
            }
          });
        },
        undefined,
        (error) => {
          console.error("Hiba történt a GLB betöltése közben:", error);
        }
      );

      // 4. Átmretezés kezelése
      const resize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);

      // 5. Animációs ciklus
      let rotY = -0.5;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        rotY += 0.0012;
        const progress = progressRef.current;

        // Ha megtalálta az alkatrészeket név szerint, akkor robbantja őket
        parts.forEach((p) => {
          const mesh = meshes[p.key];
          if (mesh) {
            mesh.position.y = gsap.utils.interpolate(p.assembledY, p.explodedY, progress);
            mesh.rotation.y = rotY;
          }
        });

        // Ha nem talált külön alkatrészeket, akkor a teljes motort forgatja elegánsan
        if (Object.keys(meshes).length === 0 && mainEngineModel) {
          mainEngineModel.rotation.y = rotY;
        }

        renderer.render(scene, camera);
      };
      animate();

      // 6. ScrollTrigger konfiguráció
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