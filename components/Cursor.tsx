"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.15, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const addHover = () => el.classList.add("hover");
    const removeHover = () => el.classList.remove("hover");

    window.addEventListener("mousemove", move);

    const targets = document.querySelectorAll("a, button");
    targets.forEach((t) => {
      t.addEventListener("mouseenter", addHover);
      t.addEventListener("mouseleave", removeHover);
    });

    const magnets = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    const magnetHandlers: Array<() => void> = [];

    magnets.forEach((m) => {
      const strength = 0.3;
      const onMove = (e: MouseEvent) => {
        const rect = m.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        gsap.to(m, { x: relX * strength, y: relY * strength, duration: 0.3, ease: "power2.out" });
      };
      const onLeave = () => gsap.to(m, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
      m.addEventListener("mousemove", onMove);
      m.addEventListener("mouseleave", onLeave);
      magnetHandlers.push(() => {
        m.removeEventListener("mousemove", onMove);
        m.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      window.removeEventListener("mousemove", move);
      magnetHandlers.forEach((off) => off());
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden />;
}