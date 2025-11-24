import { useState } from "react";
import { FenologicalPhase, SystemType, CalculationResult } from "@/types/fertilizer";
import { SavedRecipe } from "@/types/savedRecipe";
import { ALL_SALES, SALES_PRINCIPALES } from "@/data/sales";
import { ALL_TARGETS } from "@/data/targets";
import { PhaseSelector } from "@/components/PhaseSelector";
import { TargetDisplay } from "@/components/TargetDisplay";
import { SalesSelector } from "@/components/SalesSelector";
import { VolumeInput } from "@/components/VolumeInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { SaveRecipeDialog } from "@/components/SaveRecipeDialog";
import { SavedRecipesList } from "@/components/SavedRecipesList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Beaker, Info, BookOpen } from "lucide-react";
import { solveFertilizer, calculateEstimatedEC, calculateTotalNutrients } from "@/utils/fertilizerSolver";
import { saveRecipe } from "@/utils/recipeStorage";
import { toast } from "sonner";

const Index = () => {
  const [phase, setPhase] = useState<FenologicalPhase>("vegetativo");
  const [system, setSystem] = useState<SystemType>("hidroponia");
  const [selectedSales, setSelectedSales] = useState<string[]>(
    SALES_PRINCIPALES.filter(s => s.tipo === "macro").map(s => s.id)
  );
  const [volume, setVolume] = useState(10);
  const [unit, setUnit] = useState<"L" | "gal">("L");
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [recipesKey, setRecipesKey] = useState(0);

  const currentTarget = ALL_TARGETS.find(
    t => t.phase === phase && t.system === system
  );

  const toggleSale = (saleId: string) => {
    setSelectedSales(prev =>
      prev.includes(saleId)
        ? prev.filter(id => id !== saleId)
        : [...prev, saleId]
    );
  };

  const calculateSolution = () => {
    if (!currentTarget) {
      toast.error("No se encontró objetivo para esta fase y sistema");
      return;
    }

    // Convertir galones a litros si es necesario
    const volumeInLiters = unit === "gal" ? volume * 3.78541 : volume;

    // Obtener sales seleccionadas
    const sales = ALL_SALES.filter(s => selectedSales.includes(s.id));

    if (sales.length === 0) {
      toast.error("Selecciona al menos una sal");
      return;
    }

    try {
      // Ejecutar el solver
      const calculationResults = solveFertilizer(
        currentTarget.ppm,
        sales,
        volumeInLiters
      );

      setResults(calculationResults);
      
      toast.success("Solución calculada exitosamente");
      
      // Scroll a resultados
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    } catch (error) {
      console.error("Error al calcular solución:", error);
      toast.error("Error al calcular la solución");
    }
  };

  const handleSaveRecipe = (name: string, notes: string) => {
    if (!results || !currentTarget) return;

    const recipe: SavedRecipe = {
      id: Date.now().toString(),
      name,
      notes,
      createdAt: new Date().toISOString(),
      phase,
      system,
      volume,
      unit,
      targetPPM: currentTarget.ppm,
      results,
      estimatedEC: calculateEstimatedEC(results, unit === "gal" ? volume * 3.78541 : volume)
    };

    saveRecipe(recipe);
    setRecipesKey(prev => prev + 1);
    toast.success(`Receta "${name}" guardada exitosamente`);
  };

  const handleLoadRecipe = (recipe: SavedRecipe) => {
    setPhase(recipe.phase);
    setSystem(recipe.system);
    setVolume(recipe.volume);
    setUnit(recipe.unit);
    setResults(recipe.results);
    
    // Extraer IDs de sales de los resultados
    const saleIds = recipe.results.map(r => r.sale.id);
    setSelectedSales(saleIds);

    // Scroll a resultados
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
              <Beaker className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dr. Cannabis</h1>
              <p className="text-sm text-muted-foreground">Fertilizer-IA · Calculadora Profesional</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="calculator" className="gap-2">
              <Calculator className="w-4 h-4" />
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Recetas
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <Info className="w-4 h-4" />
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Cultivo</CardTitle>
                <CardDescription>
                  Selecciona la fase fenológica y el sistema de cultivo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhaseSelector
                  phase={phase}
                  system={system}
                  onPhaseChange={(p) => setPhase(p as FenologicalPhase)}
                  onSystemChange={(s) => setSystem(s as SystemType)}
                />
                <VolumeInput
                  volume={volume}
                  unit={unit}
                  onVolumeChange={setVolume}
                  onUnitChange={(u) => setUnit(u as "L" | "gal")}
                />
              </CardContent>
            </Card>

            {/* Targets Display */}
            <TargetDisplay target={currentTarget} />

            {/* Sales Selector */}
            <SalesSelector
              sales={ALL_SALES}
              selectedSales={selectedSales}
              onToggleSale={toggleSale}
            />

            {/* Calculate Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={calculateSolution}
                disabled={selectedSales.length === 0 || volume <= 0}
                className="gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calcular Solución Nutritiva
              </Button>
            </div>

            {/* Results Display */}
            {results && currentTarget && (
              <div id="results" className="space-y-4">
                {/* Botones de acción sobre resultados */}
                <div className="flex justify-center">
                  <SaveRecipeDialog
                    recipe={{
                      phase,
                      system,
                      volume,
                      unit,
                      targetPPM: currentTarget.ppm,
                      results,
                      estimatedEC: calculateEstimatedEC(results, unit === "gal" ? volume * 3.78541 : volume)
                    }}
                    onSave={handleSaveRecipe}
                  />
                </div>

                <ResultsDisplay
                  results={results}
                  targetPPM={currentTarget.ppm}
                  totalNutrients={calculateTotalNutrients(results)}
                  estimatedEC={calculateEstimatedEC(results, unit === "gal" ? volume * 3.78541 : volume)}
                  volumeLiters={unit === "gal" ? volume * 3.78541 : volume}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedRecipesList key={recipesKey} onLoadRecipe={handleLoadRecipe} />
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sobre Dr. Cannabis - Fertilizer-IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">¿Qué es esta aplicación?</h3>
                  <p className="text-muted-foreground">
                    Dr. Cannabis es una calculadora profesional de fertilizantes para cannabis que te ayuda a 
                    diseñar soluciones nutritivas precisas basadas en PPM y EC objetivo. Incluye una base de 
                    datos de más de 60 sales y ácidos precargados con sus composiciones químicas exactas.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Características Principales</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Cálculo de PPM/EC a gramos de sales para cualquier volumen</li>
                    <li>Herramientas de ajuste de pH (pH up / pH down)</li>
                    <li>Inventario de productos y sales fertilizantes</li>
                    <li>Objetivos nutricionales por fase y sistema de cultivo</li>
                    <li>Funciona 100% offline (próximamente en Electron)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sistemas Soportados</h3>
                  <p className="text-muted-foreground">
                    Tierra/Sustrato Orgánico, Coco y Hidroponía (DWC, NFT, etc.)
                  </p>
                </div>

                <div className="p-4 rounded-md bg-muted">
                  <p className="text-xs text-muted-foreground">
                    <strong>Aviso Legal:</strong> Esta aplicación tiene fines exclusivamente educativos y técnicos. 
                    El cultivo de cannabis puede estar regulado o prohibido en tu jurisdicción. 
                    Es responsabilidad del usuario conocer y cumplir con las leyes locales.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            Dr. Cannabis - Fertilizer-IA · Herramienta educativa para cultivadores técnicos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
