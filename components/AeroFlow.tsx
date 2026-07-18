"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type * as THREE from "three";

const zones = [
  { label: "Első szárny", desc: "Itt dől el az egész autó aero-egyensúlya — az első szárny irányítja a levegőt a padló és az oldalterelők felé." },
  { label: "Padló & diffúzor", desc: "Ground effect: a padló alatt felgyorsuló levegő szívóhatást kelt — ez adja a leszorítóerő nagy részét modern F1-ben." },
  { label: "Oldalterelők", desc: "A sidepod-ok a hűtőlevegőt terelik, miközben minél tisztábban próbálják a hátsó szárnyhoz vezetni az áramlást." },
  { label: "Hátsó szárny & DRS", desc: "A leggyorsabb, legörvényesebb zóna — itt látszik igazán, mennyi turbulenciát hagy maga után az autó." },
];

const obstacles = [
  { x: -3.6, y: 0.15, z: 0, radius: 1.0, strength: 0.9 },   // front wing
  { x: -2.5, y: 0.4, z: 0, radius: 0.8, strength: 0.7 },    // nose
  { x: -0.8, y: 0.9, z: 0, radius: 0.6, strength: 0.6 },    // halo / cockpit
  { x: -0.3, y: 0.5, z: 0.9, radius: 0.7, strength: 0.8 },  // sidepod right
  { x: -0.3, y: 0.5, z: -0.9, radius: 0.7, strength: 0.8 }, // sidepod left
  { x: 0.8, y: 0.6, z: 0, radius: 0.7, strength: 0.5 },     // engine cover
  { x: 2.6, y: 1.0, z: 0, radius: 0.9, strength: 1.0 },     // rear wing
  { x: 1.5, y: 0.05, z: 0, radius: 1.2, strength: -0.5 },   // floor/diffuser — negative = suction
];

const PARTICLE_COUNT = 260;

