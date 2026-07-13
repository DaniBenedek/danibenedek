"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const igPreview = [
  "/contact/insta-1.jpg",
  "/contact/insta-2.jpg",
  "/contact/insta-3.jpg",
  "/contact/insta-4.jpg",
  "/contact/insta-5.jpg",
  "/contact/insta-6.jpg",
];

export default function ContactPeek({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;

    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.92, y: -8 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      }
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        right: 0,
        width: "320px",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(26,26,26,0.14)",
        padding: "20px",
        transformOrigin: "top right",
        zIndex: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "10px",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Look inside
          </span>

          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "17px",
            }}
          >
            @dani.benedek
          </span>
        </div>

        <button
          data-magnetic
          onClick={onClose}
          aria-label="Bezárás"
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "transparent",
            cursor: "pointer",
            fontSize: "13px",
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
          marginBottom: "16px",
        }}
      >
        {igPreview.map((src, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: "8px",
              overflow: "hidden",
              background: "#f0ede8",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "var(--muted)",
          marginBottom: "18px",
        }}
      >
        <span>📍 Makó, HU</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <a
          data-magnetic
          href="https://www.instagram.com/dani_benedek/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "13px",
            padding: "12px 16px",
            borderRadius: "100px",
            background: "var(--ink)",
            color: "var(--bg)",
            textDecoration: "none",
            textAlign: "center",
            letterSpacing: "0.03em",
          }}
        >
          Instagram megnyitása ↗
        </a>

        <a
          data-magnetic
          href="mailto:hello@danibenedek.com"
          style={{
            fontSize: "13px",
            padding: "12px 16px",
            borderRadius: "100px",
            border: "1px solid var(--border)",
            color: "var(--ink)",
            textDecoration: "none",
            textAlign: "center",
            letterSpacing: "0.03em",
          }}
        >
          Írj emailt
        </a>
      </div>
    </div>
  );
}