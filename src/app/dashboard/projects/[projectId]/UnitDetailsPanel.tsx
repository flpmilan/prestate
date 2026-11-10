"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UnitRoom } from "@/lib/types";

export function UnitDetailsPanel({
  unitId,
  projectId,
  organizationId,
  floorPlanImageUrl,
  floorPlanRender3dUrl,
  rooms,
}: {
  unitId: string;
  projectId: string;
  organizationId: string;
  floorPlanImageUrl: string | null;
  floorPlanRender3dUrl: string | null;
  rooms: UnitRoom[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderBusy, setRenderBusy] = useState(false);
  const [showRender, setShowRender] = useState(false);

  async function uploadFloorPlan() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Válassz ki egy képfájlt.");
      return;
    }
    setUploadBusy(true);
    setError(null);
    const supabase = createClient();

    try {
      const ext = file.name.split(".").pop();
      const path = `${organizationId}/${projectId}/units/${unitId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("project-assets").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("project-assets").getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("units")
        .update({ floor_plan_image_url: publicUrl.publicUrl })
        .eq("id", unitId);
      if (updateError) throw updateError;

      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt a feltöltés során.");
    } finally {
      setUploadBusy(false);
    }
  }

  async function removeFloorPlan() {
    const supabase = createClient();
    await supabase
      .from("units")
      .update({ floor_plan_image_url: null, floor_plan_render_3d_url: null })
      .eq("id", unitId);
    router.refresh();
  }

  async function generateRender() {
    setRenderBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/floor-plans/render-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "unit", id: unitId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Hiba történt a render generálása során.");
      setShowRender(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt a render generálása során.");
    } finally {
      setRenderBusy(false);
    }
  }

  async function addRoom() {
    const supabase = createClient();
    const nextPosition = rooms.length > 0 ? Math.max(...rooms.map((r) => r.position)) + 1 : 0;
    await supabase.from("unit_rooms").insert({ unit_id: unitId, name: "Új helyiség", area_sqm: null, position: nextPosition });
    router.refresh();
  }

  async function updateRoom(roomId: string, patch: { name?: string; area_sqm?: number | null }) {
    const supabase = createClient();
    await supabase.from("unit_rooms").update(patch).eq("id", roomId);
    router.refresh();
  }

  async function deleteRoom(roomId: string) {
    const supabase = createClient();
    await supabase.from("unit_rooms").delete().eq("id", roomId);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Saját alaprajz</h3>
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {floorPlanImageUrl ? (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={showRender && floorPlanRender3dUrl ? floorPlanRender3dUrl : floorPlanImageUrl}
                alt="Saját alaprajz"
                className="h-16 w-16 rounded border border-zinc-200 object-contain bg-white"
              />
              <button
                type="button"
                onClick={removeFloorPlan}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Eltávolítás
              </button>
            </div>
          ) : null}
          <input ref={fileInputRef} type="file" accept="image/*" className="text-xs" />
          <button
            type="button"
            disabled={uploadBusy}
            onClick={uploadFloorPlan}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
          >
            {uploadBusy ? "Feltöltés..." : floorPlanImageUrl ? "Csere" : "Feltöltés"}
          </button>
        </div>
        {floorPlanImageUrl ? (
          <div className="mt-2">
            {floorPlanRender3dUrl ? (
              <button
                type="button"
                onClick={() => setShowRender((v) => !v)}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                {showRender ? "2D alaprajz megtekintése" : "3D render megtekintése"}
              </button>
            ) : (
              <button
                type="button"
                disabled={renderBusy}
                onClick={generateRender}
                className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
              >
                {renderBusy ? "3D render generálása..." : "3D render generálása AI-val"}
              </button>
            )}
          </div>
        ) : null}
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Helyiségek</h3>
        <div className="mt-2 flex flex-col gap-2">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center gap-2">
              <input
                defaultValue={room.name}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value && value !== room.name) updateRoom(room.id, { name: value });
                }}
                className="w-40 rounded-md border border-zinc-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                step="0.1"
                defaultValue={room.area_sqm ?? ""}
                onBlur={(e) => {
                  const value = e.target.value === "" ? null : Number(e.target.value);
                  if (value !== room.area_sqm) updateRoom(room.id, { area_sqm: value });
                }}
                placeholder="m²"
                className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm"
              />
              <span className="text-xs text-zinc-400">m²</span>
              <button
                type="button"
                onClick={() => deleteRoom(room.id)}
                className="ml-1 text-xs font-medium text-red-600 hover:underline"
              >
                Törlés
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoom}
            className="mt-1 self-start rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            + Helyiség hozzáadása
          </button>
        </div>
      </div>
    </div>
  );
}
