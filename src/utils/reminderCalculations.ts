import { ReminderSchedule } from "@/types/wateringReminder";
import { WateringRecord } from "@/types/wateringHistory";
import { differenceInDays, addDays, startOfDay } from "date-fns";

export function calculateNextWatering(
  lastRecord: WateringRecord | null,
  baseIntervalDays: number,
  targetDrainage: number
): ReminderSchedule {
  const today = startOfDay(new Date());
  
  if (!lastRecord) {
    return {
      nextWateringDate: today,
      daysUntilNext: 0,
      shouldNotify: true,
      message: "No hay registros de riego. Es momento de registrar tu primer riego."
    };
  }

  const lastWateringDate = startOfDay(new Date(lastRecord.date));
  const daysSinceLastWatering = differenceInDays(today, lastWateringDate);

  // Adjust interval based on drainage
  // If drainage is low (< target), plants may need more water sooner
  // If drainage is high (> target), can wait longer
  let adjustedInterval = baseIntervalDays;
  
  if (lastRecord.drainage < targetDrainage - 10) {
    // Low drainage, water sooner (reduce interval by 1 day)
    adjustedInterval = Math.max(1, baseIntervalDays - 1);
  } else if (lastRecord.drainage > targetDrainage + 10) {
    // High drainage, can wait longer (add 1 day)
    adjustedInterval = baseIntervalDays + 1;
  }

  const nextWateringDate = addDays(lastWateringDate, adjustedInterval);
  const daysUntilNext = differenceInDays(nextWateringDate, today);

  let shouldNotify = false;
  let message = "";

  if (daysUntilNext <= 0) {
    shouldNotify = true;
    message = `Es momento de regar. Último riego hace ${daysSinceLastWatering} días con ${lastRecord.drainage}% de drenaje.`;
  } else if (daysUntilNext === 1) {
    shouldNotify = true;
    message = `Próximo riego mañana. Último drenaje: ${lastRecord.drainage}% (objetivo: ${targetDrainage}%).`;
  } else {
    message = `Próximo riego en ${daysUntilNext} días. Último drenaje: ${lastRecord.drainage}%.`;
  }

  return {
    nextWateringDate,
    daysUntilNext,
    shouldNotify,
    message
  };
}

export function getPhaseIntervalRecommendation(phase: string): number {
  const normalizedPhase = phase.toLowerCase().trim();
  
  // Recommended watering intervals by phase
  const intervals: Record<string, number> = {
    "plantula": 2,
    "plántula": 2,
    "vegetativo": 2,
    "floracion_t1": 2,
    "floración_t1": 2,
    "floracion_t2": 2,
    "floración_t2": 2,
    "floracion_t3": 2,
    "floración_t3": 2,
    "flush": 3
  };

  return intervals[normalizedPhase] || 2;
}
