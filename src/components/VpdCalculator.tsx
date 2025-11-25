import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { calculateVPD } from "@/utils/vpdCalculations";
import { FenologicalPhase } from "@/types/fertilizer";
import { Thermometer, Droplets, Leaf, AlertCircle, CheckCircle2, Info } from "lucide-react";

export function VpdCalculator() {
  const [airTemp, setAirTemp] = useState<string>("25");
  const [leafTemp, setLeafTemp] = useState<string>("23");
  const [humidity, setHumidity] = useState<string>("60");
  const [phase, setPhase] = useState<FenologicalPhase>("vegetativo");

  const phaseLabels: Record<FenologicalPhase, string> = {
    plantula: "Plántula",
    vegetativo: "Vegetativo",
    floracion_t1: "Floración Temprana",
    floracion_t2: "Floración Media",
    floracion_t3: "Floración Tardía",
    flush: "Lavado"
  };

  const result = airTemp && leafTemp && humidity
    ? calculateVPD(parseFloat(airTemp), parseFloat(leafTemp), parseFloat(humidity), phase)
    : null;

  const getStatusIcon = (status: "low" | "optimal" | "high") => {
    switch (status) {
      case "low":
        return <AlertCircle className="h-5 w-5" />;
      case "optimal":
        return <CheckCircle2 className="h-5 w-5" />;
      case "high":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusVariant = (status: "low" | "optimal" | "high") => {
    switch (status) {
      case "low":
        return "secondary";
      case "optimal":
        return "default";
      case "high":
        return "destructive";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Calculadora VPD
        </CardTitle>
        <CardDescription>
          Calcula el déficit de presión de vapor óptimo para tu cultivo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="airTemp" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Temperatura del Aire (°C)
            </Label>
            <Input
              id="airTemp"
              type="number"
              step="0.5"
              value={airTemp}
              onChange={(e) => setAirTemp(e.target.value)}
              placeholder="25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leafTemp" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Temperatura de Hoja (°C)
            </Label>
            <Input
              id="leafTemp"
              type="number"
              step="0.5"
              value={leafTemp}
              onChange={(e) => setLeafTemp(e.target.value)}
              placeholder="23"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humidity" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Humedad Relativa (%)
            </Label>
            <Input
              id="humidity"
              type="number"
              step="1"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              placeholder="60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phase">Fase Fenológica</Label>
            <Select value={phase} onValueChange={(value) => setPhase(value as FenologicalPhase)}>
              <SelectTrigger id="phase">
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
        </div>

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">VPD</p>
                    <p className="text-3xl font-bold">{result.vpd}</p>
                    <p className="text-xs text-muted-foreground mt-1">kPa</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Estado</p>
                    <div className="flex justify-center">
                      <Badge variant={getStatusVariant(result.status)} className="gap-1">
                        {getStatusIcon(result.status)}
                        {result.status === "optimal" ? "Óptimo" : result.status === "low" ? "Bajo" : "Alto"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">SVP Aire</p>
                    <p className="text-3xl font-bold">{result.svp}</p>
                    <p className="text-xs text-muted-foreground mt-1">kPa</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{result.recommendation}</AlertDescription>
            </Alert>

            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Rangos VPD Óptimos por Fase</h4>
              <div className="space-y-1 text-sm">
                <p>• Plántula: 0.4 - 0.8 kPa</p>
                <p>• Vegetativo: 0.8 - 1.2 kPa</p>
                <p>• Floración Temprana: 1.0 - 1.4 kPa</p>
                <p>• Floración Media/Tardía: 1.2 - 1.6 kPa</p>
                <p>• Lavado: 0.8 - 1.2 kPa</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
