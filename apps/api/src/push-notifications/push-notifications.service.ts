import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

export interface SendPushPayload {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class PushNotificationsService {
  private readonly expo = new Expo();
  private readonly logger = new Logger(PushNotificationsService.name);

  async sendPushNotification(payload: SendPushPayload): Promise<void> {
    const validTokens = payload.tokens.filter(t => {
      const valid = Expo.isExpoPushToken(t);
      if (!valid) this.logger.warn(`Invalid Expo push token: ${t}`);
      return valid;
    });

    if (validTokens.length === 0) return;

    const messages: ExpoPushMessage[] = validTokens.map(token => ({
      to: token,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data,
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        this.logger.error('Error sending push notification chunk:', error);
      }
    }
  }
}
