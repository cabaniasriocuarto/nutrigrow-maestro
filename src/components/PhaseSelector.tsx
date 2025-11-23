import { FenologicalPhase, SystemType } from "@/types/fertilizer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PhaseSelectorProps {
  phase: FenologicalPhase;
  system: SystemType;
  onPhaseChange: (phase: FenologicalPhase) => void;
  onSystemChange: (system: SystemType) => void;
}

const phaseLabels: Record<FenologicalPhase, string> = {
  plantula: "🌱 Plántula / Seedling",
  vegetativo: "🌿 Vegetativo",
  floracion_t1: "🌸 Floración T1 (Inicio)",
  floracion_t2: "🌺 Floración T2 (Media)",
  floracion_t3: "💐 Floración T3 (Final)",
  flush: "💧 Flush / Lavado"
};

const systemLabels: Record<SystemType, string> = {
  tierra: "🌍 Tierra / Sustrato",
  coco: "🥥 Coco",
  hidroponia: "💦 Hidroponía"
};

export function PhaseSelector({ phase, system, onPhaseChange, onSystemChange }: PhaseSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="phase-select">Fase Fenológica</Label>
        <Select value={phase} onValueChange={onPhaseChange}>
          <SelectTrigger id="phase-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(phaseLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="system-select">Sistema de Cultivo</Label>
        <Select value={system} onValueChange={onSystemChange}>
          <SelectTrigger id="system-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(systemLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
