# Módulo: Audit

**Ubicación:** `apps/api/src/audit`

El módulo de auditoría registra operaciones sensibles sobre datos médicos y clínicos para proporcionar trazabilidad forense al rol `ADMIN`. Los registros se generan automáticamente mediante un interceptor HTTP global; no requieren instrumentación manual en los controladores de negocio.

## Propósito

Permite al administrador del sistema:

- Auditar quién accedió a datos de pacientes y cuándo.
- Rastrear escrituras sobre citas, medicamentos e IA.
- Filtrar eventos por usuario, acción, recurso o rango de fechas.

## Endpoint

### Obtener logs de auditoría

- **Método:** `GET`
- **Ruta:** `/audit-logs`
- **Autorización:** `ADMIN` únicamente.
- **Respuesta exitosa:** `200 OK` — array de `AuditLog[]`, ordenados por `createdAt` descendente.

**Query parameters (todos opcionales):**

| Parámetro    | Tipo     | Descripción                                                           |
| ------------ | -------- | --------------------------------------------------------------------- |
| `userId`     | `string` | Filtra por el ID del usuario que realizó la acción                    |
| `action`     | `string` | Filtra por tipo de acción (`VIEW_MEDICAL_DATA`, `WRITE_MEDICAL_DATA`) |
| `resourceId` | `string` | Filtra por URL o ID del recurso afectado                              |
| `from`       | `Date`   | Inicio del rango temporal (ISO 8601)                                  |
| `to`         | `Date`   | Fin del rango temporal (ISO 8601)                                     |
| `limit`      | `number` | Máximo de resultados (1–200, default: 200)                            |

---

## Entidad: `AuditLog`

**Colección MongoDB:** colección por defecto de Mongoose. Solo almacena `createdAt` (no `updatedAt`, los logs son inmutables).

```typescript
class AuditLog extends Document {
  action: string; // 'VIEW_MEDICAL_DATA' | 'WRITE_MEDICAL_DATA'
  userId: string; // ID del usuario autenticado
  resourceId: string; // URL de la petición HTTP
  ipAddress: string; // IP del cliente
  details: string; // Información adicional (método, user-agent)
  createdAt: Date; // Automático — los logs son append-only
}
```

**Índice:** `{ createdAt: -1 }` — optimiza las consultas ordenadas por fecha descendente.

---

## Captura automática: `AuditLoggerInterceptor`

**Ubicación:** `apps/api/src/common/interceptors/audit-logger.interceptor.ts`

El interceptor se registra globalmente y captura dos categorías de eventos automáticamente:

### Acceso a datos de pacientes (GET)

Se registra un evento `VIEW_MEDICAL_DATA` cuando una petición `GET` autenticada accede a rutas que contienen:

- `/patient` — datos de perfil de paciente
- `/resultado/pacientes` — resultados médicos de un paciente (vista staff)
- `/get-pdf` — descarga de PDF de resultados

### Escrituras sobre recursos médicos (POST / PATCH / DELETE / PUT)

Se registra un evento `WRITE_MEDICAL_DATA` cuando una petición de escritura autenticada afecta a alguno de estos prefijos:

| Prefijo de ruta         | Recurso                   |
| ----------------------- | ------------------------- |
| `/appointment`          | Citas médicas             |
| `/medications`          | Medicamentos              |
| `/auth/set-access-code` | Código de acceso de admin |
| `/ai/chat-stream`       | Interacciones con IA      |

El interceptor captura el evento **después** de que la respuesta se envió con éxito (`tap` en el observable). Si el handler lanza un error, no se registra el evento.

---

## Política de retención

No hay política de retención automática implementada. Los documentos `AuditLog` se acumulan indefinidamente en MongoDB. Si se requiere un TTL, se puede agregar un índice `{ createdAt: 1, expireAfterSeconds: N }` a la colección sin cambiar código de aplicación.

---

## Diseño: interceptor vs. llamadas explícitas

El módulo ofrece también el método `AuditService.logAction()` para llamadas explícitas desde servicios de negocio. Actualmente no se usa fuera del interceptor, pero está disponible para escenarios donde el contexto HTTP no es suficiente (por ejemplo, eventos de background o cron jobs).

```typescript
await this.auditService.logAction(
  'CUSTOM_ACTION',
  userId,
  resourceId,
  ipAddress,
  'Detalles adicionales',
);
```

Los errores al guardar un log de auditoría se capturan internamente y se loguean con el logger de NestJS. Un fallo en auditoría nunca interrumpe la operación de negocio.
