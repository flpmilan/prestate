"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FloorPlanCard({
  floorPlanId,
  name,
  imageUrl,
  render3dUrl,
}: {
  floorPlanId: string;
  name: string;
  imageUrl: string | null;
  render3dUrl: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRender, setShowRender] = useState(false);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/floor-plans/render-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "floor_plan", id: floorPlanId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Hiba történt a render generálása során.");
      setShowRender(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt a render generálása során.");
    } finally {
      setBusy(false);
    }
  }

  const displayImage = showRender && render3dUrl ? render3dUrl : imageUrl;

  return (
    <div className="w-32 rounded-md border border-zinc-200 bg-white p-2 text-center">
      {displayImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={displayImage} alt={name} className="h-20 w-full object-contain" />
      ) : null}
      <p className="mt-1 truncate text-xs text-zinc-600">{name}</p>
      {render3dUrl ? (
        <button
          type="button"
          onClick={() => setShowRender((v) => !v)}
          className="mt-1 text-[11px] font-medium text-blue-600 hover:underline"
        >
          {showRender ? "2D alaprajz" : "3D render megtekintése"}
        </button>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={generate}
          className="mt-1 text-[11px] font-medium text-blue-600 hover:underline disabled:opacity-50"
        >
          {busy ? "Generálás..." : "3D render AI-val"}
        </button>
      )}
      {error ? <p className="mt-1 text-[10px] text-red-600">{error}</p> : null}
    </div>
  );
}
