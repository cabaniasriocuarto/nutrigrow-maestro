import { CalculationResult, Nutrient } from "@/types/fertilizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, FileDown, Image as ImageIcon, Share2 } from "lucide-react";
import { exportToPDF, exportToPNG } from "@/utils/exportUtils";
import { toast } from "sonner";

interface ResultsDisplayProps {
  results: CalculationResult[];
  targetPPM: Nutrient;
  totalNutrients: Nutrient;
  estimatedEC: number;
  volumeLiters: number;
}

export function ResultsDisplay({
  results,
  targetPPM,
  totalNutrients,
  estimatedEC,
  volumeLiters
}: ResultsDisplayProps) {
  if (results.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No se pudo calcular una solución con las sales seleccionadas.
        </AlertDescription>
      </Alert>
    );
  }

  const handleExportPDF = async () => {
    try {
      await exportToPDF("results-export", "dr-cannabis-receta.pdf");
      toast.success("PDF descargado exitosamente");
    } catch (error) {
      toast.error("Error al exportar PDF");
      console.error(error);
    }
  };

  const handleExportPNG = async () => {
    try {
      await exportToPNG("results-export", "dr-cannabis-receta.png");
      toast.success("Imagen descargada exitosamente");
    } catch (error) {
      toast.error("Error al exportar imagen");
      console.error(error);
    }
  };

  // Calcular totales
  const totalGramos = results.reduce((sum, r) => sum + r.gramos, 0);

  // Calcular desviación de objetivos
  const getDeviationBadge = (nutrient: string, actual: number, target: number) => {
    const deviation = ((actual - target) / target) * 100;
    if (Math.abs(deviation) < 10) {
      return <Badge variant="default" className="text-xs">✓ {actual.toFixed(1)}</Badge>;
    } else if (Math.abs(deviation) < 25) {
      return <Badge variant="secondary" className="text-xs">⚠ {actual.toFixed(1)}</Badge>;
    } else {
      return <Badge variant="destructive" className="text-xs">✗ {actual.toFixed(1)}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Botones de Exportación */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="outline" onClick={handleExportPNG} className="gap-2">
          <ImageIcon className="w-4 h-4" />
          Exportar PNG
        </Button>
        <Button variant="outline" onClick={handleExportPDF} className="gap-2">
          <FileDown className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Contenedor para exportación */}
      <div id="results-export">
        {/* Resumen General */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Solución Calculada
          </CardTitle>
          <CardDescription>
            Para {volumeLiters} L de solución nutritiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">{totalGramos.toFixed(2)} g</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">EC Estimada</p>
              <p className="text-2xl font-bold">{estimatedEC.toFixed(2)} mS/cm</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cantidad Sales</p>
              <p className="text-2xl font-bold">{results.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Concentración</p>
              <p className="text-2xl font-bold">{(totalGramos / volumeLiters).toFixed(2)} g/L</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Sales y Gramos */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Requeridas</CardTitle>
          <CardDescription>
            Cantidad exacta de cada sal para el volumen especificado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sal</TableHead>
                <TableHead>Fórmula</TableHead>
                <TableHead className="text-right">Gramos Totales</TableHead>
                <TableHead className="text-right">g/L</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{result.sale.nombre}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{result.sale.formula}</TableCell>
                  <TableCell className="text-right font-mono">{result.gramos.toFixed(3)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {(result.gramos / volumeLiters).toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {result.sale.tipo}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell colSpan={2}>TOTAL</TableCell>
                <TableCell className="text-right">{totalGramos.toFixed(3)} g</TableCell>
                <TableCell className="text-right">{(totalGramos / volumeLiters).toFixed(4)} g/L</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tabla de Nutrientes: Objetivo vs Real */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación PPM: Objetivo vs Real</CardTitle>
          <CardDescription>
            Nutrientes aportados por la solución calculada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutriente</TableHead>
                <TableHead className="text-right">Objetivo (PPM)</TableHead>
                <TableHead className="text-right">Real (PPM)</TableHead>
                <TableHead className="text-right">Diferencia</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(targetPPM).map(nutrient => {
                const target = targetPPM[nutrient];
                const actual = totalNutrients[nutrient] || 0;
                const diff = actual - target;
                const diffPercent = ((diff / target) * 100).toFixed(1);

                return (
                  <TableRow key={nutrient}>
                    <TableCell className="font-medium">{nutrient}</TableCell>
                    <TableCell className="text-right font-mono">{target.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono">{actual.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      <span className={diff >= 0 ? "text-primary" : "text-destructive"}>
                        {diff >= 0 ? "+" : ""}{diff.toFixed(1)} ({diffPercent}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getDeviationBadge(nutrient, actual, target)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aporte Detallado por Sal */}
      <Card>
        <CardHeader>
          <CardTitle>Aporte de Nutrientes por Sal</CardTitle>
          <CardDescription>
            Desglose detallado de qué aporta cada sal en PPM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{result.sale.nombre}</h4>
                    <p className="text-xs text-muted-foreground">{result.gramos.toFixed(3)} g total</p>
                  </div>
                  <Badge>{result.sale.formula}</Badge>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.entries(result.aporteNutrientes).map(([nutrient, ppm]) => (
                    <div key={nutrient} className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-xs text-muted-foreground">{nutrient}</p>
                      <p className="font-mono text-sm font-semibold">{ppm.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                {result.sale.notas && (
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    ℹ️ {result.sale.notas}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
