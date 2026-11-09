import type { FloorPlan, Unit } from "@/lib/types";

export type SiteThemeProps = {
  projectId: string;
  name: string;
  address: string | null;
  description: string | null;
  floorPlans: FloorPlan[];
  units: Unit[];
};

export const statusLabel = { available: "Szabad", reserved: "Fenntartott", sold: "Eladva" } as const;
