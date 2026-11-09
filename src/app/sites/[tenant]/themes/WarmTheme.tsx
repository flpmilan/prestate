import { fraunces, inter } from "../fonts";
import { LeadForm } from "../LeadForm";
import { statusLabel, type SiteThemeProps } from "./types";

const statusBadge = {
  available: "bg-[#E9EEE2] text-[#4A5A3D]",
  reserved: "bg-[#FBEEDD] text-[#8A5A1E]",
  sold: "bg-[#EFEAE3] text-[#8A8075]",
} as const;

export function WarmTheme({ projectId, name, address, description, floorPlans, units }: SiteThemeProps) {
  const floorPlanById = new Map(floorPlans.map((fp) => [fp.id, fp]));
  const availableUnits = units.filter((u) => u.status !== "sold");
  const availableCount = availableUnits.length;

  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-full bg-[#FBF7F1] text-[#2A2420]`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[#EADFCF] px-6 py-7 sm:px-20">
        <div className="flex items-baseline gap-2.5">
          <span
            className="text-2xl font-medium tracking-tight text-[#2A2420]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {name}
          </span>
          <span className="text-xs tracking-wide text-[#9C8F7E]">by Prestate</span>
        </div>
        <nav aria-label="Fő navigáció" className="flex flex-wrap items-center gap-6 sm:gap-10">
          <a href="#projekt" className="text-sm font-medium text-[#5B5147]">
            A projektről
          </a>
          {floorPlans.length > 0 ? (
            <a href="#alaprajzok" className="text-sm font-medium text-[#5B5147]">
              Alaprajzok
            </a>
          ) : null}
          <a href="#lakasok" className="text-sm font-medium text-[#5B5147]">
            Lakáslista
          </a>
          <a href="#ajanlat" className="inline-flex items-center rounded-[2px] bg-[#BD6B43] px-6 py-2.5 text-sm font-medium text-[#FBF7F1] hover:bg-[#C97B55]">
            Ajánlatkérés
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="relative flex min-h-[560px] items-center overflow-hidden px-6 py-16 sm:px-20"
        style={{
          background:
            "radial-gradient(ellipse 900px 600px at 82% 18%, #F3DEC4 0%, rgba(243,222,196,0) 60%), radial-gradient(ellipse 700px 500px at 100% 100%, #EAD9C2 0%, rgba(234,217,194,0) 55%), #FBF7F1",
        }}
      >
        <div className="relative flex max-w-xl flex-col gap-7">
          {address ? (
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]">
              {address}
            </span>
          ) : null}
          <h1
            className="text-[44px] font-normal leading-[1.1] text-[#2A2420] sm:text-[56px]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Otthon, ahol a <em className="text-[#9C5636]">részletek</em> is helyükre kerülnek
          </h1>
          {description ? (
            <p className="max-w-[480px] text-lg leading-relaxed text-[#5B5147]">{description}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <a
              href="#lakasok"
              className="inline-flex items-center rounded-[2px] bg-[#2A2420] px-7 py-3.5 text-[15px] font-medium text-[#FBF7F1]"
            >
              Lakáslista megtekintése
            </a>
            <a
              href="#ajanlat"
              className="inline-flex items-center rounded-[2px] border border-[#2A2420] px-7 py-3.5 text-[15px] font-medium text-[#2A2420]"
            >
              Ajánlatot kérek
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-10 border-t border-[#E4D7C4] pt-6">
            <div>
              <div className="text-[28px] font-medium text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
                {units.length}
              </div>
              <div className="mt-0.5 text-[13px] text-[#8A7E6E]">lakás összesen</div>
            </div>
            <div>
              <div className="text-[28px] font-medium text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
                {availableCount}
              </div>
              <div className="mt-0.5 text-[13px] text-[#8A7E6E]">szabad</div>
            </div>
            {floorPlans.length > 0 ? (
              <div>
                <div className="text-[28px] font-medium text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {floorPlans.length}
                </div>
                <div className="mt-0.5 text-[13px] text-[#8A7E6E]">alaprajz típus</div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ALAPRAJZOK */}
      {floorPlans.length > 0 ? (
        <section id="alaprajzok" className="flex flex-col gap-10 px-6 py-20 sm:px-20">
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]">
              Alaprajzok
            </span>
            <h2 className="text-[32px] font-normal text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
              Tervezett terek, pontos méretek
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-6">
            {floorPlans.map((fp) => (
              <div key={fp.id} className="overflow-hidden rounded-[3px] border border-[#EADFCF] bg-white">
                <div
                  className="flex h-56 items-center justify-center"
                  style={{ background: "linear-gradient(160deg, #F6EEE2 0%, #EEE0CA 100%)" }}
                >
                  {fp.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fp.image_url} alt={fp.name} className="h-full w-full object-contain p-6" />
                  ) : (
                    <span className="text-xs text-[#9C8F7E]">Alaprajz</span>
                  )}
                </div>
                <div className="flex items-center justify-between px-6 py-5">
                  <span className="text-lg font-medium text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
                    {fp.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* LAKÁSLISTA */}
      <section id="lakasok" className="flex flex-col gap-10 px-6 py-20 sm:px-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]">
              Lakáslista
            </span>
            <h2 className="text-[32px] font-normal text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
              Élőben frissülő elérhetőség
            </h2>
          </div>
        </div>

        {units.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
            {units.map((u) => {
              const fp = u.floor_plan_id ? floorPlanById.get(u.floor_plan_id) : null;
              const sold = u.status === "sold";
              return (
                <div
                  key={u.id}
                  className={`flex flex-col gap-5 rounded-[3px] border border-[#EADFCF] bg-white p-7 ${sold ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-medium text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
                        {u.unit_number}
                      </div>
                      <div className="mt-1 text-sm text-[#8A7E6E]">
                        {u.floor !== null ? `${u.floor}. emelet` : ""}
                        {fp ? ` · ${fp.name}` : ""}
                      </div>
                    </div>
                    <span className={`rounded-[2px] px-3 py-1.5 text-xs font-semibold ${statusBadge[u.status]}`}>
                      {statusLabel[u.status]}
                    </span>
                  </div>
                  <div className="flex gap-6 border-y border-[#F0E8DA] py-4">
                    {u.area_sqm ? (
                      <div>
                        <div className="text-[17px] font-medium text-[#2A2420]">{u.area_sqm} m²</div>
                        <div className="mt-0.5 text-xs text-[#9C8F7E]">terület</div>
                      </div>
                    ) : null}
                    {u.room_count ? (
                      <div>
                        <div className="text-[17px] font-medium text-[#2A2420]">{u.room_count} szoba</div>
                        <div className="mt-0.5 text-xs text-[#9C8F7E]">elrendezés</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between">
                    {u.price ? (
                      <span className="text-[22px] font-medium text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
                        {u.price.toLocaleString("hu-HU")} Ft
                      </span>
                    ) : (
                      <span />
                    )}
                    {u.status === "available" ? (
                      <a href="#ajanlat" className="text-sm font-medium text-[#9C5636]">
                        Ajánlatot kérek →
                      </a>
                    ) : (
                      <span className="text-sm text-[#B9AD9A]">
                        {u.status === "reserved" ? "Foglalás alatt" : "Nem elérhető"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[#8A7E6E]">A lakáslista hamarosan elérhető.</p>
        )}
      </section>

      {/* AJÁNLATKÉRÉS */}
      <section id="ajanlat" className="flex flex-wrap gap-14 bg-[#2A2420] px-6 py-20 sm:px-20">
        <div className="flex max-w-[480px] flex-1 flex-col gap-5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#D9A373]">
            Ajánlatkérés
          </span>
          <h2 className="text-[32px] font-normal text-[#FBF7F1]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Kérjen személyre szabott ajánlatot
          </h2>
          <p className="text-[15px] leading-relaxed text-[#BDB2A1]">
            Adja meg elérhetőségét, és hamarosan felvesszük Önnel a kapcsolatot a kiválasztott lakással
            kapcsolatban.
          </p>
        </div>
        <div className="max-w-[520px] flex-1">
          <LeadForm
            projectId={projectId}
            variant="warm"
            units={availableUnits.map((u) => ({ id: u.id, unit_number: u.unit_number }))}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#EADFCF] px-6 py-8 sm:px-20">
        <div className="flex flex-col gap-1">
          <span className="text-base text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
            {name}
          </span>
          {address ? <span className="text-[13px] text-[#9C8F7E]">{address}</span> : null}
        </div>
        <span className="text-[13px] text-[#9C8F7E]">Készült a Prestate platformon</span>
      </footer>
    </div>
  );
}
