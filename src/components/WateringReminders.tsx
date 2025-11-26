import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Droplets, Calendar, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  saveReminderSettings, 
  getReminderSettings, 
  requestNotificationPermission,
  showWateringNotification 
} from "@/utils/reminderStorage";
import { calculateNextWatering, getPhaseIntervalRecommendation } from "@/utils/reminderCalculations";
import { getAllWateringRecords } from "@/utils/wateringStorage";
import { WateringReminderSettings } from "@/types/wateringReminder";

export function WateringReminders() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<WateringReminderSettings>({
    enabled: false,
    daysInterval: 2,
    phase: "vegetativo",
    targetDrainage: 20,
    notificationsEnabled: false
  });
  const [schedule, setSchedule] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const saved = getReminderSettings();
    if (saved) {
      setSettings(saved);
    }
    setHasPermission(Notification.permission === "granted");
    checkReminders();
  }, []);

  useEffect(() => {
    if (settings.enabled) {
      updateSchedule();
    }
  }, [settings]);

  const updateSchedule = () => {
    const records = getAllWateringRecords();
    const lastRecord = records.length > 0 ? records[0] : null;
    
    const nextSchedule = calculateNextWatering(
      lastRecord,
      settings.daysInterval,
      settings.targetDrainage
    );
    
    setSchedule(nextSchedule);
  };

  const checkReminders = () => {
    const saved = getReminderSettings();
    if (!saved || !saved.enabled || !saved.notificationsEnabled) return;

    const records = getAllWateringRecords();
    const lastRecord = records.length > 0 ? records[0] : null;
    
    const nextSchedule = calculateNextWatering(
      lastRecord,
      saved.daysInterval,
      saved.targetDrainage
    );

    if (nextSchedule.shouldNotify) {
      const now = new Date().toISOString();
      const lastReminder = saved.lastReminderDate;
      
      // Only notify once per day
      if (!lastReminder || !lastReminder.startsWith(now.split('T')[0])) {
        showWateringNotification(nextSchedule.message);
        saveReminderSettings({
          ...saved,
          lastReminderDate: now
        });
      }
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    
    if (granted) {
      setHasPermission(true);
      const newSettings = { ...settings, notificationsEnabled: true };
      setSettings(newSettings);
      saveReminderSettings(newSettings);
      
      toast({
        title: "Notificaciones activadas",
        description: "Recibirás recordatorios cuando sea momento de regar"
      });
    } else {
      toast({
        title: "Permiso denegado",
        description: "Por favor, activa las notificaciones en la configuración del navegador",
        variant: "destructive"
      });
    }
  };

  const handleToggleReminders = (enabled: boolean) => {
    const newSettings = { ...settings, enabled };
    setSettings(newSettings);
    saveReminderSettings(newSettings);
    
    if (enabled) {
      updateSchedule();
      toast({
        title: "Recordatorios activados",
        description: "El sistema calculará automáticamente tu próximo riego"
      });
    } else {
      toast({
        title: "Recordatorios desactivados",
        description: "No recibirás más recordatorios de riego"
      });
    }
  };

  const handleUpdateSettings = (field: keyof WateringReminderSettings, value: any) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const handlePhaseChange = (phase: string) => {
    const recommendedInterval = getPhaseIntervalRecommendation(phase);
    const newSettings = { 
      ...settings, 
      phase,
      daysInterval: recommendedInterval 
    };
    setSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const testNotification = () => {
    showWateringNotification("Esta es una notificación de prueba. ¡Todo funciona correctamente!");
    toast({
      title: "Notificación enviada",
      description: "Revisa tus notificaciones del sistema"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recordatorios de Riego
            </CardTitle>
            <CardDescription>
              Configura alertas automáticas basadas en fase y drenaje
            </CardDescription>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={handleToggleReminders}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.enabled && (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                El sistema ajusta automáticamente los intervalos de riego basándose en el porcentaje de drenaje del último riego.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phase">Fase de Cultivo</Label>
                <Input
                  id="phase"
                  value={settings.phase}
                  onChange={(e) => handlePhaseChange(e.target.value)}
                  placeholder="ej: Vegetativo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Intervalo Base (días)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  max="7"
                  value={settings.daysInterval}
                  onChange={(e) => handleUpdateSettings('daysInterval', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drainage">Drenaje Objetivo (%)</Label>
                <Input
                  id="drainage"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.targetDrainage}
                  onChange={(e) => handleUpdateSettings('targetDrainage', parseInt(e.target.value))}
                />
              </div>
            </div>

            {schedule && (
              <div className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Próximo Riego</span>
                  </div>
                  <Badge variant={schedule.shouldNotify ? "destructive" : "secondary"}>
                    {schedule.daysUntilNext === 0 
                      ? "Hoy" 
                      : schedule.daysUntilNext === 1 
                      ? "Mañana" 
                      : `En ${schedule.daysUntilNext} días`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {schedule.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fecha programada: {schedule.nextWateringDate.toLocaleDateString('es-ES')}
                </p>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones del Navegador</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe alertas cuando sea momento de regar
                  </p>
                </div>
                {hasPermission && settings.notificationsEnabled ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    Activas
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BellOff className="h-3 w-3" />
                    Inactivas
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {!hasPermission || !settings.notificationsEnabled ? (
                  <Button onClick={handleEnableNotifications} variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Activar Notificaciones
                  </Button>
                ) : (
                  <Button onClick={testNotification} variant="outline" size="sm">
                    <Droplets className="h-4 w-4 mr-2" />
                    Probar Notificación
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {!settings.enabled && (
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Activa los recordatorios para recibir alertas automáticas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
