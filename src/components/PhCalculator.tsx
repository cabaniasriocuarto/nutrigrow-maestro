import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Droplets, AlertTriangle, Calculator } from "lucide-react";
import { calculatePhAdjustment, PhAdjustmentParams, PhAdjustmentResult } from "@/utils/phCalculations";

export function PhCalculator() {
  const [currentPh, setCurrentPh] = useState("7.0");
  const [targetPh, setTargetPh] = useState("6.0");
  const [volume, setVolume] = useState("10");
  const [acidType, setAcidType] = useState<"fosforico" | "nitrico" | "sulfurico">("fosforico");
  const [concentration, setConcentration] = useState("85");
  const [result, setResult] = useState<PhAdjustmentResult | null>(null);

  const handleCalculate = () => {
    const params: PhAdjustmentParams = {
      currentPh: parseFloat(currentPh),
      targetPh: parseFloat(targetPh),
      volumeLiters: parseFloat(volume),
      acidType,
      acidConcentration: parseFloat(concentration)
    };

    const calculationResult = calculatePhAdjustment(params);
    setResult(calculationResult);
  };

  const isValid = 
    parseFloat(currentPh) > 0 && 
    parseFloat(currentPh) <= 14 &&
    parseFloat(targetPh) > 0 && 
    parseFloat(targetPh) <= 14 &&
    parseFloat(volume) > 0 &&
    parseFloat(concentration) > 0 &&
    parseFloat(concentration) <= 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Calculadora de Ajuste de pH
          </CardTitle>
          <CardDescription>
            Calcula cuánto ácido necesitas para ajustar el pH de tu solución
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Esta calculadora proporciona estimaciones. 
              Siempre ajusta gradualmente y mide el pH después de cada adición.
              Usa EPP (guantes, gafas) al manipular ácidos.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPh">pH Actual *</Label>
                <Input
                  id="currentPh"
                  type="number"
                  min="0"
                  max="14"
                  step="0.1"
                  value={currentPh}
                  onChange={(e) => setCurrentPh(e.target.value)}
                  placeholder="7.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetPh">pH Objetivo *</Label>
                <Input
                  id="targetPh"
                  type="number"
                  min="0"
                  max="14"
                  step="0.1"
                  value={targetPh}
                  onChange={(e) => setTargetPh(e.target.value)}
                  placeholder="6.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volumen de Solución (Litros) *</Label>
              <Input
                id="volume"
                type="number"
                min="0"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acidType">Tipo de Ácido *</Label>
                <Select value={acidType} onValueChange={(v) => setAcidType(v as any)}>
                  <SelectTrigger id="acidType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fosforico">Ácido Fosfórico (H₃PO₄)</SelectItem>
                    <SelectItem value="nitrico">Ácido Nítrico (HNO₃)</SelectItem>
                    <SelectItem value="sulfurico">Ácido Sulfúrico (H₂SO₄)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {acidType === "fosforico" && "Aporta Fósforo (P). Recomendado en floración."}
                  {acidType === "nitrico" && "Aporta Nitrógeno (N-NO3). Ideal para vegetativo."}
                  {acidType === "sulfurico" && "Aporta Azufre (S). MUY PELIGROSO - usar con extrema precaución."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concentration">Concentración del Ácido (%) *</Label>
                <Input
                  id="concentration"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  placeholder="85"
                />
                <p className="text-xs text-muted-foreground">
                  Típico: Fosfórico 85%, Nítrico 65%, Sulfúrico 98%
                </p>
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={!isValid}
              className="w-full gap-2"
              size="lg"
            >
              <Calculator className="w-5 h-5" />
              Calcular Cantidad de Ácido
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Resultado del Cálculo</CardTitle>
            <CardDescription>
              Para ajustar de pH {currentPh} a {targetPh} en {volume}L
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Cantidad Estimada</p>
              <p className="text-4xl font-bold text-primary">
                {result.mlNeeded.toFixed(1)} ml
              </p>
              <p className="text-sm text-muted-foreground mt-2">{result.acidType}</p>
            </div>

            {result.nutrientContribution.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Aporte de Nutrientes:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.nutrientContribution.map((contrib, idx) => (
                    <Badge key={idx} variant="secondary">
                      {contrib.nutrient}: +{contrib.ppm} PPM
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Advertencias y Recomendaciones:
              </h4>
              <div className="space-y-2">
                {result.warnings.map((warning, idx) => (
                  <Alert key={idx} variant={warning.includes("PELIGRO") ? "destructive" : "default"}>
                    <AlertDescription className="text-sm">
                      {warning}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Protocolo Seguro:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Usar guantes, gafas y ropa protectora</li>
                  <li>Trabajar en área bien ventilada</li>
                  <li>Agregar SIEMPRE el ácido sobre el agua, NUNCA al revés</li>
                  <li>Agregar solo el 50% de la cantidad calculada</li>
                  <li>Mezclar bien y esperar 5-10 minutos</li>
                  <li>Medir pH nuevamente</li>
                  <li>Ajustar si es necesario con pequeñas adiciones</li>
                </ol>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
