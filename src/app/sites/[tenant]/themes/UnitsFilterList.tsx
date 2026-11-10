"use client";

import { useMemo, useState } from "react";
import type { FloorPlan, Unit, UnitRoom, UnitStatus } from "@/lib/types";
import { statusLabel } from "./types";
import { UnitDetailModal, type Variant } from "./UnitDetailModal";

const STATUS_OPTIONS: UnitStatus[] = ["available", "reserved", "sold"];

const V = {
  warm: {
    headingFont: { fontFamily: "var(--font-fraunces)" },
    filterBar: "flex flex-wrap items-end gap-4 rounded-[3px] border border-[#EADFCF] bg-white p-5",
    label: "text-xs text-[#8A7E6E]",
    input:
      "rounded-[2px] border border-[#EADFCF] bg-white px-3 py-2 text-sm text-[#2A2420] outline-none focus:border-[#BD6B43]",
    pillActive: "bg-[#2A2420] text-white",
    pillIdle: "border border-[#EADFCF] text-[#5B5147] hover:bg-[#FAF4EC]",
    resultCount: "text-sm text-[#8A7E6E]",
    resetLink: "text-sm font-medium text-[#9C5636] hover:underline",
    listWrapper: "rounded-[3px] border border-[#EADFCF] bg-white",
    headRow: "border-b border-[#EADFCF] text-xs text-[#8A7E6E]",
    row: "border-b border-[#F0E8DA] last:border-0 hover:bg-[#FAF4EC]",
    rowSold: "opacity-60",
    unitNumber: "font-medium text-[#2A2420]",
    cell: "text-[#5B5147]",
    price: "font-medium text-[#2A2420]",
    link: "text-sm font-medium text-[#9C5636] hover:underline",
    empty: "text-sm text-[#8A7E6E]",
    badgeKind: "pill" as const,
    badge: {
      available: "bg-[#E9EEE2] text-[#4A5A3D]",
      reserved: "bg-[#FBEEDD] text-[#8A5A1E]",
      sold: "bg-[#EFEAE3] text-[#8A8075]",
    },
  },
  dark: {
    headingFont: { fontFamily: "var(--font-playfair)" },
    filterBar: "flex flex-wrap items-end gap-4 border border-[#2E2820] bg-[#1C1712] p-5",
    label: "text-xs text-[#786B57]",
    input:
      "border border-[#2E2820] bg-[#16120E] px-3 py-2 text-sm text-[#F2EAE0] outline-none focus:border-[#C9A063]",
    pillActive: "bg-[#C9A063] text-[#16120E]",
    pillIdle: "border border-[#2E2820] text-[#BDAE97] hover:bg-[#231D16]",
    resultCount: "text-sm text-[#786B57]",
    resetLink: "text-sm font-medium text-[#C9A063] hover:underline",
    listWrapper: "border border-[#2E2820] bg-[#1C1712]",
    headRow: "border-b border-[#2E2820] text-xs text-[#786B57]",
    row: "border-b border-[#2E2820] last:border-0 hover:bg-[#231D16]",
    rowSold: "opacity-50",
    unitNumber: "font-semibold text-[#F6F0E6]",
    cell: "text-[#BDAE97]",
    price: "font-semibold text-[#F6F0E6]",
    link: "text-xs font-semibold uppercase tracking-wide text-[#C9A063] hover:underline",
    empty: "text-sm text-[#786B57]",
    badgeKind: "pill" as const,
    badge: {
      available: "border border-[#5C7257] text-[#9BBE8E]",
      reserved: "border border-[#8A6A3C] text-[#D7AD72]",
      sold: "border border-[#4A443B] text-[#8A8075]",
    },
  },
  minimal: {
    headingFont: { fontFamily: "var(--font-space-grotesk)" },
    filterBar: "flex flex-wrap items-end gap-4 border border-[#E8E8E6] p-5",
    label: "text-xs text-[#8A8A86]",
    input: "border border-[#E8E8E6] bg-white px-3 py-2 text-sm text-[#131313] outline-none focus:border-[#131313]",
    pillActive: "bg-[#131313] text-white",
    pillIdle: "border border-[#E8E8E6] text-[#131313] hover:bg-[#FAFAF9]",
    resultCount: "text-sm text-[#8A8A86]",
    resetLink: "text-sm font-medium text-[#8A5A3B] hover:underline",
    listWrapper: "border border-[#E8E8E6]",
    headRow: "border-b border-[#E8E8E6] text-xs text-[#8A8A86]",
    row: "border-b border-[#E8E8E6] last:border-0 hover:bg-[#FAFAF9]",
    rowSold: "opacity-50",
    unitNumber: "font-semibold text-[#131313]",
    cell: "text-[#4A4A46]",
    price: "font-semibold text-[#131313]",
    link: "text-[13px] font-medium text-[#8A5A3B] hover:underline",
    empty: "text-sm text-[#8A8A86]",
    badgeKind: "dot" as const,
    badge: {
      available: "text-[#131313]",
      reserved: "text-[#8A5A3B]",
      sold: "text-[#8A8A86]",
    },
  },
} satisfies Record<Variant, Record<string, unknown>>;

export function UnitsFilterList({
  projectId,
  units,
  floorPlans,
  roomsByUnit,
  variant,
  accentColor,
}: {
  projectId: string;
  units: Unit[];
  floorPlans: FloorPlan[];
  roomsByUnit: Record<string, UnitRoom[]>;
  variant: Variant;
  accentColor?: string | null;
}) {
  const s = V[variant];
  const floorPlanById = useMemo(() => new Map(floorPlans.map((fp) => [fp.id, fp])), [floorPlans]);

  const [statusFilter, setStatusFilter] = useState<Set<UnitStatus>>(new Set());
  const [floorFilter, setFloorFilter] = useState("");
  const [roomsFilter, setRoomsFilter] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  const availableUnits = useMemo(
    () => units.filter((u) => u.status !== "sold").map((u) => ({ id: u.id, unit_number: u.unit_number })),
    [units],
  );

  const floorOptions = useMemo(
    () =>
      Array.from(new Set(units.map((u) => u.floor).filter((f): f is number => f !== null))).sort((a, b) => a - b),
    [units],
  );
  const roomOptions = useMemo(
    () =>
      Array.from(new Set(units.map((u) => u.room_count).filter((r): r is number => r !== null))).sort(
        (a, b) => a - b,
      ),
    [units],
  );

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (statusFilter.size > 0 && !statusFilter.has(u.status)) return false;
      if (floorFilter !== "" && u.floor !== Number(floorFilter)) return false;
      if (roomsFilter !== "" && u.room_count !== Number(roomsFilter)) return false;
      if (minArea !== "" && (u.area_sqm ?? -Infinity) < Number(minArea)) return false;
      if (maxArea !== "" && (u.area_sqm ?? Infinity) > Number(maxArea)) return false;
      if (minPrice !== "" && (u.price ?? -Infinity) < Number(minPrice)) return false;
      if (maxPrice !== "" && (u.price ?? Infinity) > Number(maxPrice)) return false;
      return true;
    });
  }, [units, statusFilter, floorFilter, roomsFilter, minArea, maxArea, minPrice, maxPrice]);

  const hasActiveFilters =
    statusFilter.size > 0 ||
    floorFilter !== "" ||
    roomsFilter !== "" ||
    minArea !== "" ||
    maxArea !== "" ||
    minPrice !== "" ||
    maxPrice !== "";

  function toggleStatus(status: UnitStatus) {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function resetFilters() {
    setStatusFilter(new Set());
    setFloorFilter("");
    setRoomsFilter("");
    setMinArea("");
    setMaxArea("");
    setMinPrice("");
    setMaxPrice("");
  }

  if (units.length === 0) {
    return <p className={s.empty}>A lakáslista hamarosan elérhető.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className={s.filterBar}>
        <div className="flex flex-col gap-1.5">
          <span className={s.label}>Státusz</span>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleStatus(opt)}
                className={`rounded-[2px] px-3 py-1.5 text-xs font-medium ${
                  statusFilter.has(opt) ? s.pillActive : s.pillIdle
                }`}
              >
                {statusLabel[opt]}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={s.label}>Emelet</span>
          <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className={s.input}>
            <option value="">Összes</option>
            {floorOptions.map((f) => (
              <option key={f} value={f}>
                {f}. emelet
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={s.label}>Szobaszám</span>
          <select value={roomsFilter} onChange={(e) => setRoomsFilter(e.target.value)} className={s.input}>
            <option value="">Összes</option>
            {roomOptions.map((r) => (
              <option key={r} value={r}>
                {r} szoba
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1.5">
          <span className={s.label}>Terület (m²)</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              placeholder="min"
              className={`w-20 ${s.input}`}
            />
            <span className={s.label}>–</span>
            <input
              type="number"
              min={0}
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              placeholder="max"
              className={`w-20 ${s.input}`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={s.label}>Ár (Ft)</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="min"
              className={`w-28 ${s.input}`}
            />
            <span className={s.label}>–</span>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="max"
              className={`w-28 ${s.input}`}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4 pb-2">
          <span className={s.resultCount}>
            {filtered.length} / {units.length} lakás
          </span>
          {hasActiveFilters ? (
            <button type="button" onClick={resetFilters} className={s.resetLink}>
              Szűrők törlése
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={s.empty}>Nincs a szűrésnek megfelelő lakás.</p>
      ) : (
        <div className={`overflow-x-auto ${s.listWrapper}`}>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className={s.headRow}>
                <th className="px-5 py-3 font-medium">Lakás</th>
                <th className="px-5 py-3 font-medium">Emelet</th>
                <th className="px-5 py-3 font-medium">Terület</th>
                <th className="px-5 py-3 font-medium">Szoba</th>
                <th className="px-5 py-3 font-medium">Ár</th>
                <th className="px-5 py-3 font-medium">Státusz</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const sold = u.status === "sold";
                return (
                  <tr key={u.id} className={`${s.row} ${sold ? s.rowSold : ""}`}>
                    <td className={`px-5 py-4 ${s.unitNumber}`} style={s.headingFont}>
                      {u.unit_number}
                    </td>
                    <td className={`px-5 py-4 ${s.cell}`}>{u.floor !== null ? `${u.floor}.` : "–"}</td>
                    <td className={`px-5 py-4 ${s.cell}`}>{u.area_sqm ? `${u.area_sqm} m²` : "–"}</td>
                    <td className={`px-5 py-4 ${s.cell}`}>{u.room_count ?? "–"}</td>
                    <td className={`px-5 py-4 ${s.price}`}>{u.price ? `${u.price.toLocaleString("hu-HU")} Ft` : "–"}</td>
                    <td className="px-5 py-4">
                      {s.badgeKind === "dot" ? (
                        <span className={`text-[11px] font-semibold uppercase tracking-wide ${s.badge[u.status]}`}>
                          ● {statusLabel[u.status]}
                        </span>
                      ) : (
                        <span className={`rounded-[2px] px-2.5 py-1 text-xs font-semibold ${s.badge[u.status]}`}>
                          {statusLabel[u.status]}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button type="button" onClick={() => setActiveUnit(u)} className={s.link}>
                        Alaprajz megtekintése →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
    </div>
  );
}
