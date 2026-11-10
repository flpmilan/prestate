import { notFound } from "next/navigation";
import { loadSiteByTenant } from "./loadSite";
import { SiteRenderer } from "./SiteRenderer";

export default async function TenantSitePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const site = await loadSiteByTenant(tenant);

  if (!site) notFound();

  return <SiteRenderer site={site} />;
}
