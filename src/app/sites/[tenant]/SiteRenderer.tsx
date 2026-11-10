import { WarmTheme } from "./themes/WarmTheme";
import { DarkTheme } from "./themes/DarkTheme";
import { MinimalTheme } from "./themes/MinimalTheme";
import type { LoadedSite } from "./loadSite";

export function SiteRenderer({ site }: { site: LoadedSite }) {
  if (site.theme === "dark") return <DarkTheme {...site.themeProps} />;
  if (site.theme === "minimal") return <MinimalTheme {...site.themeProps} />;
  return <WarmTheme {...site.themeProps} />;
}
