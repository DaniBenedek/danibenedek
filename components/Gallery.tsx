"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type Category = "all" | "photography" | "bts" | "cad";

const items: { src: string; category: Exclude<Category, "all">; caption: string }[] = [
  { src: "/gallery/photo-1.jpg", category: "photography", caption: "Útközben" },
  { src: "/gallery/bts-1.jpg", category: "bts", caption: "Munka közben" },
  { src: "/gallery/cad-1.jpg", category: "cad", caption: "Robbantott nézet — folyamatban" },
  // add your own — see note below
];

const filters: { key: Category; label: string }[] = [
  { key: "all", label: "Mind" },
  { key: "photography", label: "Fotó" },
  { key: "bts", label: "Behind the Scenes" },
  { key: "cad", label: "CAD" },
];

export default function Gallery() {
  const [active, setActive] = useState<Category>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = active === "all" ? items : items.filter(i => i.category === active);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".gallery-item", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" });
    }, gridRef);
    return () => ctx.revert();
  }, [active]);

  return (
    <section style={{ padding: "160px 48px 120px" }}>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em", marginBottom: "48px" }}>
        Gallery
      </h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "56px", flexWrap: "wrap" }}>
        {filters.map(f => (
          <button
            key={f.key}
            data-magnetic
            onClick={() => setActive(f.key)}
            style={{
              fontSize: "12px", padding: "8px 20px", borderRadius: "100px",
              letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
              border: active === f.key ? "1px solid var(--ink)" : "1px solid var(--border)",
              background: active === f.key ? "var(--ink)" : "transparent",
              color: active === f.key ? "var(--bg)" : "var(--muted)",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={gridRef} style={{ columns: "3 280px", columnGap: "16px" }}>
        {visible.map((item, i) => (
          <div key={item.src + i} className="gallery-item" style={{ breakInside: "avoid", marginBottom: "16px", borderRadius: "4px", overflow: "hidden", background: "#f0ede8" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.caption} style={{ width: "100%", display: "block" }} />
          </div>
        ))}
      </div>
    </section>
  );
}