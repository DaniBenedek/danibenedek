"use client";

const projects = [
  {
    num: "01",
    title: "Robbantott motor",
    sub: "CAD · SolidWorks",
    desc: "Hamarosan — robbantott nézet animációval, interaktív alkatrész-kiemeléssel.",
    type: "cad",
    placeholder: true,
  },
  {
    num: "02",
    title: "CAD projekt #2",
    sub: "Fusion 360 · Assembly",
    desc: "Ide kerül a Fusion 360 projekted — assembly vagy alkatrész GLB renderrel.",
    type: "cad",
    placeholder: true,
  },
  {
    num: "03",
    title: "Kémény Technika Kft.",
    sub: "Web · Frontend",
    desc: "Elkészített weboldal — kemenytechnikakft.com",
    url: "https://kemenytechnikakft.com",
    type: "web",
    placeholder: false,
  },
  {
    num: "04",
    title: "Danijel Scarving Art",
    sub: "Web · Design",
    desc: "Elkészített weboldal — danijelscarvingart.hu",
    url: "https://danijelscarvingart.hu",
    type: "web",
    placeholder: false,
  },
];

export default function Projects() {
  return (
    <section id="projektek" style={{ padding: "120px 48px", borderTop: "1px solid var(--border)" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "80px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em" }}>
          Selected<br /><em>Work</em>
        </h2>
        <span style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>04 projekt</span>
      </div>

      {/* CAD projektek – nagy kártyák */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginBottom: "2px" }}>
        {projects.filter(p => p.type === "cad").map(p => (
          <div key={p.num} style={{ position: "relative", background: "#f0ede8", aspectRatio: "4/3", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px", overflow: "hidden", transition: "background 0.3s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#e8e4dc"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#f0ede8"}>

            {/* Placeholder kép jelölő */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 80, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
              <div style={{ width: 64, height: 64, border: "1.5px dashed #aaa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <span style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {p.num === "01" ? "GLB modell · hamarosan" : "Kép · hamarosan"}
              </span>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{p.sub}</span>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px, 3vw, 36px)", letterSpacing: "-0.02em" }}>{p.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Web projektek – iframe előnézetek */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
        {projects.filter(p => p.type === "web").map(p => (
          <div key={p.num} style={{ background: "#f0ede8" }}>
            {/* iframe preview */}
            <div style={{ position: "relative", height: "340px", overflow: "hidden", background: "#e8e4dc" }}>
              <iframe
                src={p.url}
                style={{ width: "200%", height: "200%", transform: "scale(0.5)", transformOrigin: "top left", border: "none", pointerEvents: "none" }}
                loading="lazy"
                title={p.title}
              />
              {/* overlay – kattintáshoz */}
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "16px", textDecoration: "none" }}>
                <span style={{ fontSize: "12px", background: "var(--ink)", color: "var(--bg)", padding: "6px 14px", borderRadius: "100px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Megnyitás ↗</span>
              </a>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>{p.sub}</span>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", letterSpacing: "-0.02em" }}>{p.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "6px" }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
