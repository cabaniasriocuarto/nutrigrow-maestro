import { useState } from "react";
import { Sale } from "@/types/fertilizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface SalesSelectorProps {
  sales: Sale[];
  selectedSales: string[];
  onToggleSale: (saleId: string) => void;
}

const typeLabels: Record<string, string> = {
  macro: "Macronutrientes",
  secundario: "Secundarios",
  micro: "Micronutrientes",
  ph_down: "pH Down",
  ph_up: "pH Up"
};

export function SalesSelector({ sales, selectedSales, onToggleSale }: SalesSelectorProps) {
  const [openSections, setOpenSections] = useState<string[]>(["macro"]);

  const groupedSales = sales.reduce((acc, sale) => {
    if (!acc[sale.tipo]) {
      acc[sale.tipo] = [];
    }
    acc[sale.tipo].push(sale);
    return acc;
  }, {} as Record<string, Sale[]>);

  const toggleSection = (type: string) => {
    setOpenSections(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sales y Fertilizantes Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {Object.entries(groupedSales).map(([type, typeSales]) => (
              <Collapsible 
                key={type}
                open={openSections.includes(type)}
                onOpenChange={() => toggleSection(type)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted">
                  <span className="font-medium">{typeLabels[type] || type}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes(type) ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2 ml-4">
                  {typeSales.map((sale) => (
                    <div key={sale.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted">
                      <Checkbox
                        id={sale.id}
                        checked={selectedSales.includes(sale.id)}
                        onCheckedChange={() => onToggleSale(sale.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <label
                          htmlFor={sale.id}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {sale.nombre}
                        </label>
                        <p className="text-xs text-muted-foreground">{sale.formula}</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(sale.aporta).map((nutrient) => (
                            <Badge key={nutrient} variant="outline" className="text-xs">
                              {nutrient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
