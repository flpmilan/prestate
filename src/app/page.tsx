import Link from "next/link";

const FEATURES = [
  {
    n: "01",
    title: "Excel import",
    body: "A meglévő lakáslistádat egy kattintással betöltöd, nincs kézi adatbevitel.",
  },
  {
    n: "02",
    title: "AI-asszisztált alaprajzok",
    body: "Tölts fel alaprajzokat, és AI segítségével generálj belőlük 3D rendert is.",
  },
  {
    n: "03",
    title: "Élő ajánlatkérés",
    body: "Az érdeklődők közvetlenül a weboldalról kérhetnek ajánlatot, emeletenként szűrve.",
  },
];

const STEPS = [
  { n: "1", title: "Alapadatok", body: "Projektnév, cím, rövid leírás — két perc alatt kész." },
  { n: "2", title: "Design és tartalom", body: "Válassz sablont, tölts fel galériát és látványtervet." },
  { n: "3", title: "Publikálás", body: "A weboldal élesedik saját aldomainen, azonnal megosztható." },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[#FAF7F2] text-[#1C1A17]">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-[#E8E1D4] px-6 py-5 sm:px-12">
        <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-fraunces)" }}>
          Prestate
        </span>
        <nav className="flex items-center gap-8">
          <Link href="#funkciok" className="hidden text-sm font-medium text-[#6B6354] hover:text-[#1C1A17] sm:inline">
            Funkciók
          </Link>
          <Link href="#hogyan" className="hidden text-sm font-medium text-[#6B6354] hover:text-[#1C1A17] sm:inline">
            Hogyan működik
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-[#1C1A17] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2E2A24]"
          >
            Bejelentkezés
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-12 sm:py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 900px 600px at 85% 0%, #F3DEC4 0%, rgba(243,222,196,0) 60%), radial-gradient(ellipse 700px 500px at 0% 100%, #EAD9C2 0%, rgba(234,217,194,0) 55%)",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]">
            Önkiszolgáló SaaS ingatlanfejlesztőknek
          </span>
          <h1
            className="mt-5 max-w-2xl text-[40px] font-normal leading-[1.1] sm:text-[56px]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Értékesítési weboldal a lakásprojektednek, <em className="not-italic text-[#9C5636]">percek alatt</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#5B5147]">
            Töltsd fel a lakáslistát Excelben és az alaprajzokat, mi elkészítjük belőle a publikus
            weboldalt — saját domainnel vagy aldomainnel, élő elérhetőséggel és beépített
            ajánlatkérő űrlappal.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center rounded-md bg-[#9C5636] px-7 py-3.5 text-[15px] font-medium text-white hover:bg-[#86472C]"
            >
              Projekt létrehozása
            </Link>
            <Link
              href="#hogyan"
              className="inline-flex items-center rounded-md border border-[#1C1A17] px-7 py-3.5 text-[15px] font-medium text-[#1C1A17] hover:bg-white"
            >
              Hogyan működik
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="funkciok" className="border-t border-[#E8E1D4] bg-white px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]">Funkciók</span>
          <h2 className="mt-3 text-[32px] font-normal" style={{ fontFamily: "var(--font-fraunces)" }}>
            Minden, amire egy értékesítési oldalhoz szükséged van
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.n}>
                <span
                  className="text-sm font-medium text-[#C9A97F]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {f.n}
                </span>
                <h3 className="mt-3 font-medium text-[#1C1A17]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B6354]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOGYAN MŰKÖDIK */}
      <section id="hogyan" className="border-t border-[#E8E1D4] px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]">Hogyan működik</span>
          <h2 className="mt-3 text-[32px] font-normal" style={{ fontFamily: "var(--font-fraunces)" }}>
            Három lépésben élesben
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-[#E8E1D4] bg-white p-7">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E3D8] text-sm font-medium text-[#9C5636]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {s.n}
                </span>
                <h3 className="mt-4 font-medium text-[#1C1A17]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B6354]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E8E1D4] bg-[#1C1A17] px-6 py-20 text-center sm:px-12">
        <h2 className="text-[32px] font-normal text-[#FBF7F1]" style={{ fontFamily: "var(--font-fraunces)" }}>
          Indítsd el az első projektedet
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-[#BDB2A1]">
          Nincs hosszadalmas beállítás — a vezetett folyamat végigvisz a legfontosabb lépéseken.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center rounded-md bg-[#9C5636] px-7 py-3.5 text-[15px] font-medium text-white hover:bg-[#B86640]"
        >
          Kezdés ingyen
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-4 px-6 py-8 sm:px-12">
        <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>
          Prestate
        </span>
        <span className="text-[13px] text-[#9C8F7E]">© {new Date().getFullYear()} Prestate</span>
      </footer>
    </div>
  );
}
