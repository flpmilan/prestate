import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadForm } from "./LeadForm";

const statusLabel = { available: "Szabad", reserved: "Fenntartott", sold: "Eladva" } as const;
const statusColor = {
  available: "bg-emerald-100 text-emerald-700",
  reserved: "bg-amber-100 text-amber-700",
  sold: "bg-zinc-200 text-zinc-500",
} as const;

export default async function TenantSitePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, slug, description, address, hero_image_url, status")
    .or(`slug.eq.${tenant},custom_domain.eq.${tenant}`)
    .eq("status", "published")
    .maybeSingle();

  if (!project) notFound();

  const [{ data: floorPlans }, { data: units }] = await Promise.all([
    supabase.from("floor_plans").select("id, name, image_url").eq("project_id", project.id),
    supabase
      .from("units")
      .select("id, unit_number, floor, area_sqm, room_count, price, status, floor_plan_id")
      .eq("project_id", project.id)
      .order("unit_number"),
  ]);

  const floorPlanById = new Map((floorPlans ?? []).map((fp) => [fp.id, fp]));
  const availableUnits = (units ?? []).filter((u) => u.status !== "sold");

  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-zinc-100 bg-zinc-50 px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-zinc-900">{project.name}</h1>
        {project.address ? <p className="mt-2 text-zinc-500">{project.address}</p> : null}
        {project.description ? (
          <p className="mx-auto mt-4 max-w-2xl text-zinc-600">{project.description}</p>
        ) : null}
      </header>

      {floorPlans && floorPlans.length > 0 ? (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <h2 className="text-lg font-semibold text-zinc-900">Alaprajzok</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {floorPlans.map((fp) => (
              <div key={fp.id} className="w-40 rounded-lg border border-zinc-200 p-3 text-center">
                {fp.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fp.image_url} alt={fp.name} className="h-32 w-full object-contain" />
                ) : null}
                <p className="mt-2 text-sm text-zinc-700">{fp.name}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-6 py-10">
        <h2 className="text-lg font-semibold text-zinc-900">Lakáslista</h2>
        {units && units.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {units.map((u) => {
              const fp = u.floor_plan_id ? floorPlanById.get(u.floor_plan_id) : null;
              return (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div>
                    <p className="font-medium text-zinc-900">
                      {u.unit_number} {u.floor !== null ? `· ${u.floor}. emelet` : ""}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {u.area_sqm ? `${u.area_sqm} m²` : ""}
                      {u.room_count ? ` · ${u.room_count} szoba` : ""}
                      {fp ? ` · ${fp.name}` : ""}
                    </p>
                    {u.price ? (
                      <p className="text-sm text-zinc-700">{u.price.toLocaleString("hu-HU")} Ft</p>
                    ) : null}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[u.status as keyof typeof statusColor]}`}
                  >
                    {statusLabel[u.status as keyof typeof statusLabel]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">A lakáslista hamarosan elérhető.</p>
        )}
      </section>

      <section className="mx-auto max-w-lg px-6 py-10">
        <h2 className="text-lg font-semibold text-zinc-900">Ajánlatkérés</h2>
        <div className="mt-4">
          <LeadForm
            projectId={project.id}
            units={availableUnits.map((u) => ({ id: u.id, unit_number: u.unit_number }))}
          />
        </div>
      </section>
    </div>
  );
}
