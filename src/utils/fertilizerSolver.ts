import { Sale, Nutrient, CalculationResult } from "@/types/fertilizer";

/**
 * Resuelve el problema de optimización para calcular gramos de sales
 * necesarios para alcanzar PPM objetivo en un volumen dado.
 */
export function solveFertilizer(
  targetPPM: Nutrient,
  selectedSales: Sale[],
  volumeLiters: number
): CalculationResult[] {
  const results: CalculationResult[] = [];
  const currentPPM: Nutrient = {};
  const remainingPPM: Nutrient = { ...targetPPM };

  // Inicializar currentPPM en cero para todos los nutrientes objetivo
  Object.keys(targetPPM).forEach(nutrient => {
    currentPPM[nutrient] = 0;
  });

  // Ordenar sales por prioridad (macros primero, luego secundarios, luego micros)
  const prioritizedSales = [...selectedSales].sort((a, b) => {
    const priority: Record<string, number> = {
      macro: 1,
      secundario: 2,
      micro: 3,
      micro_mix: 4,
      macro_mix: 5,
      aditivo: 6,
      ph_down: 7,
      ph_up: 8
    };
    return (priority[a.tipo] || 99) - (priority[b.tipo] || 99);
  });

  // Algoritmo greedy: para cada sal, calcular cuánto necesitamos
  prioritizedSales.forEach(sale => {
    // Encontrar el nutriente limitante (el que más necesitamos de esta sal)
    let maxRatio = 0;
    let limitingNutrient = "";

    Object.entries(sale.aporta).forEach(([nutrient, contribution]) => {
      if (contribution > 0 && remainingPPM[nutrient] > 0) {
        const ratio = remainingPPM[nutrient] / contribution;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          limitingNutrient = nutrient;
        }
      }
    });

    if (maxRatio > 0) {
      // Calcular gramos necesarios basado en el nutriente limitante
      const ppmNeeded = remainingPPM[limitingNutrient];
      const ppmPerGramPerLiter = sale.aporta[limitingNutrient];
      
      // Aplicar factor de pureza
      const purityFactor = (sale.pureza || 100) / 100;
      
      // Gramos = (PPM necesario / PPM por gramo por litro) * volumen / pureza
      const gramos = (ppmNeeded / ppmPerGramPerLiter) * volumeLiters / purityFactor;

      if (gramos > 0.001) { // Solo incluir si es significativo
        const aporteNutrientes: Nutrient = {};

        // Calcular el aporte real de todos los nutrientes de esta sal
        Object.entries(sale.aporta).forEach(([nutrient, contribution]) => {
          const ppmAportado = (gramos / volumeLiters) * contribution * purityFactor;
          aporteNutrientes[nutrient] = ppmAportado;
          
          // Actualizar PPM actual y restante
          currentPPM[nutrient] = (currentPPM[nutrient] || 0) + ppmAportado;
          if (remainingPPM[nutrient] !== undefined) {
            remainingPPM[nutrient] = Math.max(0, remainingPPM[nutrient] - ppmAportado);
          }
        });

        results.push({
          sale,
          gramos,
          aporteNutrientes
        });
      }
    }
  });

  return results;
}

/**
 * Calcula el EC estimado basado en la suma de sales
 * Fórmula aproximada: EC (mS/cm) ≈ suma de gramos / litros * 0.7
 */
export function calculateEstimatedEC(
  results: CalculationResult[],
  volumeLiters: number
): number {
  const totalGrams = results.reduce((sum, r) => sum + r.gramos, 0);
  // Factor de conversión aproximado (varía según sales)
  return (totalGrams / volumeLiters) * 0.7;
}

/**
 * Suma todos los nutrientes aportados por las sales calculadas
 */
export function calculateTotalNutrients(results: CalculationResult[]): Nutrient {
  const total: Nutrient = {};
  
  results.forEach(result => {
    Object.entries(result.aporteNutrientes).forEach(([nutrient, ppm]) => {
      total[nutrient] = (total[nutrient] || 0) + ppm;
    });
  });

  return total;
}
