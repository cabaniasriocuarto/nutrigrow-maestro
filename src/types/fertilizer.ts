export type SaleType = 
  | "macro" 
  | "secundario" 
  | "micro" 
  | "micro_mix" 
  | "macro_mix" 
  | "aditivo" 
  | "ph_up" 
  | "ph_down" 
  | "organico";

export type SystemType = "tierra" | "coco" | "hidroponia";

export type FenologicalPhase = 
  | "plantula" 
  | "vegetativo" 
  | "floracion_t1" 
  | "floracion_t2" 
  | "floracion_t3" 
  | "flush";

export interface Nutrient {
  [key: string]: number;
}

export interface Sale {
  id: string;
  nombre: string;
  formula: string;
  tipo: SaleType;
  aporta: Nutrient;
  pureza?: number;
  notas?: string;
}

export interface Target {
  phase: FenologicalPhase;
  system: SystemType;
  ppm: Nutrient;
  ecMin: number;
  ecMax: number;
  phMin: number;
  phMax: number;
}

export interface CalculationResult {
  sale: Sale;
  gramos: number;
  aporteNutrientes: Nutrient;
}
