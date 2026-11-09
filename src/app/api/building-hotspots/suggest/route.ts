import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  projectId: z.string().uuid(),
  floors: z.number().int().min(1).max(60),
  instructions: z.string().trim().max(600).optional(),
});

const hotspotSchema = z.object({
  floor: z.number().int(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  w: z.number().min(0).max(100),
  h: z.number().min(0).max(100),
});

const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;

function resolveMediaType(contentType: string | null, url: string): (typeof ALLOWED_MEDIA_TYPES)[number] {
  const fromHeader = contentType?.split(";")[0]?.trim();
  if (fromHeader && (ALLOWED_MEDIA_TYPES as readonly string[]).includes(fromHeader)) {
    return fromHeader as (typeof ALLOWED_MEDIA_TYPES)[number];
  }
  const ext = url.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/png";
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Az AI funkció nincs beállítva a szerveren (hiányzó ANTHROPIC_API_KEY)." },
      { status: 500 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }
  const { projectId, floors, instructions } = parsed.data;

  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) {
    return NextResponse.json({ error: "Jelentkezz be." }, { status: 401 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, building_image_url, organization_id")
    .eq("id", projectId)
    .maybeSingle();

  if (!project || !project.building_image_url) {
    return NextResponse.json({ error: "Nincs feltöltött látványterv ehhez a projekthez." }, { status: 400 });
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", project.organization_id)
    .maybeSingle();

  if (!organization || organization.owner_id !== user.id) {
    return NextResponse.json({ error: "Nincs jogosultságod ehhez a projekthez." }, { status: 403 });
  }

  let base64: string;
  let mediaType: (typeof ALLOWED_MEDIA_TYPES)[number];
  try {
    const imageRes = await fetch(project.building_image_url);
    if (!imageRes.ok) throw new Error("image fetch failed");
    mediaType = resolveMediaType(imageRes.headers.get("content-type"), project.building_image_url);
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    base64 = buffer.toString("base64");
  } catch {
    return NextResponse.json({ error: "Nem sikerült betölteni a látványtervet." }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const promptParts = [
    `Ez egy társasház látványterve vagy homlokzati fotója. A felhasználó összesen ${floors} kijelölendő területet szeretne a képen, mindegyik egy-egy emeletnek felel meg.`,
    `A sávok NEM feltétlenül egyenlő magasságúak (pl. a földszint gyakran magasabb üzletsor, a tetőszint visszaugratott). Nézd meg figyelmesen a homlokzat tényleges elválasztó vonalait — párkányok, erkélyek, ablaksorok, anyagváltások — és ezek alapján határozd meg a valódi határokat, ne feltételezz egyenletes felosztást.`,
    `A sávok fedjék le az épület tényleges szélességét a képen (ha az épület nem foglalja el a kép teljes szélességét, azt vedd figyelembe). Alapesetben számozd az emeleteket a legalsó láthatótól felfelé, 1-től ${floors}-ig.`,
  ];

  if (instructions) {
    promptParts.push(
      `Kiegészítő instrukció a felhasználótól, ami felülírja az alapértelmezett értelmezést: "${instructions}". Ezt vedd figyelembe abban is, mely sávokat jelölöd ki, hányat, és hogyan számozod őket.`,
    );
  }

  promptParts.push(
    `Válaszolj kizárólag a report_floor_hotspots eszköz meghívásával, pontosan ${floors} elemmel, szöveges válasz nélkül.`,
  );

  const promptText = promptParts.join("\n\n");

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 2048,
      tools: [
        {
          name: "report_floor_hotspots",
          description: "Report the bounding box of each building floor as percentages of the full image.",
          input_schema: {
            type: "object",
            properties: {
              hotspots: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    floor: {
                      type: "integer",
                      description: "Floor number, 1 = lowest floor shown in the image, increasing upward.",
                    },
                    x: { type: "number", description: "Left edge of the floor band, percent of image width, 0-100." },
                    y: { type: "number", description: "Top edge of the floor band, percent of image height, 0-100." },
                    w: { type: "number", description: "Width of the floor band, percent of image width, 0-100." },
                    h: { type: "number", description: "Height of the floor band, percent of image height, 0-100." },
                  },
                  required: ["floor", "x", "y", "w", "h"],
                },
              },
            },
            required: ["hotspots"],
          },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: promptText },
          ],
        },
      ],
    });

    const toolUse = message.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );

    let candidate: unknown = toolUse?.input;

    if (!candidate) {
      const textBlock = message.content.find(
        (block): block is Anthropic.TextBlock => block.type === "text",
      );
      const match = textBlock?.text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          candidate = JSON.parse(match[0]);
        } catch {
          candidate = null;
        }
      }
    }

    if (!candidate) {
      return NextResponse.json({ error: "Az AI nem adott értelmezhető választ." }, { status: 502 });
    }

    const result = z.object({ hotspots: z.array(hotspotSchema) }).safeParse(candidate);
    if (!result.success) {
      return NextResponse.json({ error: "Az AI válasza érvénytelen formátumú volt." }, { status: 502 });
    }

    return NextResponse.json({ hotspots: result.data.hotspots });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Hiba történt az AI hívása során." },
      { status: 500 },
    );
  }
}
