export interface WateringReminderSettings {
  enabled: boolean;
  daysInterval: number; // Base interval between waterings
  phase: string;
  targetDrainage: number; // Target drainage percentage
  lastReminderDate?: string;
  notificationsEnabled: boolean;
}

export interface ReminderSchedule {
  nextWateringDate: Date;
  daysUntilNext: number;
  shouldNotify: boolean;
  message: string;
}
