import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { SavedRecipe } from "@/types/savedRecipe";
import { toast } from "sonner";

interface SaveRecipeDialogProps {
  recipe: Omit<SavedRecipe, "id" | "name" | "notes" | "createdAt">;
  onSave: (name: string, notes: string) => void;
}

export function SaveRecipeDialog({ recipe, onSave }: SaveRecipeDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Ingresa un nombre para la receta");
      return;
    }
    onSave(name, notes);
    setOpen(false);
    setName("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Save className="w-4 h-4" />
          Guardar Receta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guardar Receta</DialogTitle>
          <DialogDescription>
            Guarda esta receta en tus favoritos para usarla más tarde
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Receta *</Label>
            <Input
              id="name"
              placeholder="Ej: Vegetativo Semana 3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Agregar notas sobre esta receta..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
