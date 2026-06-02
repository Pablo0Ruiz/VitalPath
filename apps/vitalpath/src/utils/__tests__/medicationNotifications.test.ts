import {
  scheduleNotifications,
  cancelNotifications,
} from '../medicationNotifications';

// ── Mock expo-notifications ───────────────────────────────────────────────────
const mockScheduleNotificationAsync = jest.fn();
const mockCancelScheduledNotificationAsync = jest.fn();

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: (...args: unknown[]) =>
    mockScheduleNotificationAsync(...args),
  cancelScheduledNotificationAsync: (...args: unknown[]) =>
    mockCancelScheduledNotificationAsync(...args),
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
    DATE: 'date',
    TIME_INTERVAL: 'timeInterval',
    CALENDAR: 'calendar',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId(n: number) {
  return `notif-id-${n}`;
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ── scheduleNotifications ─────────────────────────────────────────────────────

describe('scheduleNotifications', () => {
  it('returns an empty array when startTime is null/undefined', async () => {
    const result = await scheduleNotifications({
      name: 'Ibuprofeno',
      startTime: undefined,
      frequencyHours: 8,
      durationDays: 5,
    });

    expect(result).toEqual([]);
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('schedules dosesPerDay DAILY repeating notifications for frequencyHours=12 (2 doses/day)', async () => {
    // New design: always schedules 24/frequencyHours daily-repeating slots.
    // durationDays is ignored — course completion is managed server-side.
    // 24/12 = 2 doses/day → 2 notifications
    let callCount = 0;
    mockScheduleNotificationAsync.mockImplementation(() => {
      callCount++;
      return Promise.resolve(makeId(callCount));
    });

    const result = await scheduleNotifications({
      name: 'Paracetamol',
      startTime: '09:00',
      frequencyHours: 12,
      durationDays: 3,
    });

    expect(result).toHaveLength(2);
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(2);
    result.forEach(id => expect(typeof id).toBe('string'));
  });

  it('schedules dosesPerDay DAILY repeating notifications for frequencyHours=8 (3 doses/day)', async () => {
    // 24/8 = 3 doses/day → 3 notifications
    let callCount = 0;
    mockScheduleNotificationAsync.mockImplementation(() => {
      callCount++;
      return Promise.resolve(makeId(callCount));
    });

    const result = await scheduleNotifications({
      name: 'Amoxicilina',
      startTime: '08:00',
      frequencyHours: 8,
      durationDays: 5,
    });

    expect(result).toHaveLength(3);
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(3);
  });

  it('schedules dosesPerDay notifications when durationDays is undefined (indefinite)', async () => {
    // Indefinite: same daily-repeating pattern — 24/6 = 4 doses/day → 4 notifications
    let callCount = 0;
    mockScheduleNotificationAsync.mockImplementation(() => {
      callCount++;
      return Promise.resolve(makeId(callCount));
    });

    const result = await scheduleNotifications({
      name: 'Vitamina C',
      startTime: '07:00',
      frequencyHours: 6,
      durationDays: undefined,
    });

    expect(result).toHaveLength(4);
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(4);
  });
});

// ── cancelNotifications ───────────────────────────────────────────────────────

describe('cancelNotifications', () => {
  it('calls cancelScheduledNotificationAsync for each ID in the array', async () => {
    mockCancelScheduledNotificationAsync.mockResolvedValue(undefined);
    const ids = ['id-1', 'id-2', 'id-3'];

    await cancelNotifications(ids);

    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledTimes(3);
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('id-1');
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('id-2');
    expect(mockCancelScheduledNotificationAsync).toHaveBeenCalledWith('id-3');
  });

  it('is a no-op when the array is empty', async () => {
    await cancelNotifications([]);

    expect(mockCancelScheduledNotificationAsync).not.toHaveBeenCalled();
  });
});
