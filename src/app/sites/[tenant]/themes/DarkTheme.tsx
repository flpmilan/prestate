import { playfair, inter } from "../fonts";
import { LeadForm } from "../LeadForm";
import { statusLabel, type SiteThemeProps } from "./types";

const statusBadge = {
  available: "border border-[#5C7257] text-[#9BBE8E]",
  reserved: "border border-[#8A6A3C] text-[#D7AD72]",
  sold: "border border-[#4A443B] text-[#8A8075]",
} as const;

export function DarkTheme({ projectId, name, address, description, floorPlans, units }: SiteThemeProps) {
  const floorPlanById = new Map(floorPlans.map((fp) => [fp.id, fp]));
  const availableUnits = units.filter((u) => u.status !== "sold");
  const availableCount = availableUnits.length;

  return (
    <div
      className={`${playfair.variable} ${inter.variable} min-h-full bg-[#16120E] text-[#F2EAE0]`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[#2E2820] px-6 py-7 sm:px-20">
        <div className="flex items-baseline gap-2.5">
          <span
            className="text-2xl font-semibold text-[#F2EAE0]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {name}
          </span>
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#786B57]">by Prestate</span>
        </div>
        <nav aria-label="Fő navigáció" className="flex flex-wrap items-center gap-6 sm:gap-10">
          <a href="#projekt" className="text-sm font-medium text-[#BDAE97]">
            A projektről
          </a>
          {floorPlans.length > 0 ? (
            <a href="#alaprajzok" className="text-sm font-medium text-[#BDAE97]">
              Alaprajzok
            </a>
          ) : null}
          <a href="#lakasok" className="text-sm font-medium text-[#BDAE97]">
            Lakáslista
          </a>
          <a
            href="#ajanlat"
            className="inline-flex items-center border border-[#C9A063] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#C9A063]"
          >
            Ajánlatkérés
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="relative flex min-h-[600px] items-center overflow-hidden px-6 py-16 sm:px-20"
        style={{
          background:
            "radial-gradient(ellipse 1000px 700px at 85% 30%, rgba(201,160,99,0.14) 0%, rgba(201,160,99,0) 62%), #16120E",
        }}
      >
        <div className="relative flex max-w-xl flex-col gap-7">
          {address ? (
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A063]">{address}</span>
          ) : null}
          <h1
            className="text-[42px] font-medium leading-[1.1] text-[#F6F0E6] sm:text-[52px]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Egy cím, amit nem kell <span className="italic text-[#C9A063]">magyarázni</span>
          </h1>
          {description ? (
            <p className="max-w-[460px] text-lg leading-relaxed text-[#BDAE97]">{description}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <a
              href="#lakasok"
              className="inline-flex items-center bg-[#C9A063] px-8 py-4 text-sm font-semibold tracking-wide text-[#16120E]"
            >
              LAKÁSLISTA
            </a>
            <a
              href="#ajanlat"
              className="inline-flex items-center border border-[#4A4234] px-8 py-4 text-sm font-medium tracking-wide text-[#F2EAE0]"
            >
              AJÁNLATKÉRÉS
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-10 border-t border-[#2E2820] pt-6">
            <div>
              <div className="text-2xl font-semibold text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
                {units.length}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-[#786B57]">lakás</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
                {availableCount}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-[#786B57]">szabad</div>
            </div>
            {floorPlans.length > 0 ? (
              <div>
                <div className="text-2xl font-semibold text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
                  {floorPlans.length}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-[#786B57]">alaprajz</div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ALAPRAJZOK */}
      {floorPlans.length > 0 ? (
        <section id="alaprajzok" className="flex flex-col gap-10 border-t border-[#2E2820] px-6 py-20 sm:px-20">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A063]">Alaprajzok</span>
            <h2 className="text-[30px] font-medium text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
              Tervezett terek, pontos méretek
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-px bg-[#2E2820]">
            {floorPlans.map((fp) => (
              <div key={fp.id} className="flex flex-col bg-[#1C1712]">
                <div className="flex h-56 items-center justify-center">
                  {fp.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fp.image_url} alt={fp.name} className="h-full w-full object-contain p-6" />
                  ) : (
                    <span className="text-xs text-[#786B57]">Alaprajz</span>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-[#2E2820] px-7 py-5">
                  <span className="text-lg font-semibold text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
                    {fp.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* LAKÁSLISTA */}
      <section id="lakasok" className="flex flex-col gap-10 border-t border-[#2E2820] px-6 py-20 sm:px-20">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A063]">Lakáslista</span>
          <h2 className="text-[30px] font-medium text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
            Élőben frissülő elérhetőség
          </h2>
        </div>

        {units.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-px bg-[#2E2820]">
            {units.map((u) => {
              const fp = u.floor_plan_id ? floorPlanById.get(u.floor_plan_id) : null;
              const sold = u.status === "sold";
              return (
                <div key={u.id} className={`flex flex-col gap-5 bg-[#1C1712] p-7 ${sold ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-semibold text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
                        {u.unit_number}
                      </div>
                      <div className="mt-1 text-sm text-[#786B57]">
                        {u.floor !== null ? `${u.floor}. emelet` : ""}
                        {fp ? ` · ${fp.name}` : ""}
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${statusBadge[u.status]}`}>
                      {statusLabel[u.status]}
                    </span>
                  </div>
                  <div className="flex gap-6 border-y border-[#2E2820] py-4">
                    {u.area_sqm ? (
                      <div>
                        <div className="text-[17px] font-medium text-[#F2EAE0]">{u.area_sqm} m²</div>
                        <div className="mt-0.5 text-xs text-[#786B57]">terület</div>
                      </div>
                    ) : null}
                    {u.room_count ? (
                      <div>
                        <div className="text-[17px] font-medium text-[#F2EAE0]">{u.room_count} szoba</div>
                        <div className="mt-0.5 text-xs text-[#786B57]">elrendezés</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between">
                    {u.price ? (
                      <span className="text-xl font-semibold text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
                        {u.price.toLocaleString("hu-HU")} Ft
                      </span>
                    ) : (
                      <span />
                    )}
                    {u.status === "available" ? (
                      <a href="#ajanlat" className="text-xs font-semibold uppercase tracking-wide text-[#C9A063]">
                        Ajánlatot kérek →
                      </a>
                    ) : (
                      <span className="text-sm text-[#5C543F]">
                        {u.status === "reserved" ? "Foglalás alatt" : "Nem elérhető"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#786B57]">A lakáslista hamarosan elérhető.</p>
        )}
      </section>

      {/* AJÁNLATKÉRÉS */}
      <section id="ajanlat" className="flex flex-wrap gap-14 border-t border-[#2E2820] bg-[#1C1712] px-6 py-20 sm:px-20">
        <div className="flex max-w-[480px] flex-1 flex-col gap-5">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A063]">Ajánlatkérés</span>
          <h2 className="text-[30px] font-medium text-[#F6F0E6]" style={{ fontFamily: "var(--font-playfair)" }}>
            Kérjen személyre szabott ajánlatot
          </h2>
          <p className="text-[15px] leading-relaxed text-[#BDAE97]">
            Adja meg elérhetőségét, és hamarosan felvesszük Önnel a kapcsolatot.
          </p>
        </div>
        <div className="max-w-[520px] flex-1">
          <LeadForm
            projectId={projectId}
            variant="dark"
            units={availableUnits.map((u) => ({ id: u.id, unit_number: u.unit_number }))}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#2E2820] px-6 py-8 sm:px-20">
        <div className="flex flex-col gap-1">
          <span className="text-base text-[#F2EAE0]" style={{ fontFamily: "var(--font-playfair)" }}>
            {name}
          </span>
          {address ? <span className="text-[13px] text-[#786B57]">{address}</span> : null}
        </div>
        <span className="text-[13px] text-[#786B57]">Készült a Prestate platformon</span>
      </footer>
    </div>
  );
}
