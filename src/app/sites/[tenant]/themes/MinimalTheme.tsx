import { spaceGrotesk, inter } from "../fonts";
import { LeadForm } from "../LeadForm";
import { statusLabel, type SiteThemeProps } from "./types";

const statusDot = {
  available: "text-[#131313]",
  reserved: "text-[#8A5A3B]",
  sold: "text-[#8A8A86]",
} as const;

export function MinimalTheme({ projectId, name, address, description, floorPlans, units }: SiteThemeProps) {
  const floorPlanById = new Map(floorPlans.map((fp) => [fp.id, fp]));
  const availableUnits = units.filter((u) => u.status !== "sold");
  const availableCount = availableUnits.length;

  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} min-h-full bg-white text-[#131313]`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[#E8E8E6] px-6 py-8 sm:px-20">
        <span className="text-lg font-semibold uppercase tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {name}
        </span>
        <nav aria-label="Fő navigáció" className="flex flex-wrap items-center gap-6 sm:gap-11">
          <a href="#projekt" className="text-sm font-medium text-[#131313]">
            A projektről
          </a>
          {floorPlans.length > 0 ? (
            <a href="#alaprajzok" className="text-sm font-medium text-[#131313]">
              Alaprajzok
            </a>
          ) : null}
          <a href="#lakasok" className="text-sm font-medium text-[#131313]">
            Lakáslista
          </a>
          <a href="#ajanlat" className="inline-flex items-center bg-[#131313] px-5 py-3 text-sm font-medium text-white">
            Ajánlatkérés
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="flex flex-col gap-14 border-b border-[#E8E8E6] px-6 py-16 sm:px-20">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h1
            className="max-w-3xl text-[44px] font-medium leading-[0.98] tracking-tight text-[#131313] sm:text-[64px]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Tiszta terek,
            <br />
            pontos tervek.
          </h1>
          <div className="flex max-w-[280px] flex-col gap-3.5 pb-2">
            {address ? (
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]">{address}</span>
            ) : null}
            {description ? <p className="text-[15px] leading-relaxed text-[#4A4A46]">{description}</p> : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-px border border-[#E8E8E6] bg-[#E8E8E6]">
          <div className="flex-1 bg-white px-7 py-6 min-w-[140px]">
            <div className="text-[28px] font-semibold text-[#131313]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {units.length}
            </div>
            <div className="mt-1 text-[13px] text-[#8A8A86]">lakás összesen</div>
          </div>
          <div className="flex-1 bg-white px-7 py-6 min-w-[140px]">
            <div className="text-[28px] font-semibold text-[#131313]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {availableCount}
            </div>
            <div className="mt-1 text-[13px] text-[#8A8A86]">szabad</div>
          </div>
          {floorPlans.length > 0 ? (
            <div className="flex-1 bg-white px-7 py-6 min-w-[140px]">
              <div className="text-[28px] font-semibold text-[#131313]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {floorPlans.length}
              </div>
              <div className="mt-1 text-[13px] text-[#8A8A86]">alaprajz típus</div>
            </div>
          ) : null}
          <a
            href="#lakasok"
            className="flex flex-[2] min-w-[200px] items-center justify-center gap-3 bg-[#131313] px-7 py-6 text-sm font-medium text-white"
          >
            Lakáslista megtekintése →
          </a>
        </div>
      </section>

      {/* ALAPRAJZOK */}
      {floorPlans.length > 0 ? (
        <section id="alaprajzok" className="flex flex-col gap-0 border-b border-[#E8E8E6]">
          <div className="px-6 pb-10 pt-16 sm:px-20">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]">02 — Alaprajzok</span>
            <h2
              className="mt-4 text-[30px] font-medium leading-tight text-[#131313]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Tervezett terek, pontos méretek
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            {floorPlans.map((fp) => (
              <div key={fp.id} className="flex flex-col border-t border-[#E8E8E6]">
                <div className="flex h-64 items-center justify-center border-b border-[#E8E8E6] bg-[#FAFAF9]">
                  {fp.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fp.image_url} alt={fp.name} className="h-full w-full object-contain p-8" />
                  ) : (
                    <span className="text-xs text-[#8A8A86]">Alaprajz</span>
                  )}
                </div>
                <div className="flex items-center justify-between px-8 py-6">
                  <span className="text-lg font-semibold text-[#131313]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {fp.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* LAKÁSLISTA */}
      <section id="lakasok" className="flex flex-col gap-0 border-b border-[#E8E8E6]">
        <div className="px-6 pb-10 pt-16 sm:px-20">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]">03 — Lakáslista</span>
          <h2
            className="mt-4 text-[30px] font-medium leading-tight text-[#131313]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Élőben frissülő elérhetőség
          </h2>
        </div>

        {units.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] border-t border-[#E8E8E6]">
            {units.map((u) => {
              const fp = u.floor_plan_id ? floorPlanById.get(u.floor_plan_id) : null;
              const sold = u.status === "sold";
              return (
                <div
                  key={u.id}
                  className={`flex flex-col gap-5 border-b border-r border-[#E8E8E6] p-8 ${sold ? "opacity-55" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-semibold text-[#131313]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {u.unit_number}
                      </div>
                      <div className="mt-1 text-[13px] text-[#8A8A86]">
                        {u.floor !== null ? `${u.floor}. emelet` : ""}
                        {fp ? ` · ${fp.name}` : ""}
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wide ${statusDot[u.status]}`}>
                      ● {statusLabel[u.status]}
                    </span>
                  </div>
                  <div className="flex gap-6 border-t border-[#F0F0EE] py-3.5">
                    {u.area_sqm ? (
                      <div>
                        <div className="text-[16px] font-medium text-[#131313]">{u.area_sqm} m²</div>
                        <div className="mt-0.5 text-xs text-[#8A8A86]">terület</div>
                      </div>
                    ) : null}
                    {u.room_count ? (
                      <div>
                        <div className="text-[16px] font-medium text-[#131313]">{u.room_count} szoba</div>
                        <div className="mt-0.5 text-xs text-[#8A8A86]">elrendezés</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between">
                    {u.price ? (
                      <span className="text-[20px] font-semibold text-[#131313]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {u.price.toLocaleString("hu-HU")} Ft
                      </span>
                    ) : (
                      <span />
                    )}
                    {u.status === "available" ? (
                      <a href="#ajanlat" className="text-[13px] font-medium text-[#8A5A3B]">
                        Ajánlatot kérek →
                      </a>
                    ) : (
                      <span className="text-[13px] text-[#B5B5B0]">
                        {u.status === "reserved" ? "Foglalás alatt" : "Nem elérhető"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="px-6 pb-16 text-sm text-[#8A8A86] sm:px-20">A lakáslista hamarosan elérhető.</p>
        )}
      </section>

      {/* AJÁNLATKÉRÉS */}
      <section id="ajanlat" className="flex flex-wrap border-b border-[#E8E8E6]">
        <div className="flex-1 min-w-[280px] border-r border-[#E8E8E6] px-6 py-16 sm:px-20">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]">04 — Ajánlatkérés</span>
          <h2
            className="mt-4 text-[30px] font-medium leading-tight text-[#131313]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Kérjen személyre
            <br />
            szabott ajánlatot
          </h2>
          <p className="mt-4 max-w-[320px] text-[15px] leading-relaxed text-[#4A4A46]">
            Hamarosan felvesszük Önnel a kapcsolatot.
          </p>
        </div>
        <div className="flex-1 min-w-[280px] px-6 py-16 sm:px-20">
          <LeadForm
            projectId={projectId}
            variant="minimal"
            units={availableUnits.map((u) => ({ id: u.id, unit_number: u.unit_number }))}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-5 px-6 py-8 sm:px-20">
        <span className="text-sm font-semibold uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {name}
        </span>
        <span className="text-[13px] text-[#8A8A86]">
          {address ? `${address} — ` : ""}Készült a Prestate platformon
        </span>
      </footer>
    </div>
  );
}
