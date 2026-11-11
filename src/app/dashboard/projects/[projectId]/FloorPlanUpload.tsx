"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function FloorPlanUpload({
  projectId,
  organizationId,
}: {
  projectId: string;
  organizationId: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Válassz ki egy képfájlt.");
      return;
    }
    if (!name.trim()) {
      setError("Adj nevet az alaprajznak (pl. 'A típus').");
      return;
    }

    setBusy(true);
    setError(null);
    const supabase = createClient();

    try {
      const ext = file.name.split(".").pop();
      const path = `${organizationId}/${projectId}/floorplans/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-assets")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("project-assets").getPublicUrl(path);

      const { error: insertError } = await supabase
        .from("floor_plans")
        .insert({ project_id: projectId, name: name.trim(), image_url: publicUrl.publicUrl });
      if (insertError) throw insertError;

      setName("");
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt a feltöltés során.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-[#D9CFBB] bg-[#FBF8F3] p-4">
      {error ? <p className="text-xs text-[#A8402A]">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Alaprajz neve, pl. 'A típus'"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-[#E3DCCB] bg-white px-3 py-1.5 text-sm"
        />
        <input ref={inputRef} type="file" accept="image/*" className="text-sm text-[#6B6354]" />
        <button
          type="button"
          disabled={busy}
          onClick={handleUpload}
          className="rounded-md bg-[#1C1A17] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2E2A24] disabled:opacity-50"
        >
          {busy ? "Feltöltés..." : "Alaprajz feltöltése"}
        </button>
      </div>
    </div>
  );
}
