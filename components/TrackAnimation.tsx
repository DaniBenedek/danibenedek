"use client";
import { useEffect, useRef } from "react";
import { gsap, MotionPathPlugin } from "@/lib/gsap";

export default function TrackAnimation() {
  const carRef = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    if (!carRef.current) return;
    const tween = gsap.to(carRef.current, {
      motionPath: {
        path: "#track-path",
        align: "#track-path",
        autoRotate: true,
        alignOrigin: [0.5, 0.5],
      },
      duration: 9,
      repeat: -1,
      ease: "none",
    });
    return () => { tween.kill(); };
  }, []);

  return (
    <svg
      className="hero-track"
      viewBox="0 0 500 400"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <path
        id="track-path"
        d="M 60 220
           C 60 140, 100 80, 180 70
           C 240 62, 260 100, 230 130
           C 200 160, 150 150, 150 190
           C 150 230, 210 240, 260 220
           C 300 204, 300 160, 340 150
           C 400 135, 460 160, 460 220
           C 460 280, 400 310, 340 300
           C 300 293, 290 260, 250 270
           C 190 285, 140 300, 100 280
           C 70 265, 60 250, 60 220 Z"
        fill="none"
        stroke="var(--border)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 60 220
           C 60 140, 100 80, 180 70
           C 240 62, 260 100, 230 130
           C 200 160, 150 150, 150 190
           C 150 230, 210 240, 260 220
           C 300 204, 300 160, 340 150
           C 400 135, 460 160, 460 220
           C 460 280, 400 310, 340 300
           C 300 293, 290 260, 250 270
           C 190 285, 140 300, 100 280
           C 70 265, 60 250, 60 220 Z"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="9"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />

      {/* start/finish line */}
      <line x1="45" y1="212" x2="75" y2="228" stroke="var(--ink)" strokeWidth="3" />

      {/* the car — a small triangle, tip pointing along +x by default so autoRotate tracks tangent correctly */}
      <polygon
        ref={carRef}
        points="9,0 -6,-5 -6,5"
        fill="var(--accent)"
      />
    </svg>
  );
}