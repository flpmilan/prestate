"use client";

import { useMemo, useState } from "react";
import type { FloorHotspot, FloorPlan, Unit, UnitRoom } from "@/lib/types";
import { statusLabel } from "./types";
import { UnitDetailModal, type Variant } from "./UnitDetailModal";

const V = {
  warm: {
    headingFont: { fontFamily: "var(--font-fraunces)" },
    eyebrow: "text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9C5636]",
    heading: "text-[32px] font-normal text-[#2A2420]",
    hint: "text-sm text-[#8A7E6E]",
    frame: "overflow-hidden rounded-[3px] border border-[#EADFCF]",
    hotspotIdle: "border-2 border-transparent hover:border-[#BD6B43] hover:bg-[#2A2420]/10",
    hotspotActive: "border-2 border-[#BD6B43] bg-[#BD6B43]/20",
    hotspotLabel: "bg-[#2A2420] text-[#FBF7F1]",
    panel: "rounded-[3px] border border-[#EADFCF] bg-white",
    panelHeading: "text-[#2A2420]",
    row: "border-b border-[#F0E8DA] last:border-0 hover:bg-[#FAF4EC]",
    rowDisabled: "opacity-50 hover:bg-transparent",
    price: "text-[#2A2420]",
    sub: "text-[#8A7E6E]",
    badge: {
      available: "bg-[#E9EEE2] text-[#4A5A3D]",
      reserved: "bg-[#FBEEDD] text-[#8A5A1E]",
      sold: "bg-[#EFEAE3] text-[#8A8075]",
    },
  },
  dark: {
    headingFont: { fontFamily: "var(--font-playfair)" },
    eyebrow: "text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A063]",
    heading: "text-[30px] font-medium text-[#F6F0E6]",
    hint: "text-sm text-[#786B57]",
    frame: "overflow-hidden border border-[#2E2820]",
    hotspotIdle: "border-2 border-transparent hover:border-[#C9A063] hover:bg-[#C9A063]/10",
    hotspotActive: "border-2 border-[#C9A063] bg-[#C9A063]/20",
    hotspotLabel: "bg-[#C9A063] text-[#16120E]",
    panel: "border border-[#2E2820] bg-[#1C1712]",
    panelHeading: "text-[#F6F0E6]",
    row: "border-b border-[#2E2820] last:border-0 hover:bg-[#231D16]",
    rowDisabled: "opacity-50 hover:bg-transparent",
    price: "text-[#F6F0E6]",
    sub: "text-[#786B57]",
    badge: {
      available: "border border-[#5C7257] text-[#9BBE8E]",
      reserved: "border border-[#8A6A3C] text-[#D7AD72]",
      sold: "border border-[#4A443B] text-[#8A8075]",
    },
  },
  minimal: {
    headingFont: { fontFamily: "var(--font-space-grotesk)" },
    eyebrow: "text-xs font-semibold uppercase tracking-[0.1em] text-[#8A8A86]",
    heading: "text-[30px] font-medium text-[#131313]",
    hint: "text-sm text-[#8A8A86]",
    frame: "overflow-hidden border border-[#E8E8E6]",
    hotspotIdle: "border-2 border-transparent hover:border-[#131313] hover:bg-[#131313]/5",
    hotspotActive: "border-2 border-[#131313] bg-[#131313]/10",
    hotspotLabel: "bg-[#131313] text-white",
    panel: "border border-[#E8E8E6] bg-white",
    panelHeading: "text-[#131313]",
    row: "border-b border-[#E8E8E6] last:border-0 hover:bg-[#FAFAF9]",
    rowDisabled: "opacity-50 hover:bg-transparent",
    price: "text-[#131313]",
    sub: "text-[#8A8A86]",
    badge: {
      available: "text-[#131313]",
      reserved: "text-[#8A5A3B]",
      sold: "text-[#8A8A86]",
    },
  },
} satisfies Record<Variant, Record<string, unknown>>;

