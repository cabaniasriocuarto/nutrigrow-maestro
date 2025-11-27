import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Zone } from "@/types/zone";
import { saveZone, getAllZones, deleteZone } from "@/utils/zoneStorage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ZoneManager() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    type: "zone" as "zone" | "batch",
    description: ""
  });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = () => {
    setZones(getAllZones());
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive"
      });
      return;
    }

    const newZone: Zone = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      createdAt: new Date().toISOString()
    };

    saveZone(newZone);
    loadZones();
    setIsDialogOpen(false);
    
    setFormData({
      name: "",
      type: "zone",
      description: ""
    });

    toast({
      title: "Zona/Lote creado",
      description: `${formData.type === 'zone' ? 'Zona' : 'Lote'} "${formData.name}" agregado correctamente`
    });
  };

  const handleDelete = (id: string) => {
    deleteZone(id);
    loadZones();
    toast({
      title: "Eliminado",
      description: "La zona/lote ha sido eliminada"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Gestión de Zonas y Lotes
            </CardTitle>
            <CardDescription>
              Organiza tus plantas por ubicación o grupos de cultivo
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Zona/Lote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Zona o Lote</DialogTitle>
                <DialogDescription>
                  Define una nueva zona de cultivo o lote de plantas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "zone" | "batch") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zone">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Zona (ubicación física)
                        </div>
                      </SelectItem>
                      <SelectItem value="batch">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          Lote (grupo de plantas)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    placeholder="ej: Carpa 1, Lote A, Exterior"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Detalles adicionales..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {zones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay zonas o lotes creados</p>
            <p className="text-sm">Crea tu primera zona para organizar tus plantas</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {zone.type === 'zone' ? (
                      <MapPin className="h-4 w-4 text-primary" />
                    ) : (
                      <Layers className="h-4 w-4 text-primary" />
                    )}
                    <h3 className="font-semibold">{zone.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(zone.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Badge variant="outline">
                  {zone.type === 'zone' ? 'Zona' : 'Lote'}
                </Badge>
                {zone.description && (
                  <p className="text-sm text-muted-foreground">{zone.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
