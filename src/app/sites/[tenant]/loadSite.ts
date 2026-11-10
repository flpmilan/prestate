import { createClient } from "@/lib/supabase/server";
import type { ProjectBlock, ProjectTheme, StyleOverrides, UnitRoom } from "@/lib/types";
import type { SiteThemeProps } from "./themes/types";

type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  theme: ProjectTheme;
  status: "draft" | "published";
  building_image_url: string | null;
  style_overrides: StyleOverrides | null;
};

export type LoadedSite = {
  theme: ProjectTheme;
  themeProps: SiteThemeProps;
};

async function loadFromProject(
  supabase: Awaited<ReturnType<typeof createClient>>,
  project: ProjectRow,
): Promise<LoadedSite> {
  const [{ data: floorPlans }, { data: units }, { data: hotspots }, { data: gallery }, { data: blocks }] =
    await Promise.all([
      supabase
        .from("floor_plans")
        .select("id, project_id, name, image_url, render_3d_url, created_at")
        .eq("project_id", project.id),
      supabase
        .from("units")
        .select(
          "id, project_id, unit_number, floor, area_sqm, room_count, price, status, floor_plan_id, floor_plan_image_url, floor_plan_render_3d_url, created_at",
        )
        .eq("project_id", project.id)
        .order("unit_number"),
      supabase
        .from("floor_hotspots")
        .select("id, project_id, floor, label, x, y, w, h, created_at")
        .eq("project_id", project.id)
        .order("floor"),
      supabase
        .from("project_gallery_images")
        .select("id, project_id, image_url, position, created_at")
        .eq("project_id", project.id)
        .order("position"),
      supabase
        .from("project_blocks")
        .select("id, project_id, type, position, visible, title, body, created_at")
        .eq("project_id", project.id)
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

  const themeProps: SiteThemeProps = {
    projectId: project.id,
    name: project.name,
    address: project.address,
    description: project.description,
    floorPlans: floorPlans ?? [],
    units: units ?? [],
    buildingImageUrl: project.building_image_url,
    hotspots: hotspots ?? [],
    roomsByUnit,
    galleryImages: (gallery ?? []).map((g) => g.image_url),
    blocks: (blocks ?? []) as ProjectBlock[],
    accentColor: project.style_overrides?.accent ?? null,
  };

  return { theme: project.theme, themeProps };
}

const PROJECT_COLUMNS =
  "id, name, slug, description, address, theme, status, building_image_url, style_overrides";

export async function loadSiteByTenant(tenant: string): Promise<LoadedSite | null> {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .or(`slug.eq.${tenant},custom_domain.eq.${tenant}`)
    .eq("status", "published")
    .maybeSingle();

  if (!project) return null;
  return loadFromProject(supabase, project);
}

export async function loadSiteByProjectId(projectId: string): Promise<LoadedSite | null> {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("id", projectId)
    .maybeSingle();

  if (!project) return null;
  return loadFromProject(supabase, project);
}
