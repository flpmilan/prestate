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

      const { error: upsertError } = await supabase
        .from("units")
        .upsert(payload, { onConflict: "project_id,unit_number" });
      if (upsertError) throw upsertError;

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
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-zinc-300 p-4">
      <p className="text-xs text-zinc-500">
        Elvárt oszlopok: <code>lakás, emelet, terület, szobaszám, ár, státusz, alaprajz</code> (a
        sorrend és a magyar/angol elnevezés is elfogadott).
      </p>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {message ? <p className="text-xs text-emerald-600">{message}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="text-sm" />
        <button
          type="button"
          disabled={busy}
          onClick={handleImport}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {busy ? "Importálás..." : "Lakáslista importálása"}
        </button>
      </div>
    </div>
  );
}
