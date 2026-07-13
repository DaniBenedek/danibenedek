"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Branch = {
  side: "left" | "right";
  img: string;
  tag: string;
  text: string;
};

const branches: Branch[] = [
  { side: "right", img: "/about/motorsport.jpg", tag: "MOTORSPORT", text: "F1 quali szombaton, futam vasárnap. Egy órát is elvitatkozom egy rossz stratégiai döntésről." },
  { side: "left", img: "/about/building.jpg", tag: "BUILDING", text: "Ha valami elromlik, előbb szedem szét, mint hogy megkérdezném valakitől, hogyan javítsam. Néha rosszabb lesz. Megérte." },
  { side: "right", img: "/about/travel-1.jpg", tag: "TRAVEL", text: "Az útlevelem többet dolgozik, mint a jogosítványom — bár az autó is látott már pár hosszabb utat." },
  { side: "left", img: "/about/build-2.jpg", tag: "PROJEKT", text: "A motor most épp szét van szedve. Szó szerint." },
  { side: "right", img: "/about/travel-2.jpg", tag: "TRAVEL", text: "Legutóbb ott jártam, ahol a térkép már nem magyarul van feliratozva." },
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const trunkRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      if (trunkRef.current) {
        const length = trunkRef.current.getTotalLength();
        gsap.set(trunkRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(trunkRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".branch-node").forEach((node) => {
        gsap.fromTo(node, { opacity: 0, scale: 0.6, y: 20 }, {
          opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)",
          scrollTrigger: { trigger: node, start: "top 85%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="rólam" style={{ padding: "140px 48px", borderTop: "1px solid var(--border)", position: "relative" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em", marginBottom: "24px", lineHeight: 1.0, textAlign: "center" }}>
        Not a résumé.<br /><em>Just me.</em>
      </h2>
      <p style={{ textAlign: "center", maxWidth: "480px", margin: "0 auto 100px", fontSize: "16px", color: "var(--muted)", fontWeight: 300, lineHeight: 1.7 }}>
        19, Makó. Nappal mechanikai alkatrészeket tervezek, este a saját weboldalamat törögetem — kiderült, hogy a CAD-tűrések és a CSS-margók ugyanazt a viszketést vakarják.
      </p>

      <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
        {/* trunk line — a single vertical-ish squiggly path */}
        <svg
          width="100%"
          height={branches.length * 260}
          viewBox={`0 0 900 ${branches.length * 260}`}
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
        >
          <path
            ref={trunkRef}
            d={buildTrunkPath(branches.length)}
            fill="none"
            stroke="var(--border)"
            strokeWidth="2"
          />
        </svg>

        {branches.map((b, i) => (
          <div
            key={b.tag + i}
            className="branch-node"
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: b.side === "left" ? "flex-start" : "flex-end",
              alignItems: "center",
              height: "260px",
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: b.side === "left" ? "row" : "row-reverse",
              alignItems: "center",
              gap: "20px",
              maxWidth: "380px",
              width: "42%",
            }}>
              <div style={{
                width: "76px", height: "76px", borderRadius: "50%",
                overflow: "hidden", flexShrink: 0,
                border: "3px solid var(--bg)", boxShadow: "0 4px 16px rgba(26,26,26,0.12)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.img} alt={b.tag} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "var(--accent)", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>{b.tag}</span>
                <p style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.6, fontWeight: 300 }}>{b.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// generates a gentle zig-zag vertical path so branch nodes read as
// growing off a winding trunk rather than a straight line
function buildTrunkPath(count: number): string {
  const stepHeight = 260;
  const midX = 450;
  const wobble = 70;
  let d = `M ${midX} 0`;
  for (let i = 1; i <= count; i++) {
    const y = i * stepHeight;
    const x = midX + (i % 2 === 0 ? wobble : -wobble);
    const prevY = (i - 1) * stepHeight;
    d += ` C ${midX} ${prevY + stepHeight / 2}, ${x} ${y - stepHeight / 2}, ${x} ${y}`;
  }
  return d;
}