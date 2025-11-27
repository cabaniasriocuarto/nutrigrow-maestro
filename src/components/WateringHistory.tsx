import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { WateringRecord } from "@/types/wateringHistory";
import { saveWateringRecord, getAllWateringRecords, deleteWateringRecord } from "@/utils/wateringStorage";
import { getAllZones } from "@/utils/zoneStorage";
import { Plus, Trash2, Calendar, FileDown, FileSpreadsheet, AlertTriangle, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, exportToCSV } from "@/utils/exportUtils";
import { validateWateringValues } from "@/utils/wateringValidation";

export function WateringHistory() {
  const [records, setRecords] = useState<WateringRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [zones, setZones] = useState<any[]>([]);
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
    setZones(getAllZones());
  }, []);

  const loadRecords = () => {
    const allRecords = getAllWateringRecords();
    setRecords(allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSave = () => {
    // Validate EC and pH ranges
    const validation = validateWateringValues(
      parseFloat(formData.ec),
      parseFloat(formData.ph),
      formData.phase,
      formData.system
    );

    if (bulkMode && selectedZones.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos una zona o lote",
        variant: "destructive"
      });
      return;
    }

    // Create records
    const zonesToProcess = bulkMode 
      ? zones.filter(z => selectedZones.includes(z.id))
      : [{ id: "", name: "" }]; // Single record without zone

    zonesToProcess.forEach(zone => {
      const newRecord: WateringRecord = {
        id: `${Date.now()}-${zone.id || 'single'}`,
        date: formData.date,
        ec: parseFloat(formData.ec),
        ph: parseFloat(formData.ph),
        drainage: parseFloat(formData.drainage),
        observations: formData.observations,
        recipeName: formData.recipeName,
        volumeLiters: parseFloat(formData.volumeLiters),
        phase: formData.phase,
        system: formData.system,
        zoneId: zone.id || undefined,
        zoneName: zone.name || undefined
      };

      saveWateringRecord(newRecord);
    });

    loadRecords();
    setIsDialogOpen(false);
    setSelectedZones([]);
    setBulkMode(false);
    
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

    // Show success or warning toast based on validation
    if (validation.isValid) {
      toast({
        title: "Registro guardado",
        description: bulkMode 
          ? `${zonesToProcess.length} registros creados para las zonas seleccionadas`
          : "El riego ha sido registrado correctamente"
      });
    } else {
      const warnings = [];
      if (validation.ecMessage) warnings.push(validation.ecMessage);
      if (validation.phMessage) warnings.push(validation.phMessage);
      
      toast({
        title: "⚠️ Registro guardado con advertencias",
        description: warnings.join(" • "),
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteWateringRecord(id);
    loadRecords();
    toast({
      title: "Registro eliminado",
      description: "El registro ha sido eliminado del historial"
    });
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF("watering-history-export", "historial-riegos.pdf");
      toast({
        title: "PDF exportado",
        description: "El historial se ha exportado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    try {
      if (records.length === 0) {
        toast({
          title: "Sin datos",
          description: "No hay registros para exportar",
          variant: "destructive",
        });
        return;
      }

      const csvData = records.map(r => ({
        Fecha: new Date(r.date).toLocaleDateString('es-ES'),
        "Volumen (L)": r.volumeLiters,
        "EC (mS/cm)": r.ec.toFixed(2),
        pH: r.ph.toFixed(1),
        "Drenaje (%)": r.drainage,
        Fase: r.phase,
        Sistema: r.system,
        Receta: r.recipeName || "-",
        Observaciones: r.observations || "-"
      }));

      exportToCSV(csvData, "historial-riegos.csv");
      
      toast({
        title: "CSV exportado",
        description: "El historial se ha exportado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el CSV",
        variant: "destructive",
      });
    }
  };

  return (
    <div id="watering-history-export">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historial de Riegos
              </CardTitle>
              <CardDescription>
                Registro temporal de EC, pH, drenaje y observaciones del cultivo
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Registro
                  </Button>
                </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Riego</DialogTitle>
                <DialogDescription>
                  Añade los detalles del riego para hacer seguimiento del cultivo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {zones.length > 0 && (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-accent/50">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <Label htmlFor="bulk-mode" className="cursor-pointer">
                        Modo Operación Masiva
                      </Label>
                    </div>
                    <Switch
                      id="bulk-mode"
                      checked={bulkMode}
                      onCheckedChange={setBulkMode}
                    />
                  </div>
                )}

                {bulkMode && (
                  <div className="space-y-3 p-4 border rounded-lg">
                    <Label className="text-base">Seleccionar Zonas/Lotes</Label>
                    <p className="text-sm text-muted-foreground">
                      Aplica este riego a múltiples zonas o lotes simultáneamente
                    </p>
                    <div className="grid gap-2 max-h-40 overflow-y-auto">
                      {zones.map((zone) => (
                        <div key={zone.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={zone.id}
                            checked={selectedZones.includes(zone.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedZones([...selectedZones, zone.id]);
                              } else {
                                setSelectedZones(selectedZones.filter(id => id !== zone.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={zone.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                          >
                            {zone.name}
                            <Badge variant="outline" className="text-xs">
                              {zone.type === 'zone' ? 'Zona' : 'Lote'}
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                  <TableHead>Zona/Lote</TableHead>
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
                    <TableCell>
                      {record.zoneName ? (
                        <Badge variant="secondary">{record.zoneName}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
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
    </div>
  );
}
