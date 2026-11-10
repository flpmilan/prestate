import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadSiteByProjectId } from "../../sites/[tenant]/loadSite";
import { SiteRenderer } from "../../sites/[tenant]/SiteRenderer";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect("/login");

  const site = await loadSiteByProjectId(projectId);
  if (!site) notFound();

  return <SiteRenderer site={site} />;
}
