import { FenologicalPhase } from "@/types/fertilizer";

export interface VpdResult {
  vpd: number;
  status: "low" | "optimal" | "high";
  recommendation: string;
  svp: number;
  leafVpd: number;
}

export function calculateVPD(
  airTemp: number,
  leafTemp: number,
  relativeHumidity: number,
  phase: FenologicalPhase
): VpdResult {
  // Calcular SVP (Saturated Vapor Pressure) usando ecuación de Magnus-Tetens
  const svpAir = 0.6108 * Math.exp((17.27 * airTemp) / (airTemp + 237.3));
  const svpLeaf = 0.6108 * Math.exp((17.27 * leafTemp) / (leafTemp + 237.3));
  
  // Calcular VPD
  const vpd = svpLeaf - (svpAir * (relativeHumidity / 100));
  const leafVpd = svpLeaf * (1 - relativeHumidity / 100);
  
  // Rangos óptimos por fase
  const optimalRanges: Record<FenologicalPhase, { min: number; max: number }> = {
    plantula: { min: 0.4, max: 0.8 },
    vegetativo: { min: 0.8, max: 1.2 },
    floracion_t1: { min: 1.0, max: 1.4 },
    floracion_t2: { min: 1.2, max: 1.6 },
    floracion_t3: { min: 1.2, max: 1.6 },
    flush: { min: 0.8, max: 1.2 }
  };
  
  const optimal = optimalRanges[phase];
  let status: "low" | "optimal" | "high";
  let recommendation: string;
  
  if (vpd < optimal.min) {
    status = "low";
    recommendation = "VPD bajo: Aumentar temperatura o reducir humedad para mejorar transpiración y absorción de nutrientes.";
  } else if (vpd > optimal.max) {
    status = "high";
    recommendation = "VPD alto: Reducir temperatura o aumentar humedad para evitar estrés hídrico y cierre estomático.";
  } else {
    status = "optimal";
    recommendation = "VPD óptimo: Condiciones ideales para transpiración y crecimiento en esta fase.";
  }
  
  return {
    vpd: Math.round(vpd * 100) / 100,
    status,
    recommendation,
    svp: Math.round(svpAir * 100) / 100,
    leafVpd: Math.round(leafVpd * 100) / 100
  };
}
