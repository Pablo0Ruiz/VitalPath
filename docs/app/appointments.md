# Citas Médicas (Appointments) — App Móvil VitalPath

---

## Propósito

Pantalla de gestión de la agenda médica del paciente. Muestra todas las citas con su estado, fecha y hora, y permite filtrarlas para tener una visión clara de la actividad médica próxima y pasada.

---

## Ruta

`/(drawer)/(tabs)/appointments`

---

## Componentes principales

| Componente          | Tipo     | Responsabilidad                                          |
| ------------------- | -------- | -------------------------------------------------------- |
| `CalendarWidget`    | organism | Vista de calendario interactivo para navegar por fechas  |
| `AppointmentCard`   | molecule | Tarjeta expandida de una cita con todos los detalles     |
| `AppointmentRow`    | molecule | Fila compacta de cita para vistas de listado             |
| `AppointmentStatus` | molecule | Chip/badge de estado con color semántico                 |
| `TimeSlotChip`      | atom     | Chip visual del horario de la cita                       |
| `DoctorCard`        | molecule | Información del médico asignado a la cita                |
| `EmptyState`        | atom     | Placeholder cuando no hay citas en el rango seleccionado |
| `Tabs`              | atom     | Filtros por estado (Próximas / Historial)                |

---

## Estructura de datos

```typescript
interface Cita {
  _id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  estado: CitaEstado;
  medico_ID: string;
  paciente_ID: string;
  createdAt: string;
  updatedAt: string;
}

enum CitaEstado {
  AGENDADA = 'agendada',
  ASISTIDA = 'asistida',
  EN_PROCESO = 'en_proceso',
  RESULTADOS_LISTOS = 'resultados_listos',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}
```

---

## Semántica de estados

| Estado              | Color            | Descripción                                                          |
| ------------------- | ---------------- | -------------------------------------------------------------------- |
| `agendada`          | Azul             | Cita confirmada y pendiente de realizarse                            |
| `en_proceso`        | Amarillo/naranja | Cita en curso en este momento                                        |
| `asistida`          | Verde claro      | Paciente asistió; aún no hay resultados cargados                     |
| `resultados_listos` | Verde            | Estudios cargados; el paciente puede revisarlos                      |
| `completada`        | Verde oscuro     | Ciclo completo: cita realizada, resultados revisados por el paciente |
| `cancelada`         | Rojo             | Cita cancelada                                                       |

---

## Llamadas a la API

### Obtener citas del paciente

```
GET /appointment
Headers: Authorization: Bearer {accessToken}

Response 200: Cita[]
```

El componente filtra y ordena los resultados localmente para las diferentes vistas (próximas, historial).

### Obtener citas del cuidador (CUIDADOR_FAMILIAR)

```
GET /appointment/cuidador
GET /appointment/cuidador?pacienteId={id}   ← filtro opcional por paciente
Headers: Authorization: Bearer {accessToken}

Response 200: Cita[]
```

Devuelve las citas de todos los pacientes vinculados al cuidador. Con el parámetro `pacienteId` se filtra por un paciente específico.

### Crear cita (MEDICO)

```
POST /appointment
Headers: Authorization: Bearer {accessToken}
Body: { paciente_ID, medico_ID, fecha, hora }

Response 201: Cita
```

### Crear cita — sin restricción de ownership (TRABAJADOR_CENTRO / ADMIN)

```
POST /appointment/worker
Headers: Authorization: Bearer {accessToken}
Body: { paciente_ID, medico_ID, fecha, hora }

Response 201: Cita
```

El worker puede crear citas para cualquier paciente, sin restricción de ownership.

### Actualizar cita (MEDICO)

```
PATCH /appointment/:id
Headers: Authorization: Bearer {accessToken}
Body: { estado?, fecha?, hora? }

Response 200: Cita actualizada
```

### Actualizar cita — sin restricción de ownership (TRABAJADOR_CENTRO / ADMIN)

```
PATCH /appointment/:id/worker
Headers: Authorization: Bearer {accessToken}
Body: { estado?, fecha?, hora? }

Response 200: Cita actualizada
```

### Eliminar cita (TRABAJADOR_CENTRO / ADMIN)

```
DELETE /appointment/:id/worker
Headers: Authorization: Bearer {accessToken}

Response 204: No Content
```

Eliminación definitiva (hard delete). Solo disponible para workers/admins; no hay restricción de ownership.

---

## Flujo típico del usuario

```
1. Usuario abre la tab Citas
2. useCitas() carga todas las citas del usuario
3. Por defecto se muestra la tab "Próximas"
   → Se filtran citas con estado === 'agendada'
   → Se ordenan por fecha ascendente
4. Usuario toca la tab "Historial"
   → Se muestran citas pasadas (asistidas, completadas, canceladas, resultados_listos)
5. Usuario navega en el CalendarWidget
   → Las citas del día seleccionado se resaltan
6. Usuario toca una cita → AppointmentCard se expande
   → Muestra fecha, hora, médico, estado
   → Si estado === 'resultados_listos' o 'completada': enlace a Records
```

---

## Datos del usuario que se usan

| Dato           | Uso                                                |
| -------------- | -------------------------------------------------- |
| `user._id`     | Contexto para el fetch de citas                    |
| `token.access` | Autenticar petición                                |
| `user.role`    | Determina qué endpoints y vistas están disponibles |
