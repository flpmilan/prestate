export type ProjectStatus = "draft" | "published";
export type UnitStatus = "available" | "reserved" | "sold";
export type ProjectTheme = "warm" | "dark" | "minimal";

export type Organization = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Project = {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  status: ProjectStatus;
  theme: ProjectTheme;
  description: string | null;
  address: string | null;
  hero_image_url: string | null;
  building_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type FloorPlan = {
  id: string;
  project_id: string;
  name: string;
  image_url: string | null;
  render_3d_url: string | null;
  created_at: string;
};

export type Unit = {
  id: string;
  project_id: string;
  floor_plan_id: string | null;
  floor_plan_image_url: string | null;
  floor_plan_render_3d_url: string | null;
  unit_number: string;
  floor: number | null;
  area_sqm: number | null;
  room_count: number | null;
  price: number | null;
  status: UnitStatus;
  created_at: string;
};

export type UnitRoom = {
  id: string;
  unit_id: string;
  name: string;
  area_sqm: number | null;
  position: number;
  created_at: string;
};

export type FloorHotspot = {
  id: string;
  project_id: string;
  floor: number;
  label: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  project_id: string;
  image_url: string;
  position: number;
  created_at: string;
};

export type Lead = {
  id: string;
  project_id: string;
  unit_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
};