export function BuildingExplorer({
  projectId,
  buildingImageUrl,
  hotspots,
  units,
  floorPlans,
  roomsByUnit,
  variant,
  accentColor,
}: {
  projectId: string;
  buildingImageUrl: string;
  hotspots: FloorHotspot[];
  units: Unit[];
  floorPlans: FloorPlan[];
  roomsByUnit: Record<string, UnitRoom[]>;
  variant: Variant;
  accentColor?: string | null;
}) {
  const s = V[variant];
  const [activeFloor, setActiveFloor] = useState<number | null>(null);
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  const floorPlanById = useMemo(() => new Map(floorPlans.map((fp) => [fp.id, fp])), [floorPlans]);
  const unitsOnFloor = useMemo(
    () => (activeFloor === null ? [] : units.filter((u) => u.floor === activeFloor)),
    [units, activeFloor],
  );
  const availableUnits = useMemo(
    () => units.filter((u) => u.status !== "sold").map((u) => ({ id: u.id, unit_number: u.unit_number })),
    [units],
  );

  if (hotspots.length === 0) return null;

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className={s.eyebrow}>Böngéssz az épületben</span>
        <h2 className={s.heading} style={s.headingFont}>
          Kattints egy emeletre a lakásokért
        </h2>
        <p className={s.hint}>A kiválasztott emelet lakásaira kattintva megnézheted a részleteket és az alaprajzot.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
        <div className={`relative ${s.frame}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={buildingImageUrl} alt="Épület látványterve" className="block w-full" />
          {hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setActiveFloor(h.floor)}
              style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
              className={`absolute flex items-end justify-start p-2 transition-colors ${
                activeFloor === h.floor ? s.hotspotActive : s.hotspotIdle
              }`}
              aria-pressed={activeFloor === h.floor}
            >
              <span className={`rounded px-2 py-1 text-xs font-medium ${s.hotspotLabel}`}>
                {h.label ?? `${h.floor}. emelet`}
              </span>
            </button>
          ))}
        </div>

        <div className={`flex flex-col ${s.panel}`}>
          {activeFloor === null ? (
            <p className={`p-6 text-sm ${s.sub}`}>Válassz egy emeletet a látványtervre kattintva.</p>
          ) : unitsOnFloor.length === 0 ? (
            <p className={`p-6 text-sm ${s.sub}`}>Ezen az emeleten jelenleg nincs rögzített lakás.</p>
          ) : (
            <>
              <h3 className={`px-6 pt-6 text-sm font-semibold ${s.panelHeading}`} style={s.headingFont}>
                {hotspots.find((h) => h.floor === activeFloor)?.label ?? `${activeFloor}. emelet`}
              </h3>
              <div className="mt-4 flex flex-col">
                {unitsOnFloor.map((u) => {
                  const sold = u.status === "sold";
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setActiveUnit(u)}
                      className={`flex items-center justify-between gap-4 px-6 py-4 text-left ${s.row}`}
                    >
                      <div>
                        <div className={`font-medium ${s.price}`}>{u.unit_number}</div>
                        <div className={`text-xs ${s.sub}`}>
                          {u.area_sqm ? `${u.area_sqm} m²` : ""}
                          {u.room_count ? ` · ${u.room_count} szoba` : ""}
                        </div>
                      </div>
                      <span className={`rounded px-2.5 py-1 text-[11px] font-semibold uppercase ${s.badge[u.status]} ${sold ? s.rowDisabled : ""}`}>
                        {statusLabel[u.status]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {activeUnit ? (
        <UnitDetailModal
          unit={activeUnit}
          floorPlan={activeUnit.floor_plan_id ? floorPlanById.get(activeUnit.floor_plan_id) ?? null : null}
          rooms={roomsByUnit[activeUnit.id] ?? []}
          projectId={projectId}
          availableUnits={availableUnits}
          variant={variant}
          accentColor={accentColor}
          onClose={() => setActiveUnit(null)}
        />
      ) : null}
    </section>
  );
}
