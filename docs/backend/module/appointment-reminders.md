# Módulo: Appointment Reminders

**Ubicación:** `apps/api/src/appointment-reminders`

El módulo de recordatorios de citas envía automáticamente notificaciones push a los pacientes el día antes de cada cita agendada. No expone endpoints HTTP: es un módulo puramente basado en cron que corre de forma desatendida.

## Comportamiento

Cada día a las 09:00 (hora de Europa/Madrid), el servicio consulta la base de datos buscando citas que cumplan las tres condiciones siguientes:

1. `fecha` igual al día de mañana (calculada con `tomorrowInTz('Europe/Madrid')`).
2. `estado` igual a `AGENDADA`.
3. `reminderSentAt` es `null` o no existe en el documento.

Por cada cita encontrada, busca el token de push del paciente y envía una notificación. Si el paciente no tiene `expoPushToken` registrado, la cita se omite silenciosamente.

## Cron

```
@Cron('0 9 * * *', {
  timeZone: 'Europe/Madrid',
  name: 'appointment-reminders-madrid',
})
```

| Campo        | Valor                          |
| ------------ | ------------------------------ |
| Expresión    | `0 9 * * *`                    |
| Hora         | 09:00 todos los días           |
| Zona horaria | `Europe/Madrid`                |
| Nombre       | `appointment-reminders-madrid` |

> **Nota de contexto:** La zona horaria `Europe/Madrid` se usa porque el despliegue del capstone está orientado a usuarios en España. Si en el futuro se atienden otras zonas horarias, se puede añadir un cron adicional por zona siguiendo el mismo patrón.

## Campo `reminderSentAt` en la entidad `Appointment`

Después de enviar la notificación push con éxito, el servicio actualiza el documento de la cita:

```typescript
await this.citaModel.findByIdAndUpdate(cita._id, {
  $set: { reminderSentAt: new Date() },
});
```

Esto hace el proceso **idempotente**: aunque el cron se ejecute varias veces (o si hay un redeploy), las citas que ya recibieron recordatorio no vuelven a ser procesadas porque `reminderSentAt` ya no es `null`.

## Contenido de la notificación

```typescript
{
  tokens: [patient.expoPushToken],
  title: 'Recordatorio de cita',
  body:  'Tenés una cita mañana. ¡No la olvides!',
  data:  { type: 'reminder_24h', citaId: String(cita._id) }
}
```

El campo `data.citaId` permite a la app móvil navegar directamente a la pantalla de detalle de la cita cuando el usuario toca la notificación.

## Integración con PushNotificationsModule

El servicio inyecta `PushNotificationsService` y llama a `sendPushNotification()`. La gestión de tokens inválidos, chunking y errores de la API de Expo es responsabilidad de ese servicio. Ver [push-notifications.md](./push-notifications.md).

## Manejo de errores

Los errores por cita individual se capturan con un `try/catch` y se loguean con el logger de NestJS. Un fallo al enviar el recordatorio de una cita no interrumpe el procesamiento del resto de citas del lote.

```typescript
} catch (err) {
  this.logger.error(`Reminder failed for cita ${String(cita._id)}:`, err);
}
```

## Sin endpoint manual

No existe un endpoint HTTP para disparar los recordatorios manualmente. Si se necesita ejecutar el proceso fuera del horario programado en un entorno de desarrollo, se puede llamar directamente al método `sendMadridReminders()` desde un script o test de integración.
