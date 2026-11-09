"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { FloorHotspot } from "@/lib/types";

type Rect = { x: number; y: number; w: number; h: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function HotspotEditor({
  projectId,
  imageUrl,
  hotspots,
}: {
  projectId: string;
  imageUrl: string;
  hotspots: FloorHotspot[];
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<Rect | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [floorInput, setFloorInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiFloors, setAiFloors] = useState("");
  const [aiInstructions, setAiInstructions] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  function pointToPercent(clientX: number, clientY: number) {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
    return { x, y };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("[data-hotspot]")) return;
    const p = pointToPercent(e.clientX, e.clientY);
    setDragStart(p);
    setDraft({ x: p.x, y: p.y, w: 0, h: 0 });
    setError(null);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart) return;
    const p = pointToPercent(e.clientX, e.clientY);
    setDraft({
      x: Math.min(dragStart.x, p.x),
      y: Math.min(dragStart.y, p.y),
      w: Math.abs(p.x - dragStart.x),
      h: Math.abs(p.y - dragStart.y),
    });
  }

  function handlePointerUp() {
    setDragStart(null);
    if (draft && (draft.w < 2 || draft.h < 2)) setDraft(null);
  }

  async function saveDraft() {
    if (!draft) return;
    const floor = Number(floorInput);
    if (!Number.isFinite(floor)) {
      setError("Add meg az emelet számát.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("floor_hotspots").insert({
      project_id: projectId,
      floor,
      label: `${floor}. emelet`,
      x: draft.x,
      y: draft.y,
      w: draft.w,
      h: draft.h,
    });
    setBusy(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setDraft(null);
    setFloorInput("");
    router.refresh();
  }

  async function deleteHotspot(id: string) {
    const supabase = createClient();
    await supabase.from("floor_hotspots").delete().eq("id", id);
    router.refresh();
  }

  async function handleAiSuggest() {
    const floors = Number(aiFloors);
    if (!Number.isFinite(floors) || floors < 1) {
      setAiError("Add meg az emeletek számát.");
      return;
    }
    setAiBusy(true);
    setAiError(null);
    try {
      const res = await fetch("/api/building-hotspots/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          floors,
          instructions: aiInstructions.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hiba történt az AI javaslat lekérésekor.");

      const suggestions = data.hotspots as { floor: number; x: number; y: number; w: number; h: number }[];
      const supabase = createClient();
      const { error: insertError } = await supabase.from("floor_hotspots").insert(
        suggestions.map((h) => ({
          project_id: projectId,
          floor: h.floor,
          label: `${h.floor}. emelet`,
          x: h.x,
          y: h.y,
          w: h.w,
          h: h.h,
        })),
      );
      if (insertError) throw new Error(insertError.message);

      router.refresh();
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Hiba történt.");
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-zinc-500">
        Húzással jelölj ki egy területet a képen egy emelethez, majd add meg az emelet számát. Vagy
        kérj AI-javaslatot, amit utána finomíthatsz.
      </p>

      <div className="flex flex-col gap-2 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-3">
        {aiError ? <p className="text-xs text-red-600">{aiError}</p> : null}
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            Hány emeletet jelöljön ki?
            <input
              type="number"
              min={1}
              value={aiFloors}
              onChange={(e) => setAiFloors(e.target.value)}
              className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={aiBusy}
            onClick={handleAiSuggest}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            {aiBusy ? "AI elemzi a képet..." : "AI javaslat kérése"}
          </button>
        </div>
        <label className="flex flex-col gap-1 text-sm text-zinc-700">
          Kiegészítő instrukció az AI-nak (opcionális)
          <textarea
            value={aiInstructions}
            onChange={(e) => setAiInstructions(e.target.value)}
            rows={2}
            placeholder="pl. a földszint üzletsor, azt hagyd ki; a tetőtérben is vannak lakások, azt vedd külön emeletnek"
            className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full cursor-crosshair select-none overflow-hidden rounded-lg border border-zinc-200"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Épület látványterve" className="block w-full" draggable={false} />

        {hotspots.map((h) => (
          <div
            key={h.id}
            data-hotspot
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
            className="absolute flex items-start justify-between gap-1 border-2 border-emerald-500 bg-emerald-500/15 p-1"
          >
            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {h.label ?? `${h.floor}. emelet`}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteHotspot(h.id);
              }}
              className="rounded bg-white/90 px-1.5 text-xs font-medium text-red-600"
            >
              ×
            </button>
          </div>
        ))}

        {draft ? (
          <div
            style={{ left: `${draft.x}%`, top: `${draft.y}%`, width: `${draft.w}%`, height: `${draft.h}%` }}
            className="absolute border-2 border-dashed border-zinc-900 bg-zinc-900/10"
          />
        ) : null}
      </div>

      {draft && draft.w >= 2 && draft.h >= 2 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3">
          {error ? <p className="w-full text-xs text-red-600">{error}</p> : null}
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            Emelet száma
            <input
              type="number"
              value={floorInput}
              onChange={(e) => setFloorInput(e.target.value)}
              className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={saveDraft}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {busy ? "Mentés..." : "Hotspot mentése"}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(null);
              setFloorInput("");
              setError(null);
            }}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            Mégse
          </button>
        </div>
      ) : null}
    </div>
  );
}
