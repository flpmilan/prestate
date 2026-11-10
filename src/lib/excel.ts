import * as XLSX from "xlsx";
import type { UnitStatus } from "./types";

export type ParsedRoom = {
  name: string;
  area_sqm: number | null;
};

export type ParsedUnitRow = {
  unit_number: string;
  floor: number | null;
  area_sqm: number | null;
  room_count: number | null;
  price: number | null;
  status: UnitStatus;
  floor_plan_name: string | null;
  rooms: ParsedRoom[];
};

function normalizeHeader(header: string): string {
  return header
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

const HEADER_ALIASES: Record<string, keyof ParsedUnitRow> = {
  lakas: "unit_number",
  lakasszam: "unit_number",
  unit: "unit_number",
  unit_number: "unit_number",
  azonosito: "unit_number",
  emelet: "floor",
  floor: "floor",
  terulet: "area_sqm",
  teruletm2: "area_sqm",
  m2: "area_sqm",
  area: "area_sqm",
  area_sqm: "area_sqm",
  szoba: "room_count",
  szobaszam: "room_count",
  rooms: "room_count",
  room_count: "room_count",
  ar: "price",
  price: "price",
  statusz: "status",
  status: "status",
  alaprajz: "floor_plan_name",
  tipus: "floor_plan_name",
  type: "floor_plan_name",
  floor_plan: "floor_plan_name",
  helyisegek: "rooms",
  helyiseglista: "rooms",
  szobareszletek: "rooms",
  roomdetails: "rooms",
};

function normalizeStatus(value: unknown): UnitStatus {
  const v = normalizeHeader(String(value ?? ""));
  if (["fenntartott", "reserved", "foglalt"].includes(v)) return "reserved";
  if (["eladott", "sold"].includes(v)) return "sold";
  return "available";
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.,-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseRooms(value: unknown): ParsedRoom[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];

  return raw
    .split(/[,;|]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.+?)[:\-–]\s*([\d.,]+)\s*(?:m2|m²)?$/i);
      if (match) {
        return { name: match[1].trim(), area_sqm: toNumber(match[2]) };
      }
      return { name: part, area_sqm: null };
    });
}

export function parseUnitsWorkbook(buffer: ArrayBuffer): ParsedUnitRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  const parsed: ParsedUnitRow[] = [];

  for (const row of rows) {
    const mapped: Partial<ParsedUnitRow> = {};

    for (const [rawHeader, value] of Object.entries(row)) {
      const key = HEADER_ALIASES[normalizeHeader(rawHeader)];
      if (!key) continue;

      switch (key) {
        case "unit_number":
          mapped.unit_number = String(value ?? "").trim();
          break;
        case "floor_plan_name":
          mapped.floor_plan_name = String(value ?? "").trim() || null;
          break;
        case "floor":
        case "area_sqm":
        case "room_count":
        case "price":
          mapped[key] = toNumber(value);
          break;
        case "status":
          mapped.status = normalizeStatus(value);
          break;
        case "rooms":
          mapped.rooms = parseRooms(value);
          break;
      }
    }

    if (!mapped.unit_number) continue;

    parsed.push({
      unit_number: mapped.unit_number,
      floor: mapped.floor ?? null,
      area_sqm: mapped.area_sqm ?? null,
      room_count: mapped.room_count ?? null,
      price: mapped.price ?? null,
      status: mapped.status ?? "available",
      floor_plan_name: mapped.floor_plan_name ?? null,
      rooms: mapped.rooms ?? [],
    });
  }

  return parsed;
}
