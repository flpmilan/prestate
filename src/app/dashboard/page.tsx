import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { badgeClass, ui } from "@/lib/ui";

const statusLabel: Record<Project["status"], string> = {
  draft: "Vázlat",
  published: "Publikálva",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user!;

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!organization) redirect("/dashboard/onboarding");

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, slug, status, custom_domain")
    .eq("organization_id", organization.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <span className={ui.sectionLabel}>{organization.name}</span>
          <h1 className={`mt-1 ${ui.heading}`} style={{ fontFamily: "var(--font-fraunces)" }}>
            Projektjeim
          </h1>
        </div>
        <Link href="/dashboard/projects/new" className={ui.buttonAccent}>
          + Új projekt
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className={`mt-8 flex flex-col items-center gap-3 ${ui.card} px-6 py-16 text-center`}>
          <p className="text-sm text-[#6B6354]">
            Még nincs projekted. Hozd létre az elsőt, és kezdd el feltölteni a lakáslistát.
          </p>
          <Link href="/dashboard/projects/new" className={ui.buttonAccent}>
            + Első projekt létrehozása
          </Link>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/dashboard/projects/${p.id}`}
                className={`flex items-center justify-between px-5 py-4 transition-colors hover:border-[#9C5636]/40 hover:bg-[#FBF8F3] ${ui.card}`}
              >
                <span className="font-medium text-[#1C1A17]">{p.name}</span>
                <span className={badgeClass(p.status === "published" ? "success" : "neutral")}>
                  {statusLabel[p.status as Project["status"]]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
