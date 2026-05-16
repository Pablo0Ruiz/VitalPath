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

type CitaEstado =
  | 'asistida'
  | 'en_proceso'
  | 'cancelada'
  | 'pendiente'
  | 'programada';
```

---

## Semántica de estados

| Estado       | Color            | Descripción                   |
| ------------ | ---------------- | ----------------------------- |
| `programada` | Azul             | Cita confirmada, fecha futura |
| `en_proceso` | Amarillo/naranja | Cita en curso en este momento |
| `asistida`   | Verde            | Cita completada               |
| `cancelada`  | Rojo             | Cita cancelada                |
| `pendiente`  | Gris             | Cita por confirmar            |

---

## Llamadas a la API

### Obtener citas del paciente

```
GET /citas?paciente_id={user._id}
Headers: Authorization: Bearer {accessToken}

Response 200: Cita[]
```

El componente filtra y ordena los resultados localmente para las diferentes vistas (próximas, historial).

---

## Flujo típico del usuario

```
1. Usuario abre la tab Citas
2. useCitas() carga todas las citas del usuario
3. Por defecto se muestra la tab "Próximas"
   → Se filtran citas con fecha >= hoy, estado != 'cancelada'
   → Se ordenan por fecha ascendente
4. Usuario toca la tab "Historial"
   → Se muestran citas pasadas (asistidas, canceladas)
5. Usuario navega en el CalendarWidget
   → Las citas del día seleccionado se resaltan
6. Usuario toca una cita → AppointmentCard se expande
   → Muestra fecha, hora, médico, estado
   → Si tiene resultado médico (estado: 'asistida'): enlace a Records
```

---

## Datos del usuario que se usan

| Dato           | Uso                                          |
| -------------- | -------------------------------------------- |
| `user._id`     | Parámetro `paciente_id` en la query de citas |
| `token.access` | Autenticar petición                          |
