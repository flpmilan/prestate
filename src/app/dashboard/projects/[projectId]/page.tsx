import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublishToggle } from "./PublishToggle";
import { ThemeSelect } from "./ThemeSelect";
import { FloorPlanUpload } from "./FloorPlanUpload";
import { BuildingImageUpload } from "./BuildingImageUpload";
import { HotspotEditor } from "./HotspotEditor";
import { UnitsImport } from "./UnitsImport";
import { UnitsTable } from "./UnitsTable";
import { GalleryUpload } from "./GalleryUpload";
import { FloorPlanCard } from "./FloorPlanCard";
import type { UnitRoom } from "@/lib/types";
import { ui } from "@/lib/ui";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, organization_id, name, slug, status, theme, custom_domain, address, building_image_url")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) notFound();

  const [{ data: floorPlans }, { data: units }, { data: leads }, { data: hotspots }, { data: gallery }] =
    await Promise.all([
      supabase
        .from("floor_plans")
        .select("id, name, image_url, render_3d_url")
        .eq("project_id", projectId),
      supabase
        .from("units")
        .select(
          "id, project_id, unit_number, floor, area_sqm, room_count, price, status, floor_plan_id, floor_plan_image_url, floor_plan_render_3d_url, created_at",
        )
        .eq("project_id", projectId)
        .order("unit_number"),
      supabase
        .from("leads")
        .select("id, name, email, phone, message, created_at, unit_id")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }),
      supabase
        .from("floor_hotspots")
        .select("id, project_id, floor, label, x, y, w, h, created_at")
        .eq("project_id", projectId)
        .order("floor"),
      supabase
        .from("project_gallery_images")
        .select("id, project_id, image_url, position, created_at")
        .eq("project_id", projectId)
        .order("position"),
    ]);

  const unitIds = (units ?? []).map((u) => u.id);
  const unitRooms: UnitRoom[] =
    unitIds.length > 0
      ? ((
          await supabase
            .from("unit_rooms")
            .select("id, unit_id, name, area_sqm, position, created_at")
            .in("unit_id", unitIds)
            .order("position")
        ).data ?? [])
      : [];

  const roomsByUnit: Record<string, UnitRoom[]> = {};
  for (const room of unitRooms) {
    (roomsByUnit[room.unit_id] ??= []).push(room);
  }

  const publicUrl = `//${project.slug}.${ROOT_DOMAIN}`;
  const previewUrl = `/sites/${project.slug}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/dashboard" className={ui.linkMuted}>
        ← Vissza a projektekhez
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1C1A17]" style={{ fontFamily: "var(--font-fraunces)" }}>
            {project.name}
          </h1>
          {project.address ? <p className="text-sm text-[#6B6354]">{project.address}</p> : null}
          <a href={previewUrl} target="_blank" rel="noreferrer" className={`mt-1 inline-block ${ui.link}`}>
            {project.custom_domain ?? publicUrl.replace("//", "")} →
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/projects/${project.id}/editor`} className={ui.buttonSecondary}>
            Élő szerkesztő
          </Link>
          <PublishToggle projectId={project.id} status={project.status} />
        </div>
      </div>

      <section className={`mt-8 p-6 ${ui.card}`}>
        <h2 className={ui.sectionLabel}>Sablon</h2>
        <p className="mt-1 text-xs text-[#9C8F7E]">A publikus oldal vizuális stílusa.</p>
        <div className="mt-3">
          <ThemeSelect projectId={project.id} theme={project.theme} />
        </div>
      </section>

      <section className={`mt-6 p-6 ${ui.card}`}>
        <h2 className={ui.sectionLabel}>Hero galéria</h2>
        <p className="mt-1 text-xs text-[#9C8F7E]">
          Tölts fel képeket (épület, lakások látványtervei) — a publikus oldal hero szekciójában
          automatikusan, animálva váltakoznak.
        </p>
        <div className="mt-3">
          <GalleryUpload projectId={project.id} organizationId={project.organization_id} images={gallery ?? []} />
        </div>
      </section>

      <section className={`mt-6 p-6 ${ui.card}`}>
        <h2 className={ui.sectionLabel}>Épület látványterve</h2>
        <p className="mt-1 text-xs text-[#9C8F7E]">
          Tölts fel egy látványtervet, és jelölj ki rajta emeletenként egy területet — az
          érdeklődők ezen böngészhetnek majd a publikus oldalon.
        </p>
        <div className="mt-3 flex flex-col gap-4">
          {project.building_image_url ? (
            <HotspotEditor
              projectId={project.id}
              imageUrl={project.building_image_url}
              hotspots={hotspots ?? []}
            />
          ) : null}
          <BuildingImageUpload projectId={project.id} organizationId={project.organization_id} />
        </div>
      </section>

      <section className={`mt-6 p-6 ${ui.card}`}>
        <h2 className={ui.sectionLabel}>Alaprajzok</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {(floorPlans ?? []).map((fp) => (
            <FloorPlanCard
              key={fp.id}
              floorPlanId={fp.id}
              name={fp.name}
              imageUrl={fp.image_url}
              render3dUrl={fp.render_3d_url}
            />
          ))}
        </div>
        <div className="mt-3">
          <FloorPlanUpload projectId={project.id} organizationId={project.organization_id} />
        </div>
      </section>

      <section className={`mt-6 p-6 ${ui.card}`}>
        <h2 className={ui.sectionLabel}>Lakáslista</h2>
        <div className="mt-3">
          <UnitsImport projectId={project.id} />
        </div>

        {units && units.length > 0 ? (
          <UnitsTable
            units={units}
            roomsByUnit={roomsByUnit}
            projectId={project.id}
            organizationId={project.organization_id}
          />
        ) : (
          <p className="mt-4 text-sm text-[#9C8F7E]">Még nincs feltöltött lakás.</p>
        )}
      </section>

      <section className={`mt-6 p-6 ${ui.card}`}>
        <h2 className={ui.sectionLabel}>Beérkezett érdeklődések</h2>
        {leads && leads.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {leads.map((lead) => (
              <li key={lead.id} className={`p-3 text-sm ${ui.cardMuted}`}>
                <p className="font-medium text-[#1C1A17]">
                  {lead.name} · {lead.email} {lead.phone ? `· ${lead.phone}` : ""}
                </p>
                {lead.message ? <p className="mt-1 text-[#6B6354]">{lead.message}</p> : null}
                <p className="mt-1 text-xs text-[#9C8F7E]">
                  {new Date(lead.created_at).toLocaleString("hu-HU")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[#9C8F7E]">Még nem érkezett ajánlatkérés.</p>
        )}
      </section>
    </div>
  );
}
