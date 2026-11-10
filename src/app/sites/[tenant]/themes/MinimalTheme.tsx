import { spaceGrotesk, inter } from "../fonts";
import { LeadForm } from "../LeadForm";
import { BuildingExplorer } from "./BuildingExplorer";
import { HeroGallery } from "./HeroGallery";
import { LocationMap } from "./LocationMap";
import { UnitsFilterList } from "./UnitsFilterList";
import type { SiteThemeProps } from "./types";

const DEFAULT_ACCENT = "#131313";

export function MinimalTheme({
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

  const numberedBlockTypes = ["unit_list", "location", "offer"] as const;
  const eyebrowNumber = (type: string) => {
    const idx = sortedBlocks
      .filter((b) => (numberedBlockTypes as readonly string[]).includes(b.type))
      .findIndex((b) => b.type === type);
    return String(idx + 2).padStart(2, "0");
  };

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
          <a href="#lakasok" className="text-sm font-medium text-[#131313]">
            Lakáslista
          </a>
          <a
            href="#ajanlat"
            className="inline-flex items-center px-5 py-3 text-sm font-medium text-white"
            style={{ backgroundColor: accent }}
          >
            Ajánlatkérés
          </a>
        </nav>
      </header>

      {sortedBlocks.map((block) => {
        if (block.type === "hero") {
          return (
            <section key={block.id} className="flex flex-col gap-14 border-b border-[#E8E8E6] px-6 py-16 sm:px-20">
              <div
                className={`relative flex flex-wrap items-end justify-between gap-8 ${
                  hasGallery ? "overflow-hidden px-6 py-10 sm:px-10 sm:py-14 min-h-[380px] sm:min-h-[460px]" : ""
                }`}
              >
                {hasGallery ? (
                  <>
                    <div className="absolute inset-0">
                      <HeroGallery images={galleryImages} variant="minimal" fullBleed className="h-full w-full" />
                    </div>
                    <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.5)" }} />
                  </>
                ) : null}
                <h1
                  className="relative z-10 max-w-3xl text-[44px] font-medium leading-[0.98] tracking-tight text-[#131313] sm:text-[64px]"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: hasGallery ? "#FFFFFF" : undefined }}
                >
                  Tiszta terek,
                  <br />
                  pontos tervek.
                </h1>
                <div className="relative z-10 flex max-w-[280px] flex-col gap-3.5 pb-2">
                  {address ? (
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]"
                      style={hasGallery ? { color: "rgba(255,255,255,0.75)" } : undefined}
                    >
                      {address}
                    </span>
                  ) : null}
                  {description ? (
                    <p
                      className="text-[15px] leading-relaxed text-[#4A4A46]"
                      style={hasGallery ? { color: "rgba(255,255,255,0.85)" } : undefined}
                    >
                      {description}
                    </p>
                  ) : null}
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
                  className="flex flex-[2] min-w-[200px] items-center justify-center gap-3 px-7 py-6 text-sm font-medium text-white"
                  style={{ backgroundColor: accent }}
                >
                  Lakáslista megtekintése →
                </a>
              </div>
            </section>
          );
        }

        if (block.type === "building_explorer") {
          if (!buildingImageUrl || hotspots.length === 0) return null;
          return (
            <section key={block.id} className="border-b border-[#E8E8E6] px-6 py-16 sm:px-20">
              <BuildingExplorer
                projectId={projectId}
                buildingImageUrl={buildingImageUrl}
                hotspots={hotspots}
                units={units}
                floorPlans={floorPlans}
                roomsByUnit={roomsByUnit}
                variant="minimal"
                accentColor={accent}
              />
            </section>
          );
        }

        if (block.type === "unit_list") {
          return (
            <section key={block.id} id="lakasok" className="flex flex-col gap-0 border-b border-[#E8E8E6]">
              <div className="px-6 pb-10 pt-16 sm:px-20">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]">
                  {eyebrowNumber("unit_list")} — Lakáslista
                </span>
                <h2
                  className="mt-4 text-[30px] font-medium leading-tight text-[#131313]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Élőben frissülő elérhetőség
                </h2>
              </div>

              <div className="px-6 pb-16 sm:px-20">
                <UnitsFilterList
                  projectId={projectId}
                  units={units}
                  floorPlans={floorPlans}
                  roomsByUnit={roomsByUnit}
                  variant="minimal"
                  accentColor={accent}
                />
              </div>
            </section>
          );
        }

        if (block.type === "location") {
          if (!address) return null;
          return (
            <section key={block.id} className="flex flex-col gap-6 border-b border-[#E8E8E6] px-6 py-16 sm:px-20">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]">
                  {eyebrowNumber("location")} — Helyszín
                </span>
                <h2
                  className="mt-4 text-[30px] font-medium leading-tight text-[#131313]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {address}
                </h2>
              </div>
              <LocationMap address={address} name={name} frameClassName="overflow-hidden border border-[#E8E8E6]" />
            </section>
          );
        }

        if (block.type === "offer") {
          return (
            <section key={block.id} id="ajanlat" className="flex flex-wrap border-b border-[#E8E8E6]">
              <div className="flex-1 min-w-[280px] border-r border-[#E8E8E6] px-6 py-16 sm:px-20">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]">
                  {eyebrowNumber("offer")} — Ajánlatkérés
                </span>
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
          );
        }

        if (block.type === "text") {
          if (!block.title && !block.body) return null;
          return (
            <section key={block.id} className="flex flex-col gap-4 border-b border-[#E8E8E6] px-6 py-16 sm:px-20">
              {block.title ? (
                <h2
                  className="text-[30px] font-medium leading-tight text-[#131313]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {block.title}
                </h2>
              ) : null}
              {block.body ? <p className="max-w-[640px] text-[15px] leading-relaxed text-[#4A4A46]">{block.body}</p> : null}
            </section>
          );
        }

        return null;
      })}

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
