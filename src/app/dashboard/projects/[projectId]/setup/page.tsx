import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FloorHotspot, GalleryImage } from "@/lib/types";
import { ThemeSelect } from "../ThemeSelect";
import { GalleryUpload } from "../GalleryUpload";
import { BuildingImageUpload } from "../BuildingImageUpload";
import { HotspotEditor } from "../HotspotEditor";

const STEPS = [
  { step: 2, label: "Design" },
  { step: 3, label: "Hero galéria" },
  { step: 4, label: "Látványterv" },
  { step: 5, label: "Kész" },
];

export default async function ProjectSetupPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ step?: string }>;
}) {
  const { projectId } = await params;
  const { step: stepParam } = await searchParams;
  const step = Math.min(5, Math.max(2, Number(stepParam) || 2));

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, organization_id, name, theme, building_image_url")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) notFound();

  const nextHref = `/dashboard/projects/${projectId}/setup?step=${step + 1}`;
  const prevHref = step > 2 ? `/dashboard/projects/${projectId}/setup?step=${step - 1}` : null;

  if (step === 5) redirect(`/dashboard/projects/${projectId}`);

  let gallery: GalleryImage[] = [];
  let hotspots: FloorHotspot[] = [];

  if (step === 3) {
    const res = await supabase
      .from("project_gallery_images")
      .select("id, project_id, image_url, position, created_at")
      .eq("project_id", projectId)
      .order("position");
    gallery = res.data ?? [];
  }
  if (step === 4 && project.building_image_url) {
    const res = await supabase
      .from("floor_hotspots")
      .select("id, project_id, floor, label, x, y, w, h, created_at")
      .eq("project_id", projectId)
      .order("floor");
    hotspots = res.data ?? [];
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <p className="text-sm text-zinc-500">Új projekt beállítása · {project.name}</p>

      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
        {STEPS.map((s, i) => (
          <span key={s.step} className={`flex items-center gap-2 ${s.step === step ? "font-semibold text-zinc-900" : ""}`}>
            {i > 0 ? <span className="text-zinc-300">→</span> : null}
            {s.label}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
        {step === 2 ? (
          <>
            <h1 className="text-lg font-semibold text-zinc-900">Válassz designt</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Később bármikor módosíthatod a projekt adatlapján.
            </p>
            <div className="mt-4">
              <ThemeSelect projectId={project.id} theme={project.theme} />
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 className="text-lg font-semibold text-zinc-900">Hero galéria</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Tölts fel képeket (épület, lakások látványtervei) — a publikus oldal hero szekciójában
              automatikusan, animálva váltakoznak. Kihagyható, később is pótolható.
            </p>
            <div className="mt-4">
              <GalleryUpload projectId={project.id} organizationId={project.organization_id} images={gallery} />
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h1 className="text-lg font-semibold text-zinc-900">Épület látványterve</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Tölts fel egy látványtervet, és jelölj ki rajta emeletenként egy területet — az érdeklődők
              ezen böngészhetnek majd a publikus oldalon. Kihagyható, később is pótolható.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {project.building_image_url ? (
                <HotspotEditor projectId={project.id} imageUrl={project.building_image_url} hotspots={hotspots} />
              ) : null}
              <BuildingImageUpload projectId={project.id} organizationId={project.organization_id} />
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {prevHref ? (
          <Link href={prevHref} className="text-sm text-zinc-500 hover:text-zinc-900">
            ← Vissza
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={nextHref}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {step === 4 ? "Befejezés" : "Tovább / Kihagyom"}
        </Link>
      </div>
    </div>
  );
}
