"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { parseUnitsWorkbook } from "@/lib/excel";

export function UnitsImport({ projectId }: { projectId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Válassz ki egy Excel (.xlsx) fájlt.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const rows = parseUnitsWorkbook(buffer);
      if (rows.length === 0) {
        throw new Error("Nem találtam beolvasható sort. Ellenőrizd az oszlopfejléceket.");
      }

      const supabase = createClient();

      const { data: floorPlans } = await supabase
        .from("floor_plans")
        .select("id, name")
        .eq("project_id", projectId);

      const floorPlanByName = new Map((floorPlans ?? []).map((fp) => [fp.name.trim().toLowerCase(), fp.id]));

      const payload = rows.map((row) => ({
        project_id: projectId,
        unit_number: row.unit_number,
        floor: row.floor,
        area_sqm: row.area_sqm,
        room_count: row.room_count,
        price: row.price,
        status: row.status,
        floor_plan_id: row.floor_plan_name
          ? floorPlanByName.get(row.floor_plan_name.trim().toLowerCase()) ?? null
          : null,
      }));

      const { data: upsertedUnits, error: upsertError } = await supabase
        .from("units")
        .upsert(payload, { onConflict: "project_id,unit_number" })
        .select("id, unit_number");
      if (upsertError) throw upsertError;

      const unitIdByNumber = new Map((upsertedUnits ?? []).map((u) => [u.unit_number, u.id]));
      const rowsWithRooms = rows.filter((row) => row.rooms.length > 0);

      if (rowsWithRooms.length > 0) {
        const unitIds = rowsWithRooms
          .map((row) => unitIdByNumber.get(row.unit_number))
          .filter((id): id is string => Boolean(id));

        if (unitIds.length > 0) {
          const { error: deleteError } = await supabase.from("unit_rooms").delete().in("unit_id", unitIds);
          if (deleteError) throw deleteError;
        }

        const roomsPayload = rowsWithRooms.flatMap((row) => {
          const unitId = unitIdByNumber.get(row.unit_number);
          if (!unitId) return [];
          return row.rooms.map((room, index) => ({
            unit_id: unitId,
            name: room.name,
            area_sqm: room.area_sqm,
            position: index,
          }));
        });

        if (roomsPayload.length > 0) {
          const { error: roomsError } = await supabase.from("unit_rooms").insert(roomsPayload);
          if (roomsError) throw roomsError;
        }
      }

      setMessage(`${payload.length} lakás importálva/frissítve.`);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt az importálás során.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-[#D9CFBB] bg-[#FBF8F3] p-4">
      <p className="text-xs text-[#6B6354]">
        Elvárt oszlopok: <code>lakás, emelet, terület, szobaszám, ár, státusz, alaprajz</code> (a
        sorrend és a magyar/angol elnevezés is elfogadott). Opcionális{" "}
        <code>helyiségek</code> oszlop a helyiségenkénti bontáshoz, pl.{" "}
        <code>Konyha: 8.2, Előszoba: 4.1, Nappali: 22</code>.
      </p>
      {error ? <p className="text-xs text-[#A8402A]">{error}</p> : null}
      {message ? <p className="text-xs text-[#3D6B3A]">{message}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="text-sm text-[#6B6354]" />
        <button
          type="button"
          disabled={busy}
          onClick={handleImport}
          className="rounded-md bg-[#1C1A17] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2E2A24] disabled:opacity-50"
        >
          {busy ? "Importálás..." : "Lakáslista importálása"}
        </button>
      </div>
    </div>
  );
}
