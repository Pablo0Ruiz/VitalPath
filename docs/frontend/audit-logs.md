# Módulo de Auditoría (`audit-logs`)

## Propósito

Mostrar el registro de auditoría de operaciones sensibles realizadas en el sistema. Permite al administrador rastrear qué acciones se ejecutaron, quién las realizó y sobre qué recurso.

## Rutas / Páginas Principales

- **`/audit-logs`**: Tabla de eventos de auditoría con filtros por acción y usuario. Accesible únicamente para el rol `ADMIN`.

## Control de Acceso

- **Roles permitidos:** `admin` únicamente.
- Si un usuario con otro rol intenta acceder, es redirigido automáticamente a `/dashboard`.

## Componentes Clave

- **DataTable:** Tabla con las columnas: Fecha, Acción, Usuario (ID), Recurso (ID).
- **Filtros de texto:** Dos inputs independientes para filtrar por `action` (ej. `VIEW_MEDICAL_DATA`) y `userId`.
- **Botón "Filtrar":** Aplica los filtros activos.
- **Botón "Limpiar":** Resetea los filtros y vuelve a cargar todos los registros.
- **EmptyState:** Se muestra cuando no hay registros que coincidan con los filtros.
- **Skeleton:** Estado de carga mientras se obtienen los datos.

## Columnas de la Tabla

| Columna | Campo fuente | Descripción                                           |
| ------- | ------------ | ----------------------------------------------------- |
| Fecha   | `createdAt`  | Fecha y hora formateada con `toLocaleString('es-AR')` |
| Acción  | `action`     | Nombre del evento auditado (ej. `VIEW_MEDICAL_DATA`)  |
| Usuario | `userId`     | ID del usuario que realizó la acción                  |
| Recurso | `resourceId` | ID del recurso afectado, renderizado en `<code>`      |

## Llamadas a la API

- **Hook:** `useAuditLogs(filters: AuditLogQuery)` del paquete `@repo/api-client`.
- **Endpoint:** `GET /api/audit-logs` con los query params del tipo `AuditLogQuery`.

```typescript
interface AuditLogQuery {
  userId?: string;
  action?: string;
  resourceId?: string;
  from?: string;
  to?: string;
  limit?: number;
}
```

## Capacidades de Filtrado

| Filtro      | Implementado | Descripción                                                       |
| ----------- | ------------ | ----------------------------------------------------------------- |
| Por acción  | Sí           | Filtra por el campo `action` exacto o parcial                     |
| Por usuario | Sí           | Filtra por `userId`                                               |
| Por recurso | No (en UI)   | Disponible en `AuditLogQuery`, no expuesto                        |
| Por fecha   | No (en UI)   | `from`/`to` disponibles en la query, no expuestos en la UI actual |

## Paginación

No implementada actualmente en la UI. El endpoint acepta el parámetro `limit` en la query, pero la página no expone control de paginación.

## Flujo Típico

1. El administrador ingresa a `/audit-logs`.
2. Se cargan todos los registros mediante `GET /api/audit-logs` (sin filtros).
3. El administrador ingresa una acción específica (ej. `VIEW_MEDICAL_DATA`) en el input de "Acción" y presiona "Filtrar".
4. React Query re-ejecuta la query con el parámetro `action` y la tabla se actualiza.
5. Para volver a ver todos los registros, presiona "Limpiar".
