/**
 * Calcula cuántos ml de ácido se necesitan para ajustar el pH
 * 
 * Esta es una aproximación simplificada. En la realidad, la capacidad buffer
 * del agua y las sales disueltas afectan significativamente la cantidad necesaria.
 * 
 * Se recomienda SIEMPRE hacer ajustes graduales y medir frecuentemente.
 */

export interface PhAdjustmentParams {
  currentPh: number;
  targetPh: number;
  volumeLiters: number;
  acidType: "fosforico" | "nitrico" | "sulfurico";
  acidConcentration: number; // % (ej: 85 para H3PO4 al 85%)
}

export interface PhAdjustmentResult {
  mlNeeded: number;
  acidType: string;
  warnings: string[];
  nutrientContribution: {
    nutrient: string;
    ppm: number;
  }[];
}

// Densidades aproximadas (g/ml) a 20°C
const ACID_DENSITIES: Record<string, number> = {
  fosforico: 1.685, // H3PO4 85%
  nitrico: 1.41,    // HNO3 65%
  sulfurico: 1.84   // H2SO4 98%
};

// Pesos moleculares
const MOLECULAR_WEIGHTS: Record<string, number> = {
  H3PO4: 98,
  HNO3: 63,
  H2SO4: 98
};

/**
 * Fórmula aproximada basada en la diferencia de pH y el volumen
 * Factor de ajuste empírico (varía según la dureza del agua)
 */
export function calculatePhAdjustment(params: PhAdjustmentParams): PhAdjustmentResult {
  const { currentPh, targetPh, volumeLiters, acidType, acidConcentration } = params;
  
  const warnings: string[] = [];
  
  // Validaciones
  if (currentPh <= targetPh) {
    warnings.push("El pH actual ya es igual o menor al objetivo. No se necesita ácido.");
    return {
      mlNeeded: 0,
      acidType: getAcidName(acidType),
      warnings,
      nutrientContribution: []
    };
  }
  
  if (currentPh - targetPh > 2) {
    warnings.push("⚠️ PRECAUCIÓN: Diferencia de pH muy grande. Ajustar gradualmente en múltiples etapas.");
  }
  
  if (acidType === "sulfurico") {
    warnings.push("⚠️ PELIGRO: Ácido sulfúrico es extremadamente corrosivo. Usar EPP completo y añadir SIEMPRE sobre agua.");
  }
  
  // Diferencia de pH
  const phDiff = currentPh - targetPh;
  
  // Factor empírico de ajuste (ml de ácido por litro para bajar 1 unidad de pH)
  // Este factor varía mucho según la dureza del agua y sales disueltas
  // Valores típicos: 0.5-2 ml/L por unidad de pH
  const baseFactor = 1.0; // ml por litro por unidad de pH
  
  // Ajuste por concentración del ácido
  const concentrationFactor = acidConcentration / 85; // Normalizado a 85%
  
  // Cálculo aproximado
  let mlNeeded = phDiff * volumeLiters * baseFactor / concentrationFactor;
  
  // Ajuste por tipo de ácido (potencia relativa)
  const acidStrength: Record<string, number> = {
    fosforico: 1.0,   // Referencia
    nitrico: 1.2,     // Más fuerte
    sulfurico: 1.8    // Mucho más fuerte
  };
  
  mlNeeded = mlNeeded / acidStrength[acidType];
  
  // Redondear a 1 decimal
  mlNeeded = Math.round(mlNeeded * 10) / 10;
  
  warnings.push("📊 Esta es una estimación. SIEMPRE ajustar gradualmente y medir después de cada adición.");
  warnings.push("⏱️ Esperar 5-10 minutos después de agregar ácido antes de medir nuevamente.");
  warnings.push("🔄 Recomendación: agregar solo el 50% de la cantidad calculada, medir, y ajustar si es necesario.");
  
  // Calcular aporte de nutrientes
  const nutrientContribution = calculateNutrientContribution(
    acidType,
    mlNeeded,
    volumeLiters,
    acidConcentration
  );
  
  return {
    mlNeeded,
    acidType: getAcidName(acidType),
    warnings,
    nutrientContribution
  };
}

function getAcidName(type: string): string {
  const names: Record<string, string> = {
    fosforico: "Ácido Fosfórico (H₃PO₄)",
    nitrico: "Ácido Nítrico (HNO₃)",
    sulfurico: "Ácido Sulfúrico (H₂SO₄)"
  };
  return names[type] || type;
}

function calculateNutrientContribution(
  acidType: string,
  mlAcid: number,
  volumeLiters: number,
  concentration: number
): { nutrient: string; ppm: number }[] {
  const density = ACID_DENSITIES[acidType];
  const gramsAcid = mlAcid * density * (concentration / 100);
  
  const contribution: { nutrient: string; ppm: number }[] = [];
  
  if (acidType === "fosforico") {
    // H3PO4 → P
    // Peso molecular H3PO4 = 98, P = 31
    const gramosP = gramsAcid * (31 / MOLECULAR_WEIGHTS.H3PO4);
    const ppmP = (gramosP / volumeLiters) * 1000;
    contribution.push({ nutrient: "P", ppm: Math.round(ppmP * 10) / 10 });
  } else if (acidType === "nitrico") {
    // HNO3 → N-NO3
    // Peso molecular HNO3 = 63, N = 14
    const gramosN = gramsAcid * (14 / MOLECULAR_WEIGHTS.HNO3);
    const ppmN = (gramosN / volumeLiters) * 1000;
    contribution.push({ nutrient: "N-NO3", ppm: Math.round(ppmN * 10) / 10 });
  } else if (acidType === "sulfurico") {
    // H2SO4 → S
    // Peso molecular H2SO4 = 98, S = 32
    const gramosS = gramsAcid * (32 / MOLECULAR_WEIGHTS.H2SO4);
    const ppmS = (gramosS / volumeLiters) * 1000;
    contribution.push({ nutrient: "S", ppm: Math.round(ppmS * 10) / 10 });
  }
  
  return contribution;
}
