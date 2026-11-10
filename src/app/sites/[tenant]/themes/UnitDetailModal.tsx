"use client";

import { useEffect, useState } from "react";
import type { FloorPlan, Unit, UnitRoom } from "@/lib/types";
import { LeadForm } from "../LeadForm";
import { statusLabel } from "./types";

export type Variant = "warm" | "dark" | "minimal";

const V = {
  warm: {
    headingFont: { fontFamily: "var(--font-fraunces)" },
    frame: "overflow-hidden rounded-[3px] border border-[#EADFCF]",
    price: "text-[#2A2420]",
    sub: "text-[#8A7E6E]",
    modal: "bg-[#FBF7F1] text-[#2A2420]",
    modalBorder: "border-[#EADFCF]",
    close: "text-[#8A7E6E] hover:text-[#2A2420]",
    toggle: "border-[#EADFCF] text-[#8A7E6E] hover:text-[#2A2420]",
    toggleActive: "border-[#2A2420] bg-[#2A2420] text-[#FBF7F1]",
  },
  dark: {
    headingFont: { fontFamily: "var(--font-playfair)" },
    frame: "overflow-hidden border border-[#2E2820]",
    price: "text-[#F6F0E6]",
    sub: "text-[#786B57]",
    modal: "bg-[#16120E] text-[#F2EAE0]",
    modalBorder: "border-[#2E2820]",
    close: "text-[#786B57] hover:text-[#F2EAE0]",
    toggle: "border-[#2E2820] text-[#786B57] hover:text-[#F2EAE0]",
    toggleActive: "border-[#C9A063] bg-[#C9A063] text-[#16120E]",
  },
  minimal: {
    headingFont: { fontFamily: "var(--font-space-grotesk)" },
    frame: "overflow-hidden border border-[#E8E8E6]",
    price: "text-[#131313]",
    sub: "text-[#8A8A86]",
    modal: "bg-white text-[#131313]",
    modalBorder: "border-[#E8E8E6]",
    close: "text-[#8A8A86] hover:text-[#131313]",
    toggle: "border-[#E8E8E6] text-[#8A8A86] hover:text-[#131313]",
    toggleActive: "border-[#131313] bg-[#131313] text-white",
  },
} satisfies Record<Variant, Record<string, unknown>>;

export function UnitDetailModal({
  unit,
  floorPlan,
  rooms,
  projectId,
  availableUnits,
  variant,
  onClose,
}: {
  unit: Unit;
  floorPlan: FloorPlan | null;
  rooms: UnitRoom[];
  projectId: string;
  availableUnits: { id: string; unit_number: string }[];
  variant: Variant;
  onClose: () => void;
}) {
  const s = V[variant];
  const floorPlanImage = unit.floor_plan_image_url ?? floorPlan?.image_url ?? null;
  const render3dImage = unit.floor_plan_render_3d_url ?? floorPlan?.render_3d_url ?? null;
  const [showRender, setShowRender] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${unit.unit_number} részletei`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[85vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-[3px] border p-8 ${s.modal} ${s.modalBorder}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl" style={s.headingFont}>
              {unit.unit_number}
            </h3>
            <p className={`mt-1 text-sm ${s.sub}`}>
              {unit.floor !== null ? `${unit.floor}. emelet` : ""}
              {floorPlan ? ` · ${floorPlan.name}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bezárás"
            className={`text-2xl leading-none ${s.close}`}
          >
            ×
          </button>
        </div>

        {floorPlanImage ? (
          <div className="flex flex-col gap-2">
            <div className={`flex h-72 shrink-0 items-center justify-center ${s.frame}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={showRender && render3dImage ? render3dImage : floorPlanImage}
                alt={floorPlan?.name ?? "Alaprajz"}
                className="h-full w-full object-contain p-4"
              />
            </div>
            {render3dImage ? (
              <div className="flex gap-2 self-center">
                <button
                  type="button"
                  onClick={() => setShowRender(false)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${!showRender ? s.toggleActive : s.toggle}`}
                >
                  2D alaprajz
                </button>
                <button
                  type="button"
                  onClick={() => setShowRender(true)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${showRender ? s.toggleActive : s.toggle}`}
                >
                  3D render
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-8">
          {unit.area_sqm ? (
            <div>
              <div className={`text-lg font-medium ${s.price}`}>{unit.area_sqm} m²</div>
              <div className={`text-xs ${s.sub}`}>terület</div>
            </div>
          ) : null}
          {unit.room_count ? (
            <div>
              <div className={`text-lg font-medium ${s.price}`}>{unit.room_count} szoba</div>
              <div className={`text-xs ${s.sub}`}>elrendezés</div>
            </div>
          ) : null}
          {unit.price ? (
            <div>
              <div className={`text-lg font-medium ${s.price}`}>{unit.price.toLocaleString("hu-HU")} Ft</div>
              <div className={`text-xs ${s.sub}`}>irányár</div>
            </div>
          ) : null}
          <div>
            <div className={`text-lg font-medium ${s.price}`}>{statusLabel[unit.status]}</div>
            <div className={`text-xs ${s.sub}`}>státusz</div>
          </div>
        </div>

        {rooms.length > 0 ? (
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${s.sub}`}>Helyiségek</h4>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-baseline justify-between gap-2 text-sm">
                  <span className={s.price}>{room.name}</span>
                  {room.area_sqm ? <span className={s.sub}>{room.area_sqm} m²</span> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {unit.status !== "sold" ? (
          <LeadForm projectId={projectId} variant={variant} units={availableUnits} preselectedUnitId={unit.id} />
        ) : null}
      </div>
    </div>
  );
}
