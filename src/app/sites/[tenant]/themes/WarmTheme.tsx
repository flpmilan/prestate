import { fraunces, inter } from "../fonts";
import { LeadForm } from "../LeadForm";
import { BuildingExplorer } from "./BuildingExplorer";
import { HeroGallery } from "./HeroGallery";
import { LocationMap } from "./LocationMap";
import { UnitsFilterList } from "./UnitsFilterList";
import type { SiteThemeProps } from "./types";

const DEFAULT_ACCENT = "#9C5636";

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
  blocks,
  accentColor,
}: SiteThemeProps) {
  const availableUnits = units.filter((u) => u.status !== "sold");
  const availableCount = availableUnits.length;
  const hasGallery = galleryImages.length > 0;
  const accent = accentColor ?? DEFAULT_ACCENT;
  const sortedBlocks = [...blocks].filter((b) => b.visible).sort((a, b) => a.position - b.position);

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
          <a
            href="#ajanlat"
            className="inline-flex items-center rounded-[2px] px-6 py-2.5 text-sm font-medium text-[#FBF7F1]"
            style={{ backgroundColor: accent }}
          >
            Ajánlatkérés
          </a>
        </nav>
      </header>

      {sortedBlocks.map((block) => {
        if (block.type === "hero") {
          return (
            <section
              key={block.id}
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
                    className="text-[13px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: hasGallery ? "#F0C49A" : accent }}
                  >
                    {address}
                  </span>
                ) : null}
                <h1
                  className="text-[44px] font-normal leading-[1.1] text-[#2A2420] sm:text-[56px]"
                  style={{ fontFamily: "var(--font-fraunces)", color: hasGallery ? "#FFFFFF" : undefined }}
                >
                  Otthon, ahol a{" "}
                  <em style={{ color: hasGallery ? "#F0B88A" : accent, fontStyle: "italic" }}>részletek</em> is
                  helyükre kerülnek
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
          );
        }

        if (block.type === "building_explorer") {
          if (!buildingImageUrl || hotspots.length === 0) return null;
          return (
            <section key={block.id} className="px-6 py-20 sm:px-20">
              <BuildingExplorer
                projectId={projectId}
                buildingImageUrl={buildingImageUrl}
                hotspots={hotspots}
                units={units}
                floorPlans={floorPlans}
                roomsByUnit={roomsByUnit}
                variant="warm"
                accentColor={accent}
              />
            </section>
          );
        }

        if (block.type === "unit_list") {
          return (
            <section key={block.id} id="lakasok" className="flex flex-col gap-10 px-6 py-20 sm:px-20">
              <div className="flex flex-col gap-3">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                  Lakáslista
                </span>
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
                accentColor={accent}
              />
            </section>
          );
        }

        if (block.type === "location") {
          if (!address) return null;
          return (
            <section key={block.id} className="flex flex-col gap-6 border-t border-[#EADFCF] px-6 py-20 sm:px-20">
              <div className="flex flex-col gap-3">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                  Helyszín
                </span>
                <h2 className="text-[32px] font-normal text-[#2A2420]" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {address}
                </h2>
              </div>
              <LocationMap address={address} name={name} frameClassName="overflow-hidden rounded-[3px] border border-[#EADFCF]" />
            </section>
          );
        }

        if (block.type === "offer") {
          return (
            <section
              key={block.id}
              id="ajanlat"
              className="flex flex-wrap gap-14 bg-[#2A2420] px-6 py-20 sm:px-20"
            >
              <div className="flex max-w-[480px] flex-1 flex-col gap-5">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
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
          );
        }

        if (block.type === "text") {
          if (!block.title && !block.body) return null;
          return (
            <section key={block.id} className="flex flex-col gap-4 border-t border-[#EADFCF] px-6 py-20 sm:px-20">
              {block.title ? (
                <h2
                  className="text-[32px] font-normal text-[#2A2420]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {block.title}
                </h2>
              ) : null}
              {block.body ? <p className="max-w-[640px] text-[15px] leading-relaxed text-[#5B5147]">{block.body}</p> : null}
            </section>
          );
        }

        return null;
      })}

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
