import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

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
        <h1 className="text-lg font-semibold text-zinc-900">Projektjeim</h1>
        <Link
          href="/dashboard/projects/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Új projekt
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          Még nincs projekted. Hozd létre az elsőt, és kezdd el feltölteni a lakáslistát.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/dashboard/projects/${p.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300"
              >
                <span className="font-medium text-zinc-900">{p.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === "published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
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
