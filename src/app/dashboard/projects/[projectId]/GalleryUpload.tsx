"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { GalleryImage } from "@/lib/types";

export function GalleryUpload({
  projectId,
  organizationId,
  images,
}: {
  projectId: string;
  organizationId: string;
  images: GalleryImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    const files = inputRef.current?.files;
    if (!files || files.length === 0) {
      setError("Válassz ki legalább egy képfájlt.");
      return;
    }

    setBusy(true);
    setError(null);
    const supabase = createClient();

    try {
      let nextPosition = images.length > 0 ? Math.max(...images.map((i) => i.position)) + 1 : 0;

      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${organizationId}/${projectId}/gallery/${Date.now()}-${nextPosition}.${ext}`;

        const { error: uploadError } = await supabase.storage.from("project-assets").upload(path, file);
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from("project-assets").getPublicUrl(path);

        const { error: insertError } = await supabase
          .from("project_gallery_images")
          .insert({ project_id: projectId, image_url: publicUrl.publicUrl, position: nextPosition });
        if (insertError) throw insertError;

        nextPosition += 1;
      }

      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hiba történt a feltöltés során.");
    } finally {
      setBusy(false);
    }
  }

  async function removeImage(id: string) {
    const supabase = createClient();
    await supabase.from("project_gallery_images").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {images.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative h-20 w-28 overflow-hidden rounded-md border border-zinc-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt="Hero galéria kép" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-1 top-1 rounded bg-white/90 px-1.5 text-xs font-medium text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-zinc-300 p-4">
        <input ref={inputRef} type="file" accept="image/*" multiple className="text-sm" />
        <button
          type="button"
          disabled={busy}
          onClick={handleUpload}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {busy ? "Feltöltés..." : "Képek hozzáadása"}
        </button>
      </div>
    </div>
  );
}
