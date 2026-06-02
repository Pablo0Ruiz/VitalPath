# Módulo: Push Notifications

**Ubicación:** `apps/api/src/push-notifications`

Módulo de servicio puro que encapsula la integración con la API de notificaciones push de Expo. No expone endpoints HTTP: otros módulos lo importan e inyectan `PushNotificationsService` para enviar notificaciones.

## Responsabilidades

- Validar que los tokens sean tokens Expo válidos antes de intentar el envío.
- Dividir los mensajes en chunks según las recomendaciones de la SDK de Expo.
- Abstraer los errores de red en logs, sin propagar excepciones al módulo llamador.

## Token de push: `expoPushToken`

El token de push se almacena en el campo `expoPushToken` del documento `User` en MongoDB. La app móvil lo registra al hacer login o al completar el registro, a través de la integración con `expo-notifications`.

El campo se marca con `select: false` en el schema de Mongoose, por lo que debe seleccionarse explícitamente en las queries que lo necesiten:

```typescript
const patient = await this.userModel
  .findById(cita.paciente_ID)
  .select('+expoPushToken');
```

## Método principal: `sendPushNotification`

```typescript
interface SendPushPayload {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

async sendPushNotification(payload: SendPushPayload): Promise<void>
```

**Proceso interno:**

1. Filtra `tokens` con `Expo.isExpoPushToken(t)`. Los tokens inválidos se loguean con `warn` y se descartan. Si no quedan tokens válidos, el método retorna sin hacer nada.
2. Construye mensajes `ExpoPushMessage[]` con `sound: 'default'`.
3. Divide en chunks con `expo.chunkPushNotifications(messages)` para respetar los límites de la API de Expo.
4. Envía cada chunk con `expo.sendPushNotificationsAsync(chunk)`. Los errores de un chunk se loguean con `error` pero no interrumpen los chunks siguientes.

## Módulos que usan PushNotificationsService

| Módulo                       | Cuándo envía                                                          |
| ---------------------------- | --------------------------------------------------------------------- |
| `AppointmentRemindersModule` | Diariamente a las 09:00 para citas del día siguiente (`AGENDADA`)     |
| `VinculacionService`         | Obtiene tokens de cuidadores vinculados para notificaciones de estado |

> El módulo `SupabaseModule` también interactúa con notificaciones vía `GroqService`, pero de forma indirecta a través del resumen de resultados.

## Bajo el capó: Expo Push API

La SDK `expo-server-sdk` (`new Expo()`) gestiona la comunicación con el endpoint de Expo:

```
POST https://exp.host/--/api/v2/push/send
```

No es necesario configurar credenciales adicionales para notificaciones sin prioridad. Para notificaciones de alta prioridad en producción, se puede configurar `EXPO_ACCESS_TOKEN` en el entorno.

## Manejo de tokens inválidos o expirados

Si un token es inválido (formato incorrecto), `Expo.isExpoPushToken()` lo detecta antes del envío y lo descarta con un log de advertencia:

```
WARN  [PushNotificationsService] Invalid Expo push token: ExponentPushToken[...]
```

Si un token era válido pero el dispositivo fue desregistrado (token expirado en los servidores de Expo), el error llega como respuesta de la API dentro de `sendPushNotificationsAsync`. El servicio actualmente loguea el error pero no elimina automáticamente el token de la base de datos. Esta limpieza puede implementarse procesando los `PushTicket` de respuesta en una iteración futura.
