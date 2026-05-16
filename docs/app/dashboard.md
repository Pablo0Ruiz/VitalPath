# Dashboard (Home) — App Móvil VitalPath

---

## Propósito

Pantalla principal de la app después del login. Ofrece una vista consolidada del estado de salud del día: próximas citas, medicamentos pendientes y check-in de ánimo. Es el punto de entrada a todas las funcionalidades principales.

---

## Ruta

`/(drawer)/(tabs)/home`

---

## Componentes principales

| Componente                   | Tipo     | Responsabilidad                                              |
| ---------------------------- | -------- | ------------------------------------------------------------ |
| `HeaderHome`                 | atom     | Saludo personalizado con nombre del usuario y foto de perfil |
| `DailyCheckIn`               | molecule | Registro de estado de ánimo del día (mood tracking)          |
| `Banner` (HealthScoreBanner) | molecule | Indicador visual del puntaje de salud                        |
| `CustomList` (citas)         | molecule | Listado de las próximas 3 citas del usuario                  |
| `CustomList` (medicamentos)  | molecule | Medicamentos del día con checkbox de tomado/no tomado        |
| `CustomModal`                | molecule | Modal para agregar nuevo medicamento                         |
| `CustomUpdateModal`          | molecule | Modal para editar medicamento existente                      |
| `VoiceAssistantModal`        | organism | FAB + modal de asistente de voz (solo en Senior UI)          |
| `SectionHeader`              | molecule | Encabezados de sección con título y acción opcional          |

---

## Estado local y global que usa

| Estado         | Origen                         | Descripción                                                                   |
| -------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| `user`         | Zustand `useAuthStore`         | Nombre y foto para el saludo                                                  |
| `citas`        | React Query `useCitas()`       | Lista de citas del usuario                                                    |
| `medicamentos` | React Query `useMedicaments()` | Lista de medicamentos del usuario                                             |
| `completedSet` | Hook `useCompletedSet()`       | Set de IDs de medicamentos marcados como tomados (persiste durante la sesión) |
| `isSeniorUI`   | Zustand `useSeniorUIStore`     | Controla si se muestra el FAB de voz y ajusta tamaños                         |
| `createModal`  | Hook `useDisclosure()`         | Controla visibilidad del modal de creación                                    |
| `editModal`    | Hook `useDisclosure()`         | Controla visibilidad del modal de edición                                     |
| `voiceModal`   | Hook `useDisclosure()`         | Controla visibilidad del modal de voz                                         |

---

## Llamadas a la API

### Obtener citas

```
GET /citas?paciente_id={user._id}
Headers: Authorization: Bearer {accessToken}

Response 200: Cita[]
Response 401: Token inválido (interceptor ejecuta refresh)
```

### Obtener medicamentos

```
GET /medicamentos
Headers: Authorization: Bearer {accessToken}

Response 200: Medicamento[]
```

### Crear medicamento (desde modal)

```
POST /medicamentos
Headers: Authorization: Bearer {accessToken}
Body: {
  nombre: string,
  dosis: string,
  frecuencia: string
}

Response 201: Medicamento creado
```

### Eliminar medicamento

```
DELETE /medicamentos/{id}
Headers: Authorization: Bearer {accessToken}

Response 200: OK
```

El hook `useDeleteMedication` invalida automáticamente el caché de `useMedicaments()` tras la eliminación para refrescar la lista.

---

## Flujo típico del usuario

```
1. Usuario abre la app → AuthInitializer valida sesión
2. Si sesión válida → redirige a /(drawer)/(tabs)/home
3. HeaderHome muestra "Buenos días, {user.name}" + foto de perfil
4. DailyCheckIn muestra los 5 estados de ánimo → usuario selecciona uno
   → POST /mood/check-in { mood, fecha }
5. Lista de citas: muestra las próximas 3 ordenadas por fecha
6. Lista de medicamentos: muestra los del día
   → Usuario toca checkbox → se añade al completedSet local
   → El completedSet no persiste entre sesiones (es un tracking visual del día)
7. Usuario abre el drawer (ícono top-right) para acceder a perfil o settings
8. En modo Senior UI: aparece FAB de micrófono en bottom-right
   → Usuario toca FAB → abre VoiceAssistantModal
   → Puede dictar pregunta → asistente responde en voz
```

---

## Datos del usuario que se usan

| Dato                   | Uso                                                           |
| ---------------------- | ------------------------------------------------------------- |
| `user.name`            | Saludo personalizado en HeaderHome                            |
| `user.fotoPerfil`      | Foto de perfil en HeaderHome                                  |
| `user._id`             | Parámetro `paciente_id` en query de citas                     |
| `user.fechaNacimiento` | No se usa directamente en dashboard, ya fue procesado en auth |

---

## Notas de comportamiento

- Las listas de citas y medicamentos muestran `EmptyState` si no hay datos.
- `LoadingScreen` se muestra mientras React Query carga los datos iniciales.
- La pantalla no muestra el historial de check-ins; eso corresponde a la pantalla de Resultados.
