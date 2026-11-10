import Anthropic from "@anthropic-ai/sdk";
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

const bodySchema = z.object({
  projectId: z.string().uuid(),
  instruction: z.string().trim().min(1).max(1000),
});

const TOOLS: Anthropic.Tool[] = [
  {
    name: "add_text_section",
    description: "Add a new free-text content section (title + paragraph) to the page.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        body: { type: "string" },
      },
      required: ["title", "body"],
    },
  },
  {
    name: "update_text_section",
    description: "Edit the title and/or body of an existing free-text section.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Block id" },
        title: { type: "string" },
        body: { type: "string" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_text_section",
    description: "Permanently delete a free-text section. Only works on 'text' type blocks.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "move_block",
    description: "Move any block one position up or down in the page order.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        direction: { type: "string", enum: ["up", "down"] },
      },
      required: ["id", "direction"],
    },
  },
  {
    name: "hide_block",
    description: "Hide a block from the page without deleting it.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "show_block",
    description: "Make a previously hidden block visible again.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "set_accent_color",
    description: "Set the site's single accent color (used for buttons, highlighted text, badges).",
    input_schema: {
      type: "object",
      properties: { hex: { type: "string", description: "e.g. #BD6B43" } },
      required: ["hex"],
    },
  },
  {
    name: "reset_accent_color",
    description: "Reset the accent color back to the theme's default.",
    input_schema: { type: "object", properties: {} },
  },
];

const BLOCK_LABELS: Record<string, string> = {
  hero: "Hero (nyitó szekció)",
  building_explorer: "Épület böngésző",
  unit_list: "Lakáslista",
  location: "Helyszín térkép",
  offer: "Ajánlatkérés",
  text: "Egyedi szöveges szekció",
};

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Az AI funkció nincs beállítva a szerveren (hiányzó ANTHROPIC_API_KEY)." },
      { status: 500 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  const { projectId, instruction } = parsed.data;

  const supabase = await createClient();
  const auth = await assertProjectOwner(supabase, projectId);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data: project } = await supabase
    .from("projects")
    .select("style_overrides")
    .eq("id", projectId)
    .maybeSingle();
  const accent = (project?.style_overrides as { accent?: string } | null)?.accent ?? null;

  const blocks = await listBlocks(supabase, projectId);
  const stateDescription = blocks
    .sort((a, b) => a.position - b.position)
    .map(
      (b) =>
        `- id=${b.id} type=${b.type} (${BLOCK_LABELS[b.type] ?? b.type}) visible=${b.visible}${
          b.type === "text" ? ` title="${b.title}" body="${(b.body ?? "").slice(0, 80)}"` : ""
        }`,
    )
    .join("\n");

  const promptText = [
    `Ez egy ingatlanfejlesztői értékesítési weboldal szerkesztője. A jelenlegi oldal szekciói, fentről lefelé:`,
    stateDescription || "(nincs egy szekció sem)",
    `A jelenlegi kiemelő szín (accent): ${accent ?? "alapértelmezett (nincs felülírva)"}`,
    `A felhasználó kérése: "${instruction}"`,
    `Hajtsd végre a kérést a rendelkezésre álló eszközök meghívásával. Szöveges szekciót csak az add_text_section/update_text_section/delete_text_section eszközökkel kezelj. A strukturális szekciókat (hero, building_explorer, unit_list, location, offer) NE töröld — ha a felhasználó el akarja távolítani, használd a hide_block eszközt. Válaszolj kizárólag eszközhívásokkal, szöveges magyarázat nélkül.`,
  ].join("\n\n");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let message: Anthropic.Message;
  try {
    message = await anthropic.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4096,
      tools: TOOLS,
      messages: [{ role: "user", content: promptText }],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Hiba történt az AI hívása során." },
      { status: 500 },
    );
  }

  const toolUses = message.content.filter(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (toolUses.length === 0) {
    return NextResponse.json({ error: "Az AI nem hajtott végre módosítást. Próbáld átfogalmazni a kérést." }, { status: 502 });
  }

  const applied: string[] = [];
  const errors: string[] = [];

  for (const toolUse of toolUses) {
    try {
      const input = toolUse.input as Record<string, unknown>;
      switch (toolUse.name) {
        case "add_text_section": {
          await addTextSection(supabase, projectId, String(input.title ?? ""), String(input.body ?? ""));
          applied.push("Új szekció hozzáadva.");
          break;
        }
        case "update_text_section": {
          await updateTextSection(supabase, String(input.id), {
            title: input.title ? String(input.title) : undefined,
            body: input.body ? String(input.body) : undefined,
          });
          applied.push("Szekció frissítve.");
          break;
        }
        case "delete_text_section": {
          const target = blocks.find((b) => b.id === input.id);
          if (target && isStructuralBlockType(target.type)) {
            errors.push("A strukturális szekciókat nem lehet törölni, csak elrejteni.");
            break;
          }
          await deleteTextSection(supabase, String(input.id));
          applied.push("Szekció törölve.");
          break;
        }
        case "move_block": {
          await moveBlock(supabase, projectId, String(input.id), input.direction === "up" ? "up" : "down");
          applied.push("Szekció mozgatva.");
          break;
        }
        case "hide_block": {
          await setBlockVisible(supabase, String(input.id), false);
          applied.push("Szekció elrejtve.");
          break;
        }
        case "show_block": {
          await setBlockVisible(supabase, String(input.id), true);
          applied.push("Szekció megjelenítve.");
          break;
        }
        case "set_accent_color": {
          await setAccentColor(supabase, projectId, String(input.hex));
          applied.push("Kiemelő szín frissítve.");
          break;
        }
        case "reset_accent_color": {
          await setAccentColor(supabase, projectId, null);
          applied.push("Kiemelő szín visszaállítva.");
          break;
        }
        default:
          errors.push(`Ismeretlen művelet: ${toolUse.name}`);
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Hiba történt egy művelet végrehajtása során.");
    }
  }

  const updatedBlocks = await listBlocks(supabase, projectId);
  const { data: updatedProject } = await supabase
    .from("projects")
    .select("style_overrides")
    .eq("id", projectId)
    .maybeSingle();

  return NextResponse.json({
    applied,
    errors,
    blocks: updatedBlocks,
    accentColor: (updatedProject?.style_overrides as { accent?: string } | null)?.accent ?? null,
  });
}
