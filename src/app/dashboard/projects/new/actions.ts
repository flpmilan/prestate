"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name) {
    redirect("/dashboard/projects/new?error=Adj meg egy projektnevet.");
  }

  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) redirect("/login");

  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!organization) redirect("/dashboard/onboarding");

  const baseSlug = slugify(name) || "projekt";
  let slug = baseSlug;
  let projectId: string | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        organization_id: organization.id,
        name,
        slug,
        address: address || null,
        description: description || null,
      })
      .select("id")
      .single();

    if (!error && data) {
      projectId = data.id;
      break;
    }

    if (error?.code === "23505") {
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
      continue;
    }

    redirect(`/dashboard/projects/new?error=${encodeURIComponent(error?.message ?? "Ismeretlen hiba")}`);
  }

  redirect(`/dashboard/projects/${projectId}/setup?step=2`);
}
