import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WateringRecord } from "@/types/wateringHistory";
import { saveWateringRecord, getAllWateringRecords, deleteWateringRecord } from "@/utils/wateringStorage";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WateringHistory() {
  const [records, setRecords] = useState<WateringRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ec: "",
    ph: "",
    drainage: "",
    observations: "",
    volumeLiters: "",
    phase: "",
    system: "",
    recipeName: ""
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const allRecords = getAllWateringRecords();
    setRecords(allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSave = () => {
    const newRecord: WateringRecord = {
      id: Date.now().toString(),
      date: formData.date,
      ec: parseFloat(formData.ec),
      ph: parseFloat(formData.ph),
      drainage: parseFloat(formData.drainage),
      observations: formData.observations,
      recipeName: formData.recipeName,
      volumeLiters: parseFloat(formData.volumeLiters),
      phase: formData.phase,
      system: formData.system
    };

    saveWateringRecord(newRecord);
    loadRecords();
    setIsDialogOpen(false);
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      ec: "",
      ph: "",
      drainage: "",
      observations: "",
      volumeLiters: "",
      phase: "",
      system: "",
      recipeName: ""
    });

    toast({
      title: "Registro guardado",
      description: "El riego ha sido registrado correctamente"
    });
  };

  const handleDelete = (id: string) => {
    deleteWateringRecord(id);
    loadRecords();
    toast({
      title: "Registro eliminado",
      description: "El registro ha sido eliminado del historial"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historial de Riegos
            </CardTitle>
            <CardDescription>
              Registro temporal de EC, pH, drenaje y observaciones del cultivo
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Riego</DialogTitle>
                <DialogDescription>
                  Añade los detalles del riego para hacer seguimiento del cultivo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volumeLiters">Volumen (L)</Label>
                    <Input
                      id="volumeLiters"
                      type="number"
                      step="0.1"
                      value={formData.volumeLiters}
                      onChange={(e) => setFormData({ ...formData, volumeLiters: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ec">EC (mS/cm)</Label>
                    <Input
                      id="ec"
                      type="number"
                      step="0.1"
                      value={formData.ec}
                      onChange={(e) => setFormData({ ...formData, ec: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">pH</Label>
                    <Input
                      id="ph"
                      type="number"
                      step="0.1"
                      value={formData.ph}
                      onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drainage">Drenaje (%)</Label>
                    <Input
                      id="drainage"
                      type="number"
                      step="1"
                      value={formData.drainage}
                      onChange={(e) => setFormData({ ...formData, drainage: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phase">Fase</Label>
                    <Input
                      id="phase"
                      value={formData.phase}
                      onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                      placeholder="ej: Vegetativo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="system">Sistema</Label>
                    <Input
                      id="system"
                      value={formData.system}
                      onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                      placeholder="ej: Hidroponía"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipeName">Receta Aplicada</Label>
                  <Input
                    id="recipeName"
                    value={formData.recipeName}
                    onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
                    placeholder="Nombre de la receta (opcional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observations">Observaciones</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Notas sobre el riego, estado de las plantas, etc."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Guardar Registro</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay registros. Añade tu primer riego para comenzar el seguimiento.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Volumen (L)</TableHead>
                  <TableHead>EC</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>Drenaje (%)</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Receta</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>{record.volumeLiters}</TableCell>
                    <TableCell>{record.ec.toFixed(2)}</TableCell>
                    <TableCell>{record.ph.toFixed(1)}</TableCell>
                    <TableCell>{record.drainage}%</TableCell>
                    <TableCell>{record.phase}</TableCell>
                    <TableCell>{record.recipeName || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.observations || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
