import { InventoryItem } from "@/types/inventory";

const STORAGE_KEY = "dr_cannabis_inventory";

export function saveInventoryItem(item: InventoryItem): void {
  const inventory = getAllInventory();
  const existingIndex = inventory.findIndex(i => i.saleId === item.saleId);
  
  if (existingIndex >= 0) {
    inventory[existingIndex] = item;
  } else {
    inventory.push(item);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

export function getAllInventory(): InventoryItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getInventoryBySaleId(saleId: string): InventoryItem | null {
  return getAllInventory().find(i => i.saleId === saleId) || null;
}

export function deleteInventoryItem(saleId: string): void {
  const inventory = getAllInventory().filter(i => i.saleId !== saleId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

export function updateStock(saleId: string, newStock: number): void {
  const inventory = getAllInventory();
  const item = inventory.find(i => i.saleId === saleId);
  
  if (item) {
    item.stock = newStock;
    item.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }
}

export function deductStock(saleId: string, gramsUsed: number): boolean {
  const inventory = getAllInventory();
  const item = inventory.find(i => i.saleId === saleId);
  
  if (!item) return false;
  
  const stockInGrams = item.unit === "kg" ? item.stock * 1000 : item.stock;
  
  if (stockInGrams < gramsUsed) return false;
  
  const newStockInGrams = stockInGrams - gramsUsed;
  item.stock = item.unit === "kg" ? newStockInGrams / 1000 : newStockInGrams;
  item.lastUpdated = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  return true;
}
