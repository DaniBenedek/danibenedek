"use client";

const jobs = [
  { year: "2024", company: "Primevalor Nonprofit Kft.", role: "Marketing · Webdesign", desc: "Kampánytervezés, vizuális anyagok, weboldalak kialakítása." },
  { year: "2023", company: "Duocor Kft.", role: "Lakatos részleg", desc: "Szék láb hajlítás, ipari gyártási folyamatokban való részvétel." },
  { year: "2022", company: "Makó Város Önkormányzata", role: "Pénzügyi osztály", desc: "Adminisztratív és pénzügyi asszisztensi feladatok, dokumentációkezelés." },
  { year: "2021", company: "Vállker Kft.", role: "Raktáros", desc: "Raktárlogisztika, készletnyilvántartás, fizikai munkavégzés." },
];

export default function Experience() {
  return (
    <section id="tapasztalat" style={{ padding: "120px 48px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "80px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em" }}>
          Tapasztalat
        </h2>
        <span style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>2021 – 2024</span>
      </div>

      <div>
        {jobs.map((j, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "40px", padding: "36px 0", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "14px", color: "var(--muted)", paddingTop: "4px" }}>{j.year}</span>
            <div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 2.5vw, 30px)", letterSpacing: "-0.02em", marginBottom: "4px" }}>{j.company}</h3>
              <p style={{ fontSize: "12px", color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>{j.role}</p>
              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>{j.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>
    </section>
  );
}
