import { Zone } from "@/types/zone";

const ZONES_STORAGE_KEY = "dr_cannabis_zones";

export function saveZone(zone: Zone): void {
  const zones = getAllZones();
  zones.push(zone);
  localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(zones));
}

export function getAllZones(): Zone[] {
  const stored = localStorage.getItem(ZONES_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function deleteZone(id: string): void {
  const zones = getAllZones().filter(z => z.id !== id);
  localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(zones));
}

export function updateZone(zone: Zone): void {
  const zones = getAllZones().map(z => z.id === zone.id ? zone : z);
  localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(zones));
}
