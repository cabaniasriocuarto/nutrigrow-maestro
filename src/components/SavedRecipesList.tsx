import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BookOpen, Trash2, Calendar, Beaker } from "lucide-react";
import { SavedRecipe } from "@/types/savedRecipe";
import { getAllRecipes, deleteRecipe } from "@/utils/recipeStorage";
import { toast } from "sonner";

interface SavedRecipesListProps {
  onLoadRecipe: (recipe: SavedRecipe) => void;
}

const phaseLabels: Record<string, string> = {
  plantula: "Plántula",
  vegetativo: "Vegetativo",
  floracion_t1: "Floración T1",
  floracion_t2: "Floración T2",
  floracion_t3: "Floración T3",
  flush: "Flush"
};

const systemLabels: Record<string, string> = {
  tierra: "Tierra",
  coco: "Coco",
  hidroponia: "Hidroponía"
};

export function SavedRecipesList({ onLoadRecipe }: SavedRecipesListProps) {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);

  const loadRecipes = () => {
    setRecipes(getAllRecipes());
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleDelete = (id: string) => {
    deleteRecipe(id);
    loadRecipes();
    toast.success("Receta eliminada");
  };

  const handleLoad = (recipe: SavedRecipe) => {
    onLoadRecipe(recipe);
    toast.success(`Receta "${recipe.name}" cargada`);
  };

  if (recipes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recetas Guardadas
          </CardTitle>
          <CardDescription>
            No hay recetas guardadas aún
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Las recetas que guardes aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Recetas Guardadas ({recipes.length})
        </CardTitle>
        <CardDescription>
          Tus recetas favoritas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{recipe.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{phaseLabels[recipe.phase]}</Badge>
                      <Badge variant="outline">{systemLabels[recipe.system]}</Badge>
                      <Badge variant="secondary">
                        <Beaker className="w-3 h-3 mr-1" />
                        {recipe.volume} {recipe.unit}
                      </Badge>
                    </div>
                  </div>
                </div>

                {recipe.notes && (
                  <p className="text-sm text-muted-foreground italic">
                    "{recipe.notes}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleLoad(recipe)}
                    >
                      Cargar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar receta?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la receta "{recipe.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(recipe.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
