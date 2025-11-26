import { ALL_TARGETS } from "@/data/targets";

export interface ValidationResult {
  isValid: boolean;
  ecStatus: "optimal" | "low" | "high" | "unknown";
  phStatus: "optimal" | "low" | "high" | "unknown";
  ecMessage?: string;
  phMessage?: string;
}

export function validateWateringValues(
  ec: number,
  ph: number,
  phase: string,
  system: string
): ValidationResult {
  // Normalize phase and system strings
  const normalizedPhase = phase.toLowerCase().trim();
  const normalizedSystem = system.toLowerCase().trim();

  // Find matching target
  const target = ALL_TARGETS.find(
    t => t.phase.toLowerCase() === normalizedPhase && 
         t.system.toLowerCase() === normalizedSystem
  );

  if (!target) {
    return {
      isValid: true,
      ecStatus: "unknown",
      phStatus: "unknown"
    };
  }

  let ecStatus: "optimal" | "low" | "high" = "optimal";
  let phStatus: "optimal" | "low" | "high" = "optimal";
  let ecMessage: string | undefined;
  let phMessage: string | undefined;

  // Validate EC
  if (ec < target.ecMin) {
    ecStatus = "low";
    ecMessage = `EC bajo: ${ec.toFixed(2)} mS/cm (óptimo: ${target.ecMin}-${target.ecMax})`;
  } else if (ec > target.ecMax) {
    ecStatus = "high";
    ecMessage = `EC alto: ${ec.toFixed(2)} mS/cm (óptimo: ${target.ecMin}-${target.ecMax})`;
  }

  // Validate pH
  if (ph < target.phMin) {
    phStatus = "low";
    phMessage = `pH bajo: ${ph.toFixed(1)} (óptimo: ${target.phMin}-${target.phMax})`;
  } else if (ph > target.phMax) {
    phStatus = "high";
    phMessage = `pH alto: ${ph.toFixed(1)} (óptimo: ${target.phMin}-${target.phMax})`;
  }

  const isValid = ecStatus === "optimal" && phStatus === "optimal";

  return {
    isValid,
    ecStatus,
    phStatus,
    ecMessage,
    phMessage
  };
}
