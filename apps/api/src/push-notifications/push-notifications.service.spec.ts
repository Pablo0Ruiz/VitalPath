import { Test, TestingModule } from '@nestjs/testing';
import {
  PushNotificationsService,
  SendPushPayload,
} from './push-notifications.service';
import { Expo } from 'expo-server-sdk';

// ─── Mock expo-server-sdk ────────────────────────────────────────────────────
// jest.mock is hoisted before variable declarations, so we cannot assign
// module-level variables inside the factory. Instead we store the mock
// instance on the Expo constructor mock itself for later retrieval.

jest.mock('expo-server-sdk', () => {
  const mockExpoInstance = {
    chunkPushNotifications: jest.fn().mockReturnValue([[]]),
    sendPushNotificationsAsync: jest.fn().mockResolvedValue([]),
  };

  const MockExpo = jest.fn().mockImplementation(() => mockExpoInstance);
  // Attach static method and the shared instance for access in tests
  return {
    Expo: Object.assign(MockExpo, {
      isExpoPushToken: jest.fn().mockReturnValue(true),
      __instance: mockExpoInstance,
    }),
  };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VALID_TOKEN = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';
const INVALID_TOKEN = 'not-a-valid-expo-token';

const makePayload = (
  overrides?: Partial<SendPushPayload>,
): SendPushPayload => ({
  tokens: [VALID_TOKEN],
  title: 'Test title',
  body: 'Test body',
  ...overrides,
});

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('PushNotificationsService', () => {
  let service: PushNotificationsService;
  let expoInstance: {
    chunkPushNotifications: jest.Mock;
    sendPushNotificationsAsync: jest.Mock;
  };
  let isExpoPushToken: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Restore sensible defaults after clearAllMocks
    expoInstance = (Expo as unknown as { __instance: typeof expoInstance })
      .__instance;
    expoInstance.chunkPushNotifications.mockReturnValue([[]]);
    expoInstance.sendPushNotificationsAsync.mockResolvedValue([]);

    isExpoPushToken = Expo.isExpoPushToken as unknown as jest.Mock;
    isExpoPushToken.mockReturnValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [PushNotificationsService],
    }).compile();

    service = module.get<PushNotificationsService>(PushNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── 1. Filters invalid tokens ────────────────────────────────────────────

  it('filters invalid tokens and skips them, only sends valid ones', async () => {
    isExpoPushToken.mockImplementation((t: string) => t === VALID_TOKEN);
    expoInstance.chunkPushNotifications.mockReturnValue([
      [{ to: VALID_TOKEN }],
    ]);

    await service.sendPushNotification(
      makePayload({ tokens: [VALID_TOKEN, INVALID_TOKEN] }),
    );

    const [messages] = expoInstance.chunkPushNotifications.mock.calls[0];
    expect(messages).toHaveLength(1);
    expect(messages[0].to).toBe(VALID_TOKEN);
    expect(expoInstance.sendPushNotificationsAsync).toHaveBeenCalled();
  });

  // ─── 2. Returns early when all tokens invalid ─────────────────────────────

  it('returns early without chunking or sending when all tokens are invalid', async () => {
    isExpoPushToken.mockReturnValue(false);

    await service.sendPushNotification(
      makePayload({ tokens: [INVALID_TOKEN] }),
    );

    expect(expoInstance.chunkPushNotifications).not.toHaveBeenCalled();
    expect(expoInstance.sendPushNotificationsAsync).not.toHaveBeenCalled();
  });

  // ─── 3. Sends correctly-shaped messages for valid tokens ─────────────────

  it('sends correctly-shaped ExpoPushMessages for valid tokens', async () => {
    isExpoPushToken.mockReturnValue(true);
    expoInstance.chunkPushNotifications.mockReturnValue([
      [{ to: VALID_TOKEN }],
    ]);

    const payload = makePayload({ title: 'My title', body: 'My body' });
    await service.sendPushNotification(payload);

    const [messages] = expoInstance.chunkPushNotifications.mock.calls[0];
    expect(messages[0]).toMatchObject({
      to: VALID_TOKEN,
      sound: 'default',
      title: 'My title',
      body: 'My body',
    });
  });

  // ─── 4. Swallows chunk errors ─────────────────────────────────────────────

  it('swallows chunk send errors and does not rethrow', async () => {
    isExpoPushToken.mockReturnValue(true);
    expoInstance.chunkPushNotifications.mockReturnValue([
      [{ to: VALID_TOKEN }],
    ]);
    expoInstance.sendPushNotificationsAsync.mockRejectedValue(
      new Error('Expo network failure'),
    );

    await expect(
      service.sendPushNotification(makePayload()),
    ).resolves.toBeUndefined();
    expect(expoInstance.sendPushNotificationsAsync).toHaveBeenCalled();
  });

  // ─── 5. Passes `data` payload through ────────────────────────────────────

  it('passes the data payload through to ExpoPushMessage', async () => {
    isExpoPushToken.mockReturnValue(true);
    expoInstance.chunkPushNotifications.mockReturnValue([
      [{ to: VALID_TOKEN }],
    ]);

    const data = { type: 'cita_state_change', citaId: 'abc123' };
    await service.sendPushNotification(makePayload({ data }));

    const [messages] = expoInstance.chunkPushNotifications.mock.calls[0];
    expect(messages[0].data).toEqual(data);
  });
});
