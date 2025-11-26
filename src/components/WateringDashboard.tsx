import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllWateringRecords } from "@/utils/wateringStorage";
import { WateringRecord } from "@/types/wateringHistory";
import { TrendingUp, TrendingDown, Minus, Droplets, FlaskConical, Waves, Beaker } from "lucide-react";

interface Stats {
  avgEc: number;
  avgPh: number;
  avgDrainage: number;
  avgVolume: number;
  ecTrend: 'up' | 'down' | 'stable';
  phTrend: 'up' | 'down' | 'stable';
  drainageTrend: 'up' | 'down' | 'stable';
  volumeTrend: 'up' | 'down' | 'stable';
}

export function WateringDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const records = getAllWateringRecords();
    if (records.length === 0) {
      setStats(null);
      return;
    }

    const sorted = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate averages
    const avgEc = records.reduce((sum, r) => sum + r.ec, 0) / records.length;
    const avgPh = records.reduce((sum, r) => sum + r.ph, 0) / records.length;
    const avgDrainage = records.reduce((sum, r) => sum + r.drainage, 0) / records.length;
    const avgVolume = records.reduce((sum, r) => sum + r.volumeLiters, 0) / records.length;

    // Calculate trends (comparing last 30% vs first 30%)
    const segmentSize = Math.max(1, Math.floor(records.length * 0.3));
    const firstSegment = sorted.slice(0, segmentSize);
    const lastSegment = sorted.slice(-segmentSize);

    const calcTrend = (first: WateringRecord[], last: WateringRecord[], key: keyof WateringRecord): 'up' | 'down' | 'stable' => {
      const firstAvg = first.reduce((sum, r) => sum + (r[key] as number), 0) / first.length;
      const lastAvg = last.reduce((sum, r) => sum + (r[key] as number), 0) / last.length;
      const diff = ((lastAvg - firstAvg) / firstAvg) * 100;
      
      if (Math.abs(diff) < 5) return 'stable';
      return diff > 0 ? 'up' : 'down';
    };

    setStats({
      avgEc,
      avgPh,
      avgDrainage,
      avgVolume,
      ecTrend: calcTrend(firstSegment, lastSegment, 'ec'),
      phTrend: calcTrend(firstSegment, lastSegment, 'ph'),
      drainageTrend: calcTrend(firstSegment, lastSegment, 'drainage'),
      volumeTrend: calcTrend(firstSegment, lastSegment, 'volumeLiters')
    });
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-chart-1" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-chart-2" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Cultivo</CardTitle>
          <CardDescription>Las estadísticas aparecerán cuando tengas registros</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Sin datos disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Cultivo</CardTitle>
        <CardDescription>Estadísticas promedio y tendencias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">EC Promedio</span>
              </div>
              <TrendIcon trend={stats.ecTrend} />
            </div>
            <div className="text-2xl font-bold">{stats.avgEc.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">mS/cm</div>
          </div>

          <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">pH Promedio</span>
              </div>
              <TrendIcon trend={stats.phTrend} />
            </div>
            <div className="text-2xl font-bold">{stats.avgPh.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">unidades</div>
          </div>

          <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Drenaje Promedio</span>
              </div>
              <TrendIcon trend={stats.drainageTrend} />
            </div>
            <div className="text-2xl font-bold">{stats.avgDrainage.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">porcentaje</div>
          </div>

          <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Volumen Promedio</span>
              </div>
              <TrendIcon trend={stats.volumeTrend} />
            </div>
            <div className="text-2xl font-bold">{stats.avgVolume.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">litros</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
