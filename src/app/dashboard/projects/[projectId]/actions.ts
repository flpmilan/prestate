"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus, ProjectTheme } from "@/lib/types";

export async function setProjectStatus(projectId: string, status: ProjectStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ status }).eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function setProjectTheme(projectId: string, theme: ProjectTheme) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ theme }).eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/projects/${projectId}`);
}
