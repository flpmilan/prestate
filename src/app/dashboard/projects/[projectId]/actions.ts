"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/lib/types";

export async function setProjectStatus(projectId: string, status: ProjectStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ status }).eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/projects/${projectId}`);
}
