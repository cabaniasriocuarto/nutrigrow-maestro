import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ScatterChart } from "recharts";
import { getAllWateringRecords } from "@/utils/wateringStorage";
import { WateringRecord } from "@/types/wateringHistory";
import { TrendingUp, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";

type DateFilter = '7d' | '30d' | 'all' | 'custom';

const PHASE_COLORS: Record<string, string> = {
  'Plántula': 'hsl(var(--chart-1))',
  'Vegetativo': 'hsl(var(--chart-2))',
  'Floración': 'hsl(var(--chart-3))',
  'Engorde': 'hsl(var(--chart-4))',
  'Lavado': 'hsl(var(--chart-5))'
};

export function WateringCharts() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('30d');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  useEffect(() => {
    loadChartData();
  }, [dateFilter, customStartDate, customEndDate]);

  const loadChartData = () => {
    let records = getAllWateringRecords();
    
    // Apply date filter
    const now = new Date();
    let startDate: Date | undefined;
    
    if (dateFilter === '7d') {
      startDate = subDays(now, 7);
    } else if (dateFilter === '30d') {
      startDate = subDays(now, 30);
    } else if (dateFilter === 'custom' && customStartDate) {
      startDate = customStartDate;
    }
    
    if (startDate) {
      records = records.filter(r => {
        const recordDate = parseISO(r.date);
        const endDate = dateFilter === 'custom' && customEndDate ? customEndDate : now;
        return recordDate >= startDate && recordDate <= endDate;
      });
    }
    
    const sortedRecords = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const data = sortedRecords.map((record: WateringRecord) => ({
      date: new Date(record.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      fullDate: record.date,
      ec: record.ec,
      ph: record.ph,
      drainage: record.drainage,
      volume: record.volumeLiters,
      phase: record.phase,
      phaseColor: PHASE_COLORS[record.phase] || 'hsl(var(--primary))'
    }));
    
    setChartData(data);
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Gráficas de Evolución
          </CardTitle>
          <CardDescription>
            Las gráficas aparecerán cuando tengas registros en el historial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Añade registros de riego para visualizar la evolución de los parámetros
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={dateFilter === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDateFilter('7d')}
        >
          Últimos 7 días
        </Button>
        <Button
          variant={dateFilter === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDateFilter('30d')}
        >
          Últimos 30 días
        </Button>
        <Button
          variant={dateFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDateFilter('all')}
        >
          Todo
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={dateFilter === 'custom' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Personalizado
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de inicio</label>
                <CalendarComponent
                  mode="single"
                  selected={customStartDate}
                  onSelect={(date) => {
                    setCustomStartDate(date);
                    setDateFilter('custom');
                  }}
                  locale={es}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de fin</label>
                <CalendarComponent
                  mode="single"
                  selected={customEndDate}
                  onSelect={(date) => {
                    setCustomEndDate(date);
                    setDateFilter('custom');
                  }}
                  locale={es}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolución de EC y pH
          </CardTitle>
          <CardDescription>
            Seguimiento temporal de conductividad eléctrica y acidez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'EC (mS/cm)', angle: -90, position: 'insideLeft' }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                label={{ value: 'pH', angle: 90, position: 'insideRight' }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-md p-2 shadow-md">
                        <p className="font-semibold">{data.date}</p>
                        <p className="text-sm">Fase: {data.phase}</p>
                        <p className="text-sm">EC: {data.ec} mS/cm</p>
                        <p className="text-sm">pH: {data.ph}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter 
                yAxisId="left"
                dataKey="ec" 
                name="EC"
                fill="hsl(var(--primary))"
              >
                {chartData.map((entry, index) => (
                  <circle key={index} r={4} fill={entry.phaseColor} />
                ))}
              </Scatter>
              <Scatter 
                yAxisId="right"
                dataKey="ph" 
                name="pH"
                fill="hsl(var(--chart-2))"
                shape="triangle"
              >
                {chartData.map((entry, index) => (
                  <path
                    key={index}
                    d="M 0,-4 L 4,4 L -4,4 Z"
                    fill={entry.phaseColor}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {Object.entries(PHASE_COLORS).map(([phase, color]) => (
              <div key={phase} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-muted-foreground">{phase}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Drenaje por Riego</CardTitle>
          <CardDescription>
            Porcentaje de drenaje en cada aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                label={{ value: 'Drenaje (%)', angle: -90, position: 'insideLeft' }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="drainage" 
                fill="hsl(var(--chart-3))" 
                name="Drenaje (%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volumen de Riego</CardTitle>
          <CardDescription>
            Cantidad de solución aplicada en cada riego
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                label={{ value: 'Volumen (L)', angle: -90, position: 'insideLeft' }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="volume" 
                fill="hsl(var(--chart-4))" 
                name="Volumen (L)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
