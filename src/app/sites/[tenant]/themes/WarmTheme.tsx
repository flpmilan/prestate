import { fraunces, inter } from "../fonts";
import { LeadForm } from "../LeadForm";
import { BuildingExplorer } from "./BuildingExplorer";
import { HeroGallery } from "./HeroGallery";
import { UnitsFilterList } from "./UnitsFilterList";
import type { SiteThemeProps } from "./types";

export function WarmTheme({
  projectId,
  name,
  address,
  description,
  floorPlans,
  units,
  buildingImageUrl,
  hotspots,
  roomsByUnit,
  galleryImages,
}: SiteThemeProps) {
  const availableUnits = units.filter((u) => u.status !== "sold");
  const availableCount = availableUnits.length;
  const hasGallery = galleryImages.length > 0;

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
        className="relative flex min-h-[620px] items-center overflow-hidden px-6 py-16 sm:px-20"
        style={
          hasGallery
            ? undefined
            : {
                background:
                  "radial-gradient(ellipse 900px 600px at 82% 18%, #F3DEC4 0%, rgba(243,222,196,0) 60%), radial-gradient(ellipse 700px 500px at 100% 100%, #EAD9C2 0%, rgba(234,217,194,0) 55%), #FBF7F1",
              }
        }
      >
        {hasGallery ? (
          <>
            <div className="absolute inset-0">
              <HeroGallery images={galleryImages} variant="warm" fullBleed className="h-full w-full" />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(100deg, rgba(20,16,13,0.82) 0%, rgba(20,16,13,0.55) 45%, rgba(20,16,13,0.18) 75%, rgba(20,16,13,0) 100%)",
              }}
            />
          </>
        ) : null}
        <div className="relative z-10 flex max-w-xl flex-col gap-7">
          {address ? (
            <span
              className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]"
              style={hasGallery ? { color: "#F0C49A" } : undefined}
            >
              {address}
            </span>
          ) : null}
          <h1
            className="text-[44px] font-normal leading-[1.1] text-[#2A2420] sm:text-[56px]"
            style={{ fontFamily: "var(--font-fraunces)", color: hasGallery ? "#FFFFFF" : undefined }}
          >
            Otthon, ahol a{" "}
            <em className="text-[#9C5636]" style={hasGallery ? { color: "#F0B88A" } : undefined}>
              részletek
            </em>{" "}
            is helyükre kerülnek
          </h1>
          {description ? (
            <p
              className="max-w-[480px] text-lg leading-relaxed text-[#5B5147]"
              style={hasGallery ? { color: "rgba(255,255,255,0.85)" } : undefined}
            >
              {description}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <a
              href="#lakasok"
              className="inline-flex items-center rounded-[2px] bg-[#2A2420] px-7 py-3.5 text-[15px] font-medium text-[#FBF7F1]"
              style={hasGallery ? { backgroundColor: "#FFFFFF", color: "#2A2420" } : undefined}
            >
              Lakáslista megtekintése
            </a>
            <a
              href="#ajanlat"
              className="inline-flex items-center rounded-[2px] border border-[#2A2420] px-7 py-3.5 text-[15px] font-medium text-[#2A2420]"
              style={hasGallery ? { borderColor: "#FFFFFF", color: "#FFFFFF" } : undefined}
            >
              Ajánlatot kérek
            </a>
          </div>
          <div
            className="mt-6 flex flex-wrap items-center gap-10 border-t border-[#E4D7C4] pt-6"
            style={hasGallery ? { borderColor: "rgba(255,255,255,0.25)" } : undefined}
          >
            <div>
              <div
                className="text-[28px] font-medium text-[#2A2420]"
                style={{ fontFamily: "var(--font-fraunces)", color: hasGallery ? "#FFFFFF" : undefined }}
              >
                {units.length}
              </div>
              <div
                className="mt-0.5 text-[13px] text-[#8A7E6E]"
                style={hasGallery ? { color: "rgba(255,255,255,0.75)" } : undefined}
              >
                lakás összesen
              </div>
            </div>
            <div>
              <div
                className="text-[28px] font-medium text-[#2A2420]"
                style={{ fontFamily: "var(--font-fraunces)", color: hasGallery ? "#FFFFFF" : undefined }}
              >
                {availableCount}
              </div>
              <div
                className="mt-0.5 text-[13px] text-[#8A7E6E]"
                style={hasGallery ? { color: "rgba(255,255,255,0.75)" } : undefined}
              >
                szabad
              </div>
            </div>
            {floorPlans.length > 0 ? (
              <div>
                <div
                  className="text-[28px] font-medium text-[#2A2420]"
                  style={{ fontFamily: "var(--font-fraunces)", color: hasGallery ? "#FFFFFF" : undefined }}
                >
                  {floorPlans.length}
                </div>
                <div
                  className="mt-0.5 text-[13px] text-[#8A7E6E]"
                  style={hasGallery ? { color: "rgba(255,255,255,0.75)" } : undefined}
                >
                  alaprajz típus
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* BÖNGÉSZŐ */}
      {buildingImageUrl && hotspots.length > 0 ? (
        <section className="px-6 py-20 sm:px-20">
          <BuildingExplorer
            projectId={projectId}
            buildingImageUrl={buildingImageUrl}
            hotspots={hotspots}
            units={units}
            floorPlans={floorPlans}
            roomsByUnit={roomsByUnit}
            variant="warm"
          />
        </section>
      ) : null}

      {/* LAKÁSLISTA */}
      <section id="lakasok" className="flex flex-col gap-10 px-6 py-20 sm:px-20">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]">Lakáslista</span>
          <h2 className="text-[32px] font-normal text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
            Élőben frissülő elérhetőség
          </h2>
        </div>

        <UnitsFilterList
          projectId={projectId}
          units={units}
          floorPlans={floorPlans}
          roomsByUnit={roomsByUnit}
          variant="warm"
        />
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
