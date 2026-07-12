"use client";

const skills: Record<string, string[]> = {
  "CAD": ["SolidWorks", "Fusion 360", "Inventor"],
  "Web & Dev": ["Next.js 15", "GSAP", "Three.js", "TypeScript", "Tailwind"],
  "Egyéb": ["Marketing", "Angol B2/C1", "Jogosítvány B"],
};

export default function About() {
  return (
    <section id="rólam" style={{ padding: "120px 48px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.03em", marginBottom: "32px", lineHeight: 1.0 }}>
            Egy kis<br /><em>rólam</em>
          </h2>
          <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.8, fontWeight: 300, marginBottom: "20px" }}>
            19 éves vagyok, Makón élek. A Návay Lajos Technikumban szoftverfejlesztő szakon végzek — szakvizsgám 2025 nyarán lesz.
          </p>
          <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.8, fontWeight: 300, marginBottom: "20px" }}>
            A mechanikai CAD tervezés és a webfejlesztés szokatlan kombináció — de pont ez tesz alkalmassá olyan munkákra, ahol a precizitás és vizuális gondolkodás egyszerre számít.
          </p>
          <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.8, fontWeight: 300 }}>
            Folyékony angollal, saját autóval és 4 év tapasztalattal keresek nyári diákmunkát.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "36px" }}>
            {[["📍","Makó, HU"],["🚗","B jogosítvány · saját autó"],["🎓","Szakvizsga 2025"],["🌍","Angol B2/C1"]].map(([ic,tx]) => (
              <span key={tx} style={{ fontSize: "12px", padding: "6px 16px", border: "1px solid var(--border)", borderRadius: "100px", color: "var(--muted)", display: "inline-flex", gap: "6px" }}>{ic} {tx}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", letterSpacing: "-0.02em", marginBottom: "36px" }}>Skillsek</h3>
          {Object.entries(skills).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>{cat}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {items.map(s => (
                  <span key={s} style={{ fontSize: "13px", padding: "6px 16px", background: "var(--ink)", color: "var(--bg)", borderRadius: "100px" }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
