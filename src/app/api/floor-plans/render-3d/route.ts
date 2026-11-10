import OpenAI, { toFile } from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  kind: z.enum(["floor_plan", "unit"]),
  id: z.string().uuid(),
});

const RENDER_PROMPT = [
  "This is a 2D architectural floor plan (top-down view). Your task is strictly a style conversion, not a redesign: render the SAME apartment as a photorealistic, furnished 3D isometric cutaway/dollhouse view, as if a roof were removed and we look down at an angle.",
  "You MUST keep, unchanged: the exact number, shape, and size of rooms; every wall's position and the overall outer footprint of the apartment; every door and window opening exactly where it appears in the floor plan; the room each piece of the apartment belongs to, based on the labels/text in the floor plan.",
  "Do NOT invent a different layout, do NOT add or remove rooms, do NOT change the floor plan's proportions or orientation. Only add: realistic materials (floors, wall colors), appropriately placed furniture for each labeled room type, and natural lighting.",
  "Think of this as if you traced over the original floor plan's walls with a ruler and then furnished it in 3D — the wall layout in your output must be recognizably identical to the input image.",
].join(" ");

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Az AI funkció nincs beállítva a szerveren (hiányzó OPENAI_API_KEY)." },
      { status: 500 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen kérés." }, { status: 400 });
  }
  const { kind, id } = parsed.data;

  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) {
    return NextResponse.json({ error: "Jelentkezz be." }, { status: 401 });
  }

  let sourceImageUrl: string | null;
  let organizationId: string;
  let projectId: string;

  if (kind === "floor_plan") {
    const { data: floorPlan } = await supabase
      .from("floor_plans")
      .select("id, image_url, project_id, projects(organization_id)")
      .eq("id", id)
      .maybeSingle();
    if (!floorPlan) {
      return NextResponse.json({ error: "Az alaprajz nem található." }, { status: 404 });
    }
    sourceImageUrl = floorPlan.image_url;
    projectId = floorPlan.project_id;
    organizationId = (floorPlan.projects as unknown as { organization_id: string } | null)?.organization_id ?? "";
  } else {
    const { data: unit } = await supabase
      .from("units")
      .select("id, floor_plan_image_url, project_id, projects(organization_id)")
      .eq("id", id)
      .maybeSingle();
    if (!unit) {
      return NextResponse.json({ error: "A lakás nem található." }, { status: 404 });
    }
    sourceImageUrl = unit.floor_plan_image_url;
    projectId = unit.project_id;
    organizationId = (unit.projects as unknown as { organization_id: string } | null)?.organization_id ?? "";
  }

  if (!sourceImageUrl || !organizationId) {
    return NextResponse.json({ error: "Nincs feltöltött alaprajz." }, { status: 400 });
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", organizationId)
    .maybeSingle();

  if (!organization || organization.owner_id !== user.id) {
    return NextResponse.json({ error: "Nincs jogosultságod ehhez az alaprajzhoz." }, { status: 403 });
  }

  let imageBuffer: Buffer;
  try {
    const imageRes = await fetch(sourceImageUrl);
    if (!imageRes.ok) throw new Error("image fetch failed");
    imageBuffer = Buffer.from(await imageRes.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Nem sikerült betölteni az alaprajzot." }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let renderBase64: string;
  try {
    const result = await openai.images.edit({
      model: "gpt-image-2",
      image: await toFile(imageBuffer, "floorplan.png", { type: "image/png" }),
      prompt: RENDER_PROMPT,
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("no image returned");
    renderBase64 = b64;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Hiba történt a 3D render generálása során." },
      { status: 500 },
    );
  }

  const renderBuffer = Buffer.from(renderBase64, "base64");
  const subPath = kind === "floor_plan" ? `floorplans/${id}` : `units/${id}`;
  const storagePath = `${organizationId}/${projectId}/render3d/${subPath}/${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("project-assets")
    .upload(storagePath, renderBuffer, { contentType: "image/png" });
  if (uploadError) {
    return NextResponse.json({ error: "Nem sikerült elmenteni a rendert." }, { status: 500 });
  }

  const { data: publicUrl } = supabase.storage.from("project-assets").getPublicUrl(storagePath);

  if (kind === "floor_plan") {
    await supabase.from("floor_plans").update({ render_3d_url: publicUrl.publicUrl }).eq("id", id);
  } else {
    await supabase.from("units").update({ floor_plan_render_3d_url: publicUrl.publicUrl }).eq("id", id);
  }

  return NextResponse.json({ render3dUrl: publicUrl.publicUrl });
}
