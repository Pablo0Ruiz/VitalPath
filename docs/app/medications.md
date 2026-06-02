# Medicamentos (Medications) — App Móvil VitalPath

---

## Propósito

CRUD completo de medicamentos del paciente. Permite registrar, editar y eliminar medicamentos, con información de dosis y frecuencia. La pantalla principal del Dashboard también consume este módulo para el seguimiento diario, incluyendo el registro persistente de dosis tomadas.

---

## Ruta

`/(drawer)/(tabs)/medications`

> Esta ruta existe en el sistema de archivos pero está **oculta del tab bar** (`href: null`). Se accede a ella desde el Dashboard o mediante navegación programática.

---

## Componentes principales

| Componente          | Tipo     | Responsabilidad                                                       |
| ------------------- | -------- | --------------------------------------------------------------------- |
| `MedicationRow`     | molecule | Fila de un medicamento con nombre, descripción, frecuencia y acciones |
| `CustomModal`       | molecule | Modal para agregar nuevo medicamento                                  |
| `CustomUpdateModal` | molecule | Modal para editar medicamento existente                               |
| `CustomList`        | molecule | Lista genérica usada también en el Dashboard                          |
| `IconBox`           | atom     | Icono de pastilla/cápsula                                             |
| `Badge`             | atom     | Indicador de frecuencia                                               |
| `EmptyState`        | atom     | Estado vacío cuando no hay medicamentos                               |

---

## Estructura de datos

```typescript
interface Medication {
  _id: string;
  name: string;
  description: string;
  frequencyHours: 4 | 6 | 8 | 12 | 24; // intervalo entre dosis en horas
  durationDays?: number; // null = tratamiento indefinido
  dosesTaken: number; // se incrementa en el servidor con cada PATCH /take
  notificationIds: string[]; // IDs de notificaciones Expo (para cancelarlas)
  startTime?: string; // hora de inicio en formato HH:MM
  patient: string; // referencia al Patient
}
```

---

## Llamadas a la API

### Obtener medicamentos propios (PACIENTE)

```
GET /medications
Headers: Authorization: Bearer {accessToken}

Response 200: Medication[]
```

El backend filtra automáticamente por el usuario autenticado (extraído del JWT).

### Obtener medicamentos de un paciente (MEDICO / TRABAJADOR_CENTRO)

```
GET /medications/patient/:id
Headers: Authorization: Bearer {accessToken}

Response 200: Medication[]
```

### Crear medicamento (MEDICO / TRABAJADOR_CENTRO)

```
POST /medications
Headers: Authorization: Bearer {accessToken}
Body: {
  name: string,
  description: string,
  frequencyHours: 4 | 6 | 8 | 12 | 24,
  durationDays?: number,
  startTime?: string
}

Response 201: Medication
```

### Actualizar medicamento (MEDICO / TRABAJADOR_CENTRO)

```
PATCH /medications/:id
Headers: Authorization: Bearer {accessToken}
Body: {
  name?: string,
  description?: string,
  frequencyHours?: 4 | 6 | 8 | 12 | 24,
  durationDays?: number,
  startTime?: string
}

Response 200: Medication actualizado
```

### Marcar dosis tomada (PACIENTE)

```
PATCH /medications/:id/take
Headers: Authorization: Bearer {accessToken}

Response 200: Medication actualizado
```

**Comportamiento según `durationDays`:**

- Si `durationDays` es `null` (tratamiento indefinido): el medicamento se elimina permanentemente.
- Si `durationDays` tiene valor: `dosesTaken` se incrementa en el servidor. Cuando se completan todas las dosis del tratamiento, el medicamento se elimina automáticamente.

Las dosis tomadas se persisten en el servidor — **no son solo visuales y no se pierden al cerrar la app**.

### Eliminar medicamento (MEDICO / TRABAJADOR_CENTRO)

```
DELETE /medications/:id
Headers: Authorization: Bearer {accessToken}

Response 200: OK
```

El hook `useDeleteMedication` invalida el caché `['medications']` de React Query tras una eliminación exitosa, lo que dispara un refetch automático.

---

## Flujo típico del usuario

```
Desde el Dashboard (PACIENTE):
1. Usuario ve la lista de medicamentos del día
2. Toca el botón "+" → se abre CustomModal (agregar) — solo si tiene rol MEDICO/TRABAJADOR_CENTRO
3. Toca el checkbox de un medicamento → useTakeMedication()
   → PATCH /medications/:id/take
   → dosesTaken se incrementa en el servidor (persiste entre sesiones)
   → Si se completaron todas las dosis → medicamento desaparece de la lista

Desde la pantalla de Medicamentos:
1. Vista completa de todos los medicamentos registrados
2. Acciones de crear/editar/eliminar disponibles según el rol
3. Cada medicamento muestra nombre, descripción e indicador de frecuencia (cada N horas)
```

---

## Datos del usuario que se usan

| Dato           | Uso                                                                              |
| -------------- | -------------------------------------------------------------------------------- |
| `token.access` | Autenticar todas las peticiones; el backend extrae el `patient` del JWT          |
| `user.role`    | Determina qué endpoints están disponibles (PACIENTE vs MEDICO/TRABAJADOR_CENTRO) |
