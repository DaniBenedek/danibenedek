"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function RevCounter() {
  const needleRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!needleRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(needleRef.current, { rotate: -120 }, { rotate: 95, duration: 0.9, ease: "power2.out", transformOrigin: "50% 100%" })
      .to(needleRef.current, { rotate: 40, duration: 0.5, ease: "power2.inOut", transformOrigin: "50% 100%" });
  }, []);

  return (
    <svg width="44" height="28" viewBox="0 0 44 28" style={{ overflow: "visible" }}>
      <path d="M4 26 A18 18 0 0 1 40 26" fill="none" stroke="var(--border)" strokeWidth="2" />
      <path d="M28 12 A18 18 0 0 1 40 26" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <line ref={needleRef} x1="22" y1="26" x2="22" y2="8" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="22" cy="26" r="2" fill="var(--ink)" />
    </svg>
  );
}