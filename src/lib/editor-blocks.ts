import { createClient } from "@/lib/supabase/server";
import { STRUCTURAL_BLOCK_TYPES, type ProjectBlock } from "@/lib/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function assertProjectOwner(
  supabase: Supabase,
  projectId: string,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return { ok: false, status: 401, error: "Jelentkezz be." };

  const { data: project } = await supabase
    .from("projects")
    .select("organization_id")
    .eq("id", projectId)
    .maybeSingle();
  if (!project) return { ok: false, status: 404, error: "A projekt nem található." };

  const { data: organization } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", project.organization_id)
    .maybeSingle();
  if (!organization || organization.owner_id !== user.id) {
    return { ok: false, status: 403, error: "Nincs jogosultságod ehhez a projekthez." };
  }

  return { ok: true };
}

export async function listBlocks(supabase: Supabase, projectId: string): Promise<ProjectBlock[]> {
  const { data } = await supabase
    .from("project_blocks")
    .select("id, project_id, type, position, visible, title, body, created_at")
    .eq("project_id", projectId)
    .order("position");
  return (data ?? []) as ProjectBlock[];
}

export async function addTextSection(
  supabase: Supabase,
  projectId: string,
  title: string,
  body: string,
): Promise<ProjectBlock> {
  const blocks = await listBlocks(supabase, projectId);
  const nextPosition = blocks.length > 0 ? Math.max(...blocks.map((b) => b.position)) + 1 : 0;
  const { data, error } = await supabase
    .from("project_blocks")
    .insert({ project_id: projectId, type: "text", title, body, position: nextPosition })
    .select("id, project_id, type, position, visible, title, body, created_at")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Nem sikerült létrehozni a szekciót.");
  return data as ProjectBlock;
}

export async function updateTextSection(
  supabase: Supabase,
  id: string,
  patch: { title?: string; body?: string },
): Promise<void> {
  const { error } = await supabase
    .from("project_blocks")
    .update(patch)
    .eq("id", id)
    .eq("type", "text");
  if (error) throw new Error(error.message);
}

export async function deleteTextSection(supabase: Supabase, id: string): Promise<void> {
  const { error } = await supabase.from("project_blocks").delete().eq("id", id).eq("type", "text");
  if (error) throw new Error(error.message);
}

export async function setBlockVisible(supabase: Supabase, id: string, visible: boolean): Promise<void> {
  const { error } = await supabase.from("project_blocks").update({ visible }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function moveBlock(
  supabase: Supabase,
  projectId: string,
  id: string,
  direction: "up" | "down",
): Promise<void> {
  const blocks = await listBlocks(supabase, projectId);
  const sorted = [...blocks].sort((a, b) => a.position - b.position);
  const idx = sorted.findIndex((b) => b.id === id);
  if (idx === -1) return;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= sorted.length) return;

  const a = sorted[idx];
  const b = sorted[swapWith];
  await Promise.all([
    supabase.from("project_blocks").update({ position: b.position }).eq("id", a.id),
    supabase.from("project_blocks").update({ position: a.position }).eq("id", b.id),
  ]);
}

export function isStructuralBlockType(type: string): boolean {
  return (STRUCTURAL_BLOCK_TYPES as string[]).includes(type);
}

export async function setAccentColor(supabase: Supabase, projectId: string, hex: string | null): Promise<void> {
  const { data: project } = await supabase
    .from("projects")
    .select("style_overrides")
    .eq("id", projectId)
    .maybeSingle();
  const current = (project?.style_overrides ?? {}) as Record<string, unknown>;
  const next = { ...current, accent: hex ?? undefined };
  if (!hex) delete next.accent;
  const { error } = await supabase.from("projects").update({ style_overrides: next }).eq("id", projectId);
  if (error) throw new Error(error.message);
}
