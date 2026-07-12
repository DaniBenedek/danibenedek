"use client";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "100px 48px 56px" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(48px, 9vw, 120px)", letterSpacing: "-0.03em", lineHeight: 0.9, marginBottom: "56px" }}>
        Dolgozzunk<br /><em>együtt?</em>
      </h2>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "80px" }}>
        <a href="mailto:hello@danibenedek.com" style={{ fontSize: "14px", padding: "16px 36px", background: "var(--ink)", color: "var(--bg)", borderRadius: "100px", textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase", transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--accent)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--ink)"}>
          hello@danibenedek.com ↗
        </a>
        <a href="https://linkedin.com/in/danibenedek" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "14px", padding: "16px 36px", border: "1px solid var(--border)", borderRadius: "100px", textDecoration: "none", color: "var(--ink)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          LinkedIn ↗
        </a>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px" }}>Dani Benedek</span>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>© 2025 · danibenedek.com</span>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>Makó, Magyarország</span>
      </div>
    </footer>
  );
}
