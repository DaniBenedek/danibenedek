"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Branch = {
  side: "left" | "right";
  img: string;
  tag: string;
  text: string;
  rotate: number;
};

const branches: Branch[] = [
  { side: "right", img: "/about/keke30.jpg", tag: "MOTORSPORT", text: "F1 quali szombaton, futam vasárnap. Egy órát is elvitatkozom egy rossz stratégiai döntésről.", rotate: -6 },
  { side: "left", img: "/about/lauda-helmet.jpg", tag: "BUILDING", text: "Ha valami elromlik, előbb szedem szét, mint hogy megkérdezném valakitől, hogyan javítsam. Néha rosszabb lesz. Megérte.", rotate: 8 },
  { side: "right", img: "/about/travel.jpg", tag: "TRAVEL", text: "Az útlevelem többet dolgozik, mint a jogosítványom — bár az autó is látott már pár hosszabb utat.", rotate: -9 },
  { side: "left", img: "/about/en-szereles.jpeg", tag: "PROJEKT", text: "A motor most épp szét van szedve. Szó szerint.", rotate: 5 },
  { side: "right", img: "/about/travel-2.jpg", tag: "TRAVEL", text: "Legutóbb ott jártam, ahol a térkép már nem magyarul van feliratozva.", rotate: -4 },
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
        const rot = parseFloat(node.dataset.rotate || "0");
        gsap.fromTo(node, { opacity: 0, scale: 0.5, y: 30, rotate: rot * 2.5 }, {
          opacity: 1, scale: 1, y: 0, rotate: rot, duration: 0.8, ease: "back.out(1.8)",
          scrollTrigger: { trigger: node, start: "top 85%" },
        });
      });

      // hover tilt-correction — polaroid straightens slightly toward camera on hover
      gsap.utils.toArray<HTMLElement>(".polaroid").forEach((card) => {
        const baseRotate = parseFloat((card as HTMLElement).dataset.rotate || "0");
        const rotTo = gsap.quickTo(card, "rotate", { duration: 0.4, ease: "power3.out" });
        const scaleTo = gsap.quickTo(card, "scale", { duration: 0.4, ease: "power3.out" });
        card.addEventListener("mouseenter", () => { rotTo(baseRotate * 0.25); scaleTo(1.06); });
        card.addEventListener("mouseleave", () => { rotTo(baseRotate); scaleTo(1); });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="rólam" style={{ padding: "140px 48px", borderTop: "1px solid var(--border)", position: "relative" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em", marginBottom: "24px", lineHeight: 1.0, textAlign: "center" }}>
        Not a résumé.<br /><em>Just me.</em>
      </h2>
      <p style={{ textAlign: "center", maxWidth: "480px", margin: "0 auto 120px", fontSize: "16px", color: "var(--muted)", fontWeight: 300, lineHeight: 1.7 }}>
        2006-os születésű. Nappal autó és jármű szerelés, alkatrész tervezés a kikapcsolódás. Csapatjátékos.
      </p>

      <div style={{ position: "relative", maxWidth: "1000px", margin: "0 auto" }}>
        <svg
          width="100%"
          height={branches.length * 340}
          viewBox={`0 0 1000 ${branches.length * 340}`}
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
            data-rotate={b.rotate}
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: b.side === "left" ? "flex-start" : "flex-end",
              alignItems: "center",
              height: "340px",
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: b.side === "left" ? "row" : "row-reverse",
              alignItems: "center",
              gap: "32px",
              maxWidth: "460px",
              width: "48%",
            }}>
              <div
                className="polaroid"
                data-rotate={b.rotate}
                style={{
                  flexShrink: 0,
                  width: "210px",
                  background: "var(--bg)",
                  padding: "12px 12px 36px",
                  borderRadius: "3px",
                  boxShadow: "0 14px 34px rgba(26,26,26,0.18)",
                  transform: `rotate(${b.rotate}deg)`,
                  cursor: "default",
                }}
              >
                <div style={{ width: "100%", aspectRatio: "4 / 5", overflow: "hidden", background: "#e8e4dc" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.img} alt={b.tag} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{
                  display: "block", marginTop: "10px", textAlign: "center",
                  fontFamily: "'DM Serif Display', serif", fontStyle: "italic",
                  fontSize: "13px", color: "var(--ink)", letterSpacing: "0.01em",
                }}>
                  {b.tag.charAt(0) + b.tag.slice(1).toLowerCase()}
                </span>
              </div>

              <div>
                <span style={{ fontSize: "10px", color: "var(--accent)", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>{b.tag}</span>
                <p style={{ fontSize: "15px", color: "var(--ink)", lineHeight: 1.7, fontWeight: 300 }}>{b.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildTrunkPath(count: number): string {
  const stepHeight = 340;
  const midX = 500;
  const wobble = 90;
  let d = `M ${midX} 0`;
  for (let i = 1; i <= count; i++) {
    const y = i * stepHeight;
    const x = midX + (i % 2 === 0 ? wobble : -wobble);
    const prevY = (i - 1) * stepHeight;
    d += ` C ${midX} ${prevY + stepHeight / 2}, ${x} ${y - stepHeight / 2}, ${x} ${y}`;
  }
  return d;
}