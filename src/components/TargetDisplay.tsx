import { Target } from "@/types/fertilizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TargetDisplayProps {
  target: Target | null;
}

export function TargetDisplay({ target }: TargetDisplayProps) {
  if (!target) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Objetivos Nutricionales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Selecciona una fase y sistema de cultivo para ver los objetivos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Objetivos Nutricionales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">PPM Objetivo por Nutriente</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(target.ppm).map(([nutrient, value]) => (
              <div key={nutrient} className="flex items-center justify-between p-2 rounded-md bg-muted">
                <span className="text-sm font-medium">{nutrient}:</span>
                <Badge variant="secondary">{value} ppm</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-md bg-muted">
            <p className="text-sm font-medium mb-1">EC Objetivo</p>
            <p className="text-lg font-bold">
              {target.ecMin.toFixed(1)} - {target.ecMax.toFixed(1)} mS/cm
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted">
            <p className="text-sm font-medium mb-1">pH Objetivo</p>
            <p className="text-lg font-bold">
              {target.phMin.toFixed(1)} - {target.phMax.toFixed(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
