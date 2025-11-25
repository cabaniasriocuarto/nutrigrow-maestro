import { WateringRecord } from "@/types/wateringHistory";

const STORAGE_KEY = "dr_cannabis_watering_history";

export function saveWateringRecord(record: WateringRecord): void {
  const history = getAllWateringRecords();
  history.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getAllWateringRecords(): WateringRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function deleteWateringRecord(id: string): void {
  const history = getAllWateringRecords().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getRecordsByDateRange(startDate: string, endDate: string): WateringRecord[] {
  const all = getAllWateringRecords();
  return all.filter(r => r.date >= startDate && r.date <= endDate);
}
