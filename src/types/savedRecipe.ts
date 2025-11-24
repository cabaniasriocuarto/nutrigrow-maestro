import { CalculationResult, FenologicalPhase, SystemType, Nutrient } from "./fertilizer";

export interface SavedRecipe {
  id: string;
  name: string;
  notes: string;
  createdAt: string;
  phase: FenologicalPhase;
  system: SystemType;
  volume: number;
  unit: "L" | "gal";
  targetPPM: Nutrient;
  results: CalculationResult[];
  estimatedEC: number;
}
