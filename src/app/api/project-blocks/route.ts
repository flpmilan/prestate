import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  addTextSection,
  assertProjectOwner,
  deleteTextSection,
  isStructuralBlockType,
  listBlocks,
  moveBlock,
  setAccentColor,
  setBlockVisible,
  updateTextSection,
} from "@/lib/editor-blocks";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("add_text"), projectId: z.string().uuid(), title: z.string().trim().min(1).max(200), body: z.string().trim().max(4000) }),
  z.object({ action: z.literal("update_text"), projectId: z.string().uuid(), id: z.string().uuid(), title: z.string().trim().min(1).max(200).optional(), body: z.string().trim().max(4000).optional() }),
  z.object({ action: z.literal("delete"), projectId: z.string().uuid(), id: z.string().uuid() }),
  z.object({ action: z.literal("move"), projectId: z.string().uuid(), id: z.string().uuid(), direction: z.enum(["up", "down"]) }),
  z.object({ action: z.literal("visible"), projectId: z.string().uuid(), id: z.string().uuid(), visible: z.boolean() }),
  z.object({ action: z.literal("set_accent"), projectId: z.string().uuid(), accent: z.string().nullable() }),
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "Hiányzó projectId." }, { status: 400 });

  const supabase = await createClient();
  const auth = await assertProjectOwner(supabase, projectId);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const blocks = await listBlocks(supabase, projectId);
  return NextResponse.json({ blocks });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  const data = parsed.data;

  const supabase = await createClient();
  const auth = await assertProjectOwner(supabase, data.projectId);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    if (data.action === "add_text") {
      const block = await addTextSection(supabase, data.projectId, data.title, data.body);
      return NextResponse.json({ block });
    }
    if (data.action === "update_text") {
      await updateTextSection(supabase, data.id, { title: data.title, body: data.body });
      return NextResponse.json({ ok: true });
    }
    if (data.action === "delete") {
      const blocks = await listBlocks(supabase, data.projectId);
      const target = blocks.find((b) => b.id === data.id);
      if (target && isStructuralBlockType(target.type)) {
        return NextResponse.json(
          { error: "Ez a szekció nem törölhető, csak elrejthető." },
          { status: 400 },
        );
      }
      await deleteTextSection(supabase, data.id);
      return NextResponse.json({ ok: true });
    }
    if (data.action === "move") {
      await moveBlock(supabase, data.projectId, data.id, data.direction);
      return NextResponse.json({ ok: true });
    }
    if (data.action === "visible") {
      await setBlockVisible(supabase, data.id, data.visible);
      return NextResponse.json({ ok: true });
    }
    if (data.action === "set_accent") {
      await setAccentColor(supabase, data.projectId, data.accent);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Ismeretlen művelet." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Hiba történt." },
      { status: 500 },
    );
  }
}
