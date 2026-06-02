import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

interface MedicationScheduleInput {
  name: string;
  startTime?: string;
  frequencyHours: number;
  durationDays?: number;
}

export async function scheduleNotifications(
  medication: MedicationScheduleInput,
): Promise<string[]> {
  const { name, startTime, frequencyHours } = medication;

  if (!startTime) return [];

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const dosesPerDay = Math.round(24 / frequencyHours);
  const ids: string[] = [];

  for (let dose = 0; dose < dosesPerDay; dose++) {
    const totalMinutes =
      startHour * 60 + startMinute + dose * frequencyHours * 60;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora del medicamento',
        body: `Es hora de tomar ${name}`,
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    ids.push(id);
  }

  return ids;
}

export async function cancelNotifications(
  notificationIds: string[],
): Promise<void> {
  for (const id of notificationIds) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}
