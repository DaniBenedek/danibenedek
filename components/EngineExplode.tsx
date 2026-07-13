"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type * as THREE from "three";

type PartKey = "head" | "pistons" | "rods" | "blockUpper" | "blockLower" | "crank" | "bolts";

// Extracted directly from motor_osszeszerelve.glb's node list — exact match, no regex.
const partNames: Record<PartKey, string[]> = {
  head: ["Silindir Kapağı-1"],
  pistons: ["Piston-1", "Piston-4", "Piston Pimi-4", "Piston-2", "Piston Pimi-2", "Piston-3", "Piston Pimi-1", "Piston Pimi-3", "Piston Burç-2", "Piston Burç-1", "Piston Burç-4", "Piston Burç-6", "Piston Burç-5", "Piston Burç-3", "Piston Burç-7", "Piston Burç-8"],
  rods: ["Biyel Kolu-3", "Biyel Kolu-2", "Biyel Kolu-1", "Biyel Kolu-4"],
  blockUpper: ["Motor Bloğu-1"],
  blockLower: ["Alt Motor Bloğu-1"],
  crank: ["Krank Mili-1", "Krank Pimi-4", "Krank Pimi-1", "Kaymalı Yatak 2-4", "Krank Pimi-3", "Krank Pimi-2", "Kaymalı Yatak 2-6", "Kaymalı Yatak 2-5", "Kaymalı Yatak 2-7", "Kaymalı Yatak 2-8"],
  bolts: ["hex screw gradec_iso-2", "hex bolt gradeab_iso-7", "hex bolt gradeab_iso-10", "hex bolt gradeab_iso-9", "hex bolt gradeb_iso-3", "hex bolt gradeab_iso-6", "hex bolt gradeab_iso-3", "hex bolt gradeab_iso-1", "hex bolt gradeab_iso-4", "hex bolt gradeab_iso-5", "hex bolt gradeab_iso-8", "hex bolt gradeab_iso-11", "hex bolt gradeb_iso-1", "hex bolt gradeb_iso-2", "hexalobular socket cheese head_iso-5", "hexalobular socket cheese head_iso-3", "hex bolt gradeb_iso-4", "hex bolt gradeb_iso-7", "hex bolt gradeb_iso-8", "hexalobular socket cheese head_iso-4", "hexalobular socket cheese head_iso-8", "hex bolt gradeb_iso-5", "hex bolt gradeb_iso-6", "hex bolt gradeb_iso-10", "hex bolt gradeb_iso-9", "hexalobular socket cheese head_iso-10", "hexalobular socket cheese head_iso-6", "hexalobular socket cheese head_iso-7", "hexalobular socket cheese head_iso-9"],
};

const nameToKey: Map<string, PartKey> = new Map();
(Object.keys(partNames) as PartKey[]).forEach((key) => {
  partNames[key].forEach((name) => nameToKey.set(name, key));
});

const parts: { key: PartKey; label: string; direction: [number, number, number]; distance: number; radialScatter?: boolean }[] = [
  { key: "head", label: "Hengerfej", direction: [0, 1, 0], distance: 4.2 },
  { key: "pistons", label: "Dugattyúk + csapok + persely", direction: [0, 1, 0], distance: 2.2 },
  { key: "rods", label: "Hajtórudak", direction: [0, 1, 0], distance: 1.4 },
  { key: "blockUpper", label: "Hengerblokk", direction: [0, 0, 0], distance: 0 },
  { key: "blockLower", label: "Alsó motorblokk", direction: [0, -1, 0], distance: 1.8 },
  { key: "crank", label: "Forgattyús tengely + csapágyak", direction: [0, -1, 0], distance: 3.2 },
  { key: "bolts", label: "Kötőelemek", direction: [1, 0, 0], distance: 2.4, radialScatter: true },
];

type PartInstance = { object: THREE.Object3D; startPosition: THREE.Vector3; angle: number };

function isMeshNode(o: THREE.Object3D): boolean {
  return (o as THREE.Mesh).isMesh === true;
}

export default function EngineExplode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [matchInfo, setMatchInfo] = useState<Record<string, number>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    let animId: number;
    let disposed = false;
    let st: ScrollTrigger | undefined;

    const buckets: Record<PartKey, PartInstance[]> = {
      head: [], pistons: [], rods: [], blockUpper: [], blockLower: [], crank: [], bolts: [],
    };
    let mainEngineModel: THREE.Group | null = null;

    Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js"),
    ]).then(([ThreeLib, GLTFModule]) => {
      if (disposed) return;

      const renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      const scene = new ThreeLib.Scene();
      const camera = new ThreeLib.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(5.5, 1.2, 7);
      camera.lookAt(0, 0, 0);

      scene.add(new ThreeLib.AmbientLight(0xffffff, 0.7));
      const dirLight = new ThreeLib.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      const loader = new GLTFModule.GLTFLoader();

      loader.load(
        "/models/motor_osszeszerelve.glb",
        (gltf) => {
          if (disposed) return;

          mainEngineModel = gltf.scene;
          mainEngineModel.scale.set(1.5, 1.5, 1.5);
          mainEngineModel.position.set(0, -0.5, 0);
          scene.add(mainEngineModel);

          let boltIndex = 0;
          const totalBolts = partNames.bolts.length;

          mainEngineModel.traverse((node) => {
            if (!isMeshNode(node)) return;
            const matchedKey = nameToKey.get(node.name);
            if (!matchedKey) return;

            const angle = matchedKey === "bolts" ? (boltIndex++ / Math.max(1, totalBolts)) * Math.PI * 2 : 0;
            buckets[matchedKey].push({
              object: node,
              startPosition: node.position.clone(),
              angle,
            });
          });

          setMatchInfo(Object.fromEntries(parts.map((p) => [p.key, buckets[p.key].length])));
          parts.forEach((p) => console.log(`${p.label}: ${buckets[p.key].length} találat`));
        },
        undefined,
        (error) => console.error("Hiba történt a GLB betöltése közben:", error)
      );

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

        let anyMatched = false;
        parts.forEach((p) => {
          buckets[p.key].forEach((inst) => {
            anyMatched = true;
            if (p.radialScatter) {
              const spreadX = Math.sin(inst.angle);
              const spreadZ = Math.cos(inst.angle);
              inst.object.position.x = inst.startPosition.x + spreadX * p.distance * progress;
              inst.object.position.z = inst.startPosition.z + spreadZ * p.distance * progress;
              inst.object.position.y = inst.startPosition.y + 0.6 * p.distance * progress;
            } else {
              inst.object.position.x = inst.startPosition.x + p.direction[0] * p.distance * progress;
              inst.object.position.y = inst.startPosition.y + p.direction[1] * p.distance * progress;
              inst.object.position.z = inst.startPosition.z + p.direction[2] * p.distance * progress;
            }
          });
        });

        if (!anyMatched && mainEngineModel) {
          mainEngineModel.rotation.y = rotY;
        } else if (mainEngineModel) {
          mainEngineModel.rotation.y = -0.4 + progress * 0.3;
        }

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
      <canvas ref={canvasRef} className="engine-canvas" style={{ position: "absolute", right: 0, top: 0, width: "65vw", height: "100%", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, padding: "0 48px", maxWidth: "440px" }}>
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
              {matchInfo[p.key] === 0 && (
                <span style={{ fontSize: "11px", color: "#c0392b", marginLeft: "auto" }}>nincs találat</span>
              )}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  );
}