export default function AeroFlow() {
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
      camera.position.set(-6, 2.2, 5);
      camera.lookAt(0, 0.5, 0);

      const mat = new ThreeLib.MeshNormalMaterial({ wireframe: true });
      const carGroup = new ThreeLib.Group();
      scene.add(carGroup);

      // --- Stylized F1 car silhouette (wireframe primitives, not a real model) ---
      const nose = new ThreeLib.Mesh(new ThreeLib.ConeGeometry(0.28, 1.6, 8), mat);
      nose.rotation.z = Math.PI / 2;
      nose.position.set(-3.0, 0.35, 0);
      carGroup.add(nose);

      const frontWing = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(0.5, 0.06, 1.9), mat);
      frontWing.position.set(-3.6, 0.15, 0);
      carGroup.add(frontWing);
      [0.85, -0.85].forEach((z) => {
        const endplate = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(0.4, 0.35, 0.05), mat);
        endplate.position.set(-3.6, 0.3, z);
        carGroup.add(endplate);
      });

      const chassis = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(3.2, 0.45, 0.85), mat);
      chassis.position.set(-0.6, 0.45, 0);
      carGroup.add(chassis);

      const halo = new ThreeLib.Mesh(new ThreeLib.TorusGeometry(0.42, 0.03, 8, 16, Math.PI * 1.3), mat);
      halo.rotation.x = Math.PI / 2;
      halo.rotation.z = Math.PI * 0.35;
      halo.position.set(-0.8, 0.85, 0);
      carGroup.add(halo);

      [0.75, -0.75].forEach((z) => {
        const sidepod = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(1.4, 0.4, 0.5), mat);
        sidepod.position.set(-0.2, 0.4, z);
        carGroup.add(sidepod);
      });

      const engineCover = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(1.6, 0.5, 0.55), mat);
      engineCover.position.set(1.1, 0.55, 0);
      carGroup.add(engineCover);

      const floor = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(4.8, 0.04, 1.6), mat);
      floor.position.set(0.2, 0.08, 0);
      carGroup.add(floor);

      const diffuser = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(0.9, 0.4, 1.5), mat);
      diffuser.rotation.z = -0.25;
      diffuser.position.set(2.3, 0.2, 0);
      carGroup.add(diffuser);

      [-0.85, 0.85].forEach((z) => {
        const pylon = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(0.5, 0.5, 0.06), mat);
        pylon.position.set(2.5, 0.75, z);
        carGroup.add(pylon);
      });
      const rearWing = new ThreeLib.Mesh(new ThreeLib.BoxGeometry(0.5, 0.06, 1.9), mat);
      rearWing.position.set(2.6, 1.0, 0);
      carGroup.add(rearWing);

      const wheelPositions: [number, number, number][] = [
        [-2.6, 0.32, 1.05], [-2.6, 0.32, -1.05],
        [1.4, 0.32, 1.1], [1.4, 0.32, -1.1],
      ];
      wheelPositions.forEach(([x, y, z]) => {
        const wheel = new ThreeLib.Mesh(new ThreeLib.CylinderGeometry(0.32, 0.32, 0.3, 16), mat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, y, z);
        carGroup.add(wheel);
      });

      // --- Flow particles ---
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const baseYZ = new Float32Array(PARTICLE_COUNT * 2); // [y, z] per particle
      const colors = new Float32Array(PARTICLE_COUNT * 3);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const y = Math.random() * 1.7 - 0.1;
        const z = Math.random() * 3.6 - 1.8;
        positions[i * 3] = -6 - Math.random() * 2;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        baseYZ[i * 2] = y;
        baseYZ[i * 2 + 1] = z;
        colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.9;
      }

      const particleGeo = new ThreeLib.BufferGeometry();
      particleGeo.setAttribute("position", new ThreeLib.BufferAttribute(positions, 3));
      particleGeo.setAttribute("color", new ThreeLib.BufferAttribute(colors, 3));
      const particleMat = new ThreeLib.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.85 });
      const particles = new ThreeLib.Points(particleGeo, particleMat);
      scene.add(particles);

      const resize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);

      const colBlue = { r: 0.2, g: 0.45, b: 0.95 };
      const colRed = { r: 0.95, g: 0.25, b: 0.2 };

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const progress = progressRef.current;
        const dt = 1;
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const colAttr = particleGeo.attributes.color as THREE.BufferAttribute;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          let px = posAttr.getX(i);
          let py = posAttr.getY(i);
          let pz = posAttr.getZ(i);
          const baseY = baseYZ[i * 2];
          const baseZ = baseYZ[i * 2 + 1];

          let deflectY = 0, deflectZ = 0, totalMag = 0;
          for (const ob of obstacles) {
            const dx = px - ob.x;
            const influenceX = Math.exp(-(dx * dx) / (ob.radius * ob.radius * 4));
            if (influenceX < 0.01) continue;
            const dy = py - ob.y;
            const dz = pz - ob.z;
            const distYZ = Math.sqrt(dy * dy + dz * dz) + 0.15;
            const pushMag = (ob.strength * influenceX) / (distYZ * distYZ + 0.3);
            deflectY += (dy / distYZ) * pushMag;
            deflectZ += (dz / distYZ) * pushMag;
            totalMag += Math.abs(pushMag);
          }

          // weak restoring force back toward the particle's original lane
          deflectY += (baseY - py) * 0.02;
          deflectZ += (baseZ - pz) * 0.02;

          px += (0.028 + progress * 0.02) * dt;
          py += deflectY * 0.15 * dt;
          pz += deflectZ * 0.15 * dt;

          if (px > 6) {
            px = -6 - Math.random() * 2;
            py = baseY;
            pz = baseZ;
          }

          posAttr.setXYZ(i, px, py, pz);

          const t = Math.min(1, totalMag * 1.4);
          colAttr.setXYZ(
            i,
            colBlue.r + (colRed.r - colBlue.r) * t,
            colBlue.g + (colRed.g - colBlue.g) * t,
            colBlue.b + (colRed.b - colBlue.b) * t
          );
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        // camera dolly around the car, driven by scroll progress
        const camX = -6 + progress * 12;
        const camZ = 5 - Math.sin(progress * Math.PI) * 1.5;
        camera.position.set(camX, 2.2 - progress * 0.3, camZ);
        camera.lookAt(0, 0.5, 0);

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
          setActiveIndex(Math.min(zones.length - 1, Math.floor(self.progress * zones.length)));
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
      <canvas ref={canvasRef} className="aero-canvas" style={{ position: "absolute", right: 0, top: 0, width: "68vw", height: "100%", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, padding: "0 48px", maxWidth: "420px" }}>
        <span style={{ fontSize: "11px", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>
          Áramlástan
        </span>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.02em", marginBottom: "20px", lineHeight: 1.1 }}>
          Egyszer az F1 aero csapatánál akarok dolgozni.
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, marginBottom: "32px" }}>
          Ez itt egy stilizált áramlás-vizualizáció — nem valódi CFD-szimuláció, csak egy kis ízelítő abból, ahogy a levegő zónáit gondolkodom.
        </p>
        <div>
          {zones.map((z, i) => (
            <div key={z.label} style={{
              padding: "14px 0", borderTop: "1px solid var(--border)",
              opacity: activeIndex === i ? 1 : 0.35,
              transition: "opacity 0.3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "15px", color: "var(--ink)" }}>{z.label}</span>
              </div>
              {activeIndex === i && (
                <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.6, marginLeft: "28px" }}>{z.desc}</p>
              )}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </section>
  );
}