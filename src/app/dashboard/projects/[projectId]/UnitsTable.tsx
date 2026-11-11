"use client";

import { Fragment, useState } from "react";
import type { Unit, UnitRoom } from "@/lib/types";
import { UnitStatusSelect } from "./UnitStatusSelect";
import { UnitDetailsPanel } from "./UnitDetailsPanel";

export function UnitsTable({
  units,
  roomsByUnit,
  projectId,
  organizationId,
}: {
  units: Unit[];
  roomsByUnit: Record<string, UnitRoom[]>;
  projectId: string;
  organizationId: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <table className="mt-4 w-full text-left text-sm">
      <thead>
        <tr className="border-b border-[#E8E1D4] text-xs text-[#9C8F7E]">
          <th className="py-2">Lakás</th>
          <th>Emelet</th>
          <th>Terület</th>
          <th>Szoba</th>
          <th>Ár</th>
          <th>Státusz</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {units.map((u) => (
          <Fragment key={u.id}>
            <tr className="border-b border-[#F1EDE4]">
              <td className="py-2 font-medium text-[#1C1A17]">{u.unit_number}</td>
              <td className="text-[#1C1A17]">{u.floor ?? "–"}</td>
              <td className="text-[#1C1A17]">{u.area_sqm ? `${u.area_sqm} m²` : "–"}</td>
              <td className="text-[#1C1A17]">{u.room_count ?? "–"}</td>
              <td className="text-[#1C1A17]">{u.price ? `${u.price.toLocaleString("hu-HU")} Ft` : "–"}</td>
              <td>
                <UnitStatusSelect unitId={u.id} status={u.status} />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                  className="text-xs font-medium text-[#9C5636] hover:text-[#86472C]"
                >
                  {expanded === u.id ? "Bezár" : "Részletek"}
                </button>
              </td>
            </tr>
            {expanded === u.id ? (
              <tr className="border-b border-[#F1EDE4]">
                <td colSpan={7} className="py-3">
                  <UnitDetailsPanel
                    unitId={u.id}
                    projectId={projectId}
                    organizationId={organizationId}
                    floorPlanImageUrl={u.floor_plan_image_url}
                    floorPlanRender3dUrl={u.floor_plan_render_3d_url}
                    rooms={roomsByUnit[u.id] ?? []}
                  />
                </td>
              </tr>
            ) : null}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
