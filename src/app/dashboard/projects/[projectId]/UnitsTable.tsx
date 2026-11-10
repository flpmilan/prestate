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
        <tr className="border-b border-zinc-200 text-xs text-zinc-500">
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
            <tr className="border-b border-zinc-100">
              <td className="py-2 font-medium text-zinc-900">{u.unit_number}</td>
              <td>{u.floor ?? "–"}</td>
              <td>{u.area_sqm ? `${u.area_sqm} m²` : "–"}</td>
              <td>{u.room_count ?? "–"}</td>
              <td>{u.price ? `${u.price.toLocaleString("hu-HU")} Ft` : "–"}</td>
              <td>
                <UnitStatusSelect unitId={u.id} status={u.status} />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
                >
                  {expanded === u.id ? "Bezár" : "Részletek"}
                </button>
              </td>
            </tr>
            {expanded === u.id ? (
              <tr className="border-b border-zinc-100">
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
