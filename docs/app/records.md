# Resultados Médicos (Records) — App Móvil VitalPath

---

## Propósito

Pantalla que consolida el historial médico del paciente: resultados de estudios procesados por el médico y citas en progreso. Permite al usuario acceder al PDF adjunto de cada resultado.

---

## Rutas

| Pantalla              | Ruta                            |
| --------------------- | ------------------------------- |
| Listado de resultados | `/(drawer)/(tabs)/records`      |
| Detalle de resultado  | `/(drawer)/(tabs)/records/[id]` |

---

## Componentes principales

| Componente         | Tipo     | Responsabilidad                                            |
| ------------------ | -------- | ---------------------------------------------------------- |
| `TrackingTimeline` | organism | Timeline visual de los estudios ordenados cronológicamente |
| `TimelineCard`     | molecule | Tarjeta de un resultado en la timeline                     |
| `TimelineStep`     | molecule | Paso visual (icono + línea conectora) en la timeline       |
| `TimelineIcon`     | atom     | Icono de estado (completado, en proceso, pendiente)        |
| `EmptyState`       | atom     | Placeholder cuando no hay resultados                       |
| `LoadingScreen`    | atom     | Estado de carga mientras llegan los datos                  |
| `ScreenHeader`     | atom     | Encabezado de la pantalla con título                       |

---

## Llamadas a la API

### Obtener resultados médicos del paciente

```
GET /medical-results?paciente_id={user._id}
Headers: Authorization: Bearer {accessToken}

Response 200: IMedicalResults[]
```

Estructura de cada resultado:

```typescript
interface IMedicalResults {
  _id: string;
  cita_ID: {
    _id: string;
    fecha: string; // YYYY-MM-DD
    hora: string;
    estado: 'asistida' | 'en_proceso' | 'cancelada' | 'pendiente';
  };
  medico_ID: string;
  paciente_ID: string;
  fileUrl: string; // URL al PDF del resultado
  createdAt: string;
  updatedAt: string;
}
```

### Obtener citas (para mostrarlas en proceso)

```
GET /citas?paciente_id={user._id}
Headers: Authorization: Bearer {accessToken}

Response 200: Cita[]
```

La pantalla combina los resultados médicos completos con las citas cuyo estado sea `'en_proceso'`, mostrando estas últimas como estudios pendientes en la timeline.

---

## Flujo típico del usuario

```
1. Usuario abre la tab Records
2. React Query ejecuta useMedicalResultsPaciente() y useCitas() en paralelo
3. Mientras cargan: LoadingScreen
4. Al llegar los datos:
   → Se combinan resultados y citas en_proceso
   → Se ordenan por fecha descendente
   → Se renderizan en TrackingTimeline
5. Usuario toca un resultado en la timeline
   → router.push('/(drawer)/(tabs)/records/' + resultado._id)
6. Pantalla de detalle [id]:
   → usePdfData(resultado.fileUrl) descarga/prepara el PDF
   → Muestra el PDF inline o botón para abrir en visor externo
```

---

## Notificaciones push y deep linking

Cuando el médico sube un nuevo resultado, el backend envía una notificación push al dispositivo del paciente. Al tocar la notificación:

```
Notificación push recibida
  → payload: { type: 'new_result', resultId: string }
  → expo-notifications onNotificationResponse
    → router.push('/(drawer)/(tabs)/records/' + resultId)
```

El deep link lleva directamente a la pantalla de detalle sin pasar por el listado.

---

## Datos del usuario que se usan

| Dato          | Uso                                      |
| ------------- | ---------------------------------------- |
| `user._id`    | Parámetro `paciente_id` en ambas queries |
| `accessToken` | Autenticar peticiones                    |
