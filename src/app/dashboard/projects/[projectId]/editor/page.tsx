import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listBlocks } from "@/lib/editor-blocks";
import { EditorClient } from "./EditorClient";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, style_overrides")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) notFound();

  const blocks = await listBlocks(supabase, projectId);
  const accentColor = (project.style_overrides as { accent?: string } | null)?.accent ?? null;

  return (
    <EditorClient
      projectId={project.id}
      projectName={project.name}
      initialBlocks={blocks}
      initialAccentColor={accentColor}
    />
  );
}
