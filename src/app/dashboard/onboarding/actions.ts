"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export async function createOrganization(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) {
    redirect("/login");
  }

  if (!name) {
    redirect("/dashboard/onboarding?error=Adj meg egy céget nevet.");
  }

  const baseSlug = slugify(name) || "ceg";
  let slug = baseSlug;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { error } = await supabase
      .from("organizations")
      .insert({ name, slug, owner_id: user.id });

    if (!error) break;

    if (error.code === "23505") {
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
      continue;
    }

    redirect(`/dashboard/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
