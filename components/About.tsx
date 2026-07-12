"use client";

const passions = [
  { tag: "MOTORSPORT", text: "F1 quali on Saturday, Sunday's race, repeat. I'll defend a bad strategy call for an hour if you let me." },
  { tag: "BUILDING", text: "If it's broken I'll take it apart before I ask anyone how to fix it. Sometimes it stays broken. Worth it." },
  { tag: "TRAVEL", text: "Passport gets more use than my driver's license — though the car's seen a few road trips too." },
];

const toolkit = ["SolidWorks", "Fusion 360", "Inventor", "Next.js", "GSAP", "Three.js", "TypeScript"];

export default function About() {
  return (
    <section id="rólam" style={{ padding: "120px 48px", borderTop: "1px solid var(--border)" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em", marginBottom: "64px", lineHeight: 1.0 }}>
        Not a résumé.<br /><em>Just me.</em>
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
        <div>
          <p style={{ fontSize: "17px", color: "var(--ink)", lineHeight: 1.8, fontWeight: 300, marginBottom: "24px" }}>
            19, based in Makó, Hungary. I design mechanical parts by day and break my own websites by night — turns out CAD tolerances and CSS margins scratch the same itch.
          </p>
          <p style={{ fontSize: "17px", color: "var(--muted)", lineHeight: 1.8, fontWeight: 300 }}>
            I don't really believe in "just a hobby." If I'm into something, I'm annoyingly into it. Here's what that currently means:
          </p>

          <div style={{ marginTop: "40px" }}>
            {passions.map((p) => (
              <div key={p.tag} style={{ borderTop: "1px solid var(--border)", padding: "24px 0" }}>
                <span style={{ fontSize: "11px", color: "var(--accent)", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>{p.tag}</span>
                <p style={{ fontSize: "15px", color: "var(--ink)", lineHeight: 1.7, fontWeight: 300 }}>{p.text}</p>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </div>

        <div>
          <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
            What I actually build with
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "48px" }}>
            {toolkit.map(s => (
              <span key={s} style={{ fontSize: "13px", padding: "6px 16px", background: "var(--ink)", color: "var(--bg)", borderRadius: "100px" }}>{s}</span>
            ))}
          </div>
          <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, fontStyle: "italic" }}>
            No job history here on purpose — the projects section already shows what I can do. This part's just about who's doing it.
          </p>
        </div>
      </div>
    </section>
  );
}