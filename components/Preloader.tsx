"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          delay: 0.2,
          onComplete: () => setDone(true),
        });
      },
    });
    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.floor(obj.val)),
    });
    return () => { tl.kill(); };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "var(--bg)", display: "flex", alignItems: "flex-end",
      justifyContent: "space-between", padding: "48px",
    }}>
      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px" }}>Dani Benedek</span>
      <span style={{ fontSize: "13px", fontVariantNumeric: "tabular-nums", color: "var(--muted)" }}>
        {pct.toString().padStart(3, "0")}%
      </span>
    </div>
  );
}