export interface InventoryItem {
  saleId: string;
  stock: number; // gramos disponibles
  unit: "g" | "kg";
  location: string;
  costPerKg: number;
  currency: string;
  lastUpdated: string;
  notes?: string;
}
