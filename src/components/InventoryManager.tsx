import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Package, Plus, Edit, Trash2, DollarSign, MapPin } from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import { Sale } from "@/types/fertilizer";
import { ALL_SALES } from "@/data/sales";
import { getAllInventory, saveInventoryItem, deleteInventoryItem } from "@/utils/inventoryStorage";
import { toast } from "sonner";

export function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadInventory = () => {
    setInventory(getAllInventory());
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const getSaleName = (saleId: string): string => {
    return ALL_SALES.find(s => s.id === saleId)?.nombre || saleId;
  };

  const handleSave = (item: InventoryItem) => {
    saveInventoryItem(item);
    loadInventory();
    setIsDialogOpen(false);
    setEditingItem(null);
    toast.success("Inventario actualizado");
  };

  const handleDelete = (saleId: string) => {
    deleteInventoryItem(saleId);
    loadInventory();
    toast.success("Item eliminado del inventario");
  };

  const openNewDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const totalValue = inventory.reduce((sum, item) => {
    const stockInKg = item.unit === "kg" ? item.stock : item.stock / 1000;
    return sum + (stockInKg * item.costPerKg);
  }, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventario de Sales
              </CardTitle>
              <CardDescription>
                Gestiona tu stock, ubicaciones y costos
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewDialog} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Item
                </Button>
              </DialogTrigger>
              <InventoryDialog
                item={editingItem}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay items en el inventario</p>
              <p className="text-sm text-muted-foreground mt-2">
                Comienza agregando sales a tu inventario
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{inventory.length}</div>
                    <p className="text-xs text-muted-foreground">Items en Stock</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {inventory.filter(i => {
                        const stockInG = i.unit === "kg" ? i.stock * 1000 : i.stock;
                        return stockInG < 100;
                      }).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Stock Bajo (&lt;100g)</p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sal</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Costo/kg</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const stockInKg = item.unit === "kg" ? item.stock : item.stock / 1000;
                    const value = stockInKg * item.costPerKg;
                    const stockInG = item.unit === "kg" ? item.stock * 1000 : item.stock;
                    const isLowStock = stockInG < 100;

                    return (
                      <TableRow key={item.saleId} className={isLowStock ? "bg-destructive/10" : ""}>
                        <TableCell className="font-medium">{getSaleName(item.saleId)}</TableCell>
                        <TableCell>
                          <span className={isLowStock ? "text-destructive font-semibold" : ""}>
                            {item.stock.toFixed(2)} {item.unit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {item.location || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="w-3 h-3" />
                            {item.costPerKg.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {item.currency} {value.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar del inventario?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Se eliminará {getSaleName(item.saleId)} del inventario.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(item.saleId)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface InventoryDialogProps {
  item: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}

function InventoryDialog({ item, onSave, onCancel }: InventoryDialogProps) {
  const [saleId, setSaleId] = useState(item?.saleId || "");
  const [stock, setStock] = useState(item?.stock.toString() || "0");
  const [unit, setUnit] = useState<"g" | "kg">(item?.unit || "g");
  const [location, setLocation] = useState(item?.location || "");
  const [costPerKg, setCostPerKg] = useState(item?.costPerKg.toString() || "0");
  const [currency, setCurrency] = useState(item?.currency || "USD");
  const [notes, setNotes] = useState(item?.notes || "");

  const handleSubmit = () => {
    if (!saleId) {
      toast.error("Selecciona una sal");
      return;
    }

    const newItem: InventoryItem = {
      saleId,
      stock: parseFloat(stock) || 0,
      unit,
      location,
      costPerKg: parseFloat(costPerKg) || 0,
      currency,
      lastUpdated: new Date().toISOString(),
      notes: notes || undefined
    };

    onSave(newItem);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{item ? "Editar" : "Agregar"} Item de Inventario</DialogTitle>
        <DialogDescription>
          Registra el stock disponible y costos de tus sales
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="sale">Sal *</Label>
          <Select value={saleId} onValueChange={setSaleId} disabled={!!item}>
            <SelectTrigger id="sale">
              <SelectValue placeholder="Selecciona una sal" />
            </SelectTrigger>
            <SelectContent>
              {ALL_SALES.map((sale) => (
                <SelectItem key={sale.id} value={sale.id}>
                  {sale.nombre} ({sale.formula})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              step="0.01"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit">Unidad</Label>
            <Select value={unit} onValueChange={(v) => setUnit(v as "g" | "kg")}>
              <SelectTrigger id="unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">Gramos (g)</SelectItem>
                <SelectItem value="kg">Kilogramos (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Estante A, Cajón 3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cost">Costo por kg</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              value={costPerKg}
              onChange={(e) => setCostPerKg(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="ARS">ARS ($)</SelectItem>
                <SelectItem value="BRL">BRL (R$)</SelectItem>
                <SelectItem value="MXN">MXN ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionales..."
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
