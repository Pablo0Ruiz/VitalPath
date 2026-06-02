# Dashboard (Home) — App Móvil VitalPath

---

## Propósito

Pantalla principal de la app después del login. Ofrece una vista consolidada del estado de salud del día: próximas citas, medicamentos pendientes y check-in de ánimo. Es el punto de entrada a todas las funcionalidades principales.

---

## Ruta

`/(drawer)/(tabs)/home`

---

## Componentes principales

| Componente                   | Tipo     | Responsabilidad                                                 |
| ---------------------------- | -------- | --------------------------------------------------------------- |
| `HeaderHome`                 | atom     | Saludo personalizado con nombre del usuario y foto de perfil    |
| `DailyCheckIn`               | molecule | Registro de estado de ánimo del día (mood tracking)             |
| `Banner` (HealthScoreBanner) | molecule | Indicador visual del puntaje de salud                           |
| `CustomList` (citas)         | molecule | Listado de las próximas 3 citas del usuario                     |
| `CustomList` (medicamentos)  | molecule | Medicamentos del día con checkbox de tomado/no tomado           |
| `CustomModal`                | molecule | Modal para agregar nuevo medicamento                            |
| `CustomUpdateModal`          | molecule | Modal para editar medicamento existente                         |
| `VoiceAssistantModal`        | organism | FAB + modal de asistente de voz (solo en Senior UI)             |
| `SectionHeader`              | molecule | Encabezados de sección con título y acción opcional             |
| `EmptyPacienteActivoState`   | molecule | Pantalla de selección de paciente activo (solo en rol CUIDADOR) |

---

## Estado local y global que usa

| Estado           | Origen                         | Descripción                                                                     |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `user`           | Zustand `useAuthStore`         | Nombre y foto para el saludo                                                    |
| `citas`          | React Query `useCitas()`       | Lista de citas del usuario                                                      |
| `medicamentos`   | React Query `useMedicaments()` | Lista de medicamentos del usuario                                               |
| `activePaciente` | Zustand `activePaciente` store | Paciente actualmente seleccionado (solo relevante cuando `isCuidador === true`) |
| `isSeniorUI`     | Zustand `useSeniorUIStore`     | Controla si se muestra el FAB de voz y ajusta tamaños                           |
| `createModal`    | Hook `useDisclosure()`         | Controla visibilidad del modal de creación                                      |
| `editModal`      | Hook `useDisclosure()`         | Controla visibilidad del modal de edición                                       |
| `voiceModal`     | Hook `useDisclosure()`         | Controla visibilidad del modal de voz                                           |

---

## Llamadas a la API

### Obtener citas

```
GET /appointment
Headers: Authorization: Bearer {accessToken}

Response 200: Cita[]
Response 401: Token inválido (interceptor ejecuta refresh)
```

### Obtener medicamentos

```
GET /medications
Headers: Authorization: Bearer {accessToken}

Response 200: Medication[]
```

### Marcar dosis tomada

```
PATCH /medications/:id/take
Headers: Authorization: Bearer {accessToken}

Response 200: Medication actualizado
```

El hook `useTakeMedication` llama a este endpoint. Las dosis se persisten permanentemente en el servidor — no se reinician al cerrar la app.

### Crear medicamento (desde modal)

```
POST /medications
Headers: Authorization: Bearer {accessToken}
Body: {
  name: string,
  description: string,
  frequencyHours: 4 | 6 | 8 | 12 | 24
}

Response 201: Medication creado
```

### Eliminar medicamento

```
DELETE /medications/:id
Headers: Authorization: Bearer {accessToken}

Response 200: OK
```

El hook `useDeleteMedication` invalida automáticamente el caché de `useMedicaments()` tras la eliminación para refrescar la lista.

---

## Flujo típico del usuario

```
1. Usuario abre la app → AuthInitializer valida sesión
2. Si sesión válida → redirige a /(drawer)/(tabs)/home
3. Si el usuario tiene rol CUIDADOR_FAMILIAR y no tiene un paciente activo seleccionado:
   → Se muestra EmptyPacienteActivoState en lugar del dashboard completo
   → El cuidador debe seleccionar un paciente para continuar
4. HeaderHome muestra "Buenos días, {user.name}" + foto de perfil
5. DailyCheckIn muestra los 5 estados de ánimo → usuario selecciona uno
   → POST /mood/check-in { mood, fecha }
6. Lista de citas: muestra las próximas 3 con estado === 'agendada', ordenadas por fecha
7. Lista de medicamentos: muestra los del día
   → Usuario toca checkbox → useTakeMedication() → PATCH /medications/:id/take
   → Las dosis quedan registradas en el servidor (persisten entre sesiones)
8. Usuario abre el drawer (ícono top-right) para acceder a perfil o settings
9. En modo Senior UI: aparece FAB de micrófono en bottom-right
   → Usuario toca FAB → abre VoiceAssistantModal
   → Puede dictar pregunta → asistente responde en voz
```

---

## Filtro de citas en el Dashboard

La lista de citas próximas muestra únicamente las que tienen `estado === 'agendada'`. Otros estados (`asistida`, `en_proceso`, `completada`, etc.) no aparecen en el dashboard aunque tengan fecha futura.

---

## Comportamiento con rol CUIDADOR_FAMILIAR

Cuando `isCuidador === true` y no hay un paciente activo seleccionado en el store `activePaciente`, la pantalla Home renderiza el componente `EmptyPacienteActivoState` en lugar del contenido habitual. Este componente invita al usuario a seleccionar un paciente a través de `PacienteActivoSelector`.

Una vez seleccionado el paciente activo, todos los fetches de citas y medicamentos se realizan en contexto del paciente seleccionado, no del cuidador.

---

## Datos del usuario que se usan

| Dato                   | Uso                                                           |
| ---------------------- | ------------------------------------------------------------- |
| `user.name`            | Saludo personalizado en HeaderHome                            |
| `user.fotoPerfil`      | Foto de perfil en HeaderHome                                  |
| `user._id`             | Contexto para los fetches de datos                            |
| `user.fechaNacimiento` | No se usa directamente en dashboard, ya fue procesado en auth |

---

## Notas de comportamiento

- Las listas de citas y medicamentos muestran `EmptyState` si no hay datos.
- `LoadingScreen` se muestra mientras React Query carga los datos iniciales.
- La pantalla no muestra el historial de check-ins; eso corresponde a la pantalla de Resultados.
