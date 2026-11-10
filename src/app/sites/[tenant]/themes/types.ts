import type { FloorHotspot, FloorPlan, Unit, UnitRoom } from "@/lib/types";

export type SiteThemeProps = {
  projectId: string;
  name: string;
  address: string | null;
  description: string | null;
  floorPlans: FloorPlan[];
  units: Unit[];
  buildingImageUrl: string | null;
  hotspots: FloorHotspot[];
  roomsByUnit: Record<string, UnitRoom[]>;
  galleryImages: string[];
};

export const statusLabel = { available: "Szabad", reserved: "Fenntartott", sold: "Eladva" } as const;
