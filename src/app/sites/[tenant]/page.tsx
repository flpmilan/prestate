import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WarmTheme } from "./themes/WarmTheme";
import { DarkTheme } from "./themes/DarkTheme";
import { MinimalTheme } from "./themes/MinimalTheme";

export default async function TenantSitePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, slug, description, address, theme, status, building_image_url")
    .or(`slug.eq.${tenant},custom_domain.eq.${tenant}`)
    .eq("status", "published")
    .maybeSingle();

  if (!project) notFound();

  const [{ data: floorPlans }, { data: units }, { data: hotspots }] = await Promise.all([
    supabase.from("floor_plans").select("id, project_id, name, image_url, created_at").eq("project_id", project.id),
    supabase
      .from("units")
      .select("id, project_id, unit_number, floor, area_sqm, room_count, price, status, floor_plan_id, created_at")
      .eq("project_id", project.id)
      .order("unit_number"),
    supabase
      .from("floor_hotspots")
      .select("id, project_id, floor, label, x, y, w, h, created_at")
      .eq("project_id", project.id)
      .order("floor"),
  ]);

  const themeProps = {
    projectId: project.id,
    name: project.name,
    address: project.address,
    description: project.description,
    floorPlans: floorPlans ?? [],
    units: units ?? [],
    buildingImageUrl: project.building_image_url,
    hotspots: hotspots ?? [],
  };

  if (project.theme === "dark") return <DarkTheme {...themeProps} />;
  if (project.theme === "minimal") return <MinimalTheme {...themeProps} />;
  return <WarmTheme {...themeProps} />;
}
