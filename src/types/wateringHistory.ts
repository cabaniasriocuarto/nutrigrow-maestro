export interface WateringRecord {
  id: string;
  date: string;
  ec: number;
  ph: number;
  drainage: number; // porcentaje
  observations: string;
  recipeId?: string;
  recipeName?: string;
  volumeLiters: number;
  phase: string;
  system: string;
  zoneId?: string;
  zoneName?: string;
}
