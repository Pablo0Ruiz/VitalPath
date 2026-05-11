import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { handleRegistrationError } from '../utils/handleErrorPush';
import { savePushToken } from '@repo/api-client';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface SendPushOptions {
  to: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

async function sendPushNotification({
  to,
  title,
  body,
  data,
}: SendPushOptions) {
  const message = {
    to: to,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS !== 'android') return undefined;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      handleRegistrationError(
        'Permission not granted to get push token for push notification!',
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log({ [Platform.OS]: pushTokenString });
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notifications, setNotifications] = useState<
    Notifications.Notification[]
  >([]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        setExpoPushToken(token ?? '');
        if (token) {
          savePushToken(token).catch(err =>
            console.warn('[usePushNotifications] token save failed:', err),
          );
        }
      })
      .catch((error: unknown) => setExpoPushToken(`${error}`));
  }, []);

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        setNotifications(previousNotifications => [
          notification,
          ...previousNotifications,
        ]);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data as
          | Record<string, unknown>
          | undefined;
        if (data?.type === 'cita_state_change') {
          const estudioId = data.estudioId as string | undefined;
          router.push(estudioId ? `/records/${estudioId}` : '/records');
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    expoPushToken,
    notifications,
    sendPushNotification,
  };
};
