import { WateringReminderSettings } from "@/types/wateringReminder";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

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
  // Use Capacitor LocalNotifications if available (native app)
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
  
  // Fallback to browser notifications for web
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

export async function showWateringNotification(message: string): Promise<void> {
  // Use Capacitor LocalNotifications if available (native app)
  if (Capacitor.isNativePlatform()) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "🌿 Dr. Cannabis - Recordatorio de Riego",
            body: message,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
    return;
  }
  
  // Fallback to browser notifications for web
  if (Notification.permission === "granted") {
    new Notification("🌿 Dr. Cannabis - Recordatorio de Riego", {
      body: message,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "watering-reminder"
    });
  }
}

export async function scheduleWateringReminder(date: Date, message: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return; // Scheduled notifications only work on native
  }
  
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "🌿 Dr. Cannabis - Recordatorio de Riego",
          body: message,
          id: 1, // Use fixed ID so it replaces previous reminder
          schedule: { at: date },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}
