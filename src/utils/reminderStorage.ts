import { WateringReminderSettings } from "@/types/wateringReminder";

const REMINDER_STORAGE_KEY = "dr_cannabis_watering_reminders";

export function saveReminderSettings(settings: WateringReminderSettings): void {
  localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(settings));
}

export function getReminderSettings(): WateringReminderSettings | null {
  const stored = localStorage.getItem(REMINDER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearReminderSettings(): void {
  localStorage.removeItem(REMINDER_STORAGE_KEY);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function showWateringNotification(message: string): void {
  if (Notification.permission === "granted") {
    new Notification("🌿 Dr. Cannabis - Recordatorio de Riego", {
      body: message,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "watering-reminder"
    });
  }
}
