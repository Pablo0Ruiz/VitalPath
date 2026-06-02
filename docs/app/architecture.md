# Arquitectura — App Móvil VitalPath

---

## Visión general

La app sigue una arquitectura en capas donde cada capa tiene una responsabilidad única:

```
┌──────────────────────────────────────────────────────┐
│                  Capa de Presentación                 │
│     Expo Router (screens) + Sistema de diseño UI      │
├──────────────────────────────────────────────────────┤
│                  Capa de Aplicación                   │
│        Hooks personalizados + React Query             │
├──────────────────────────────────────────────────────┤
│                  Capa de Estado Global                │
│      Zustand stores (auth, seniorUI, activePaciente)  │
├──────────────────────────────────────────────────────┤
│                  Capa de Infraestructura              │
│     @repo/api-client (Axios) + Adapters (SecureStore) │
└──────────────────────────────────────────────────────┘
```

La app forma parte de un monorepo pnpm. Consume dos paquetes internos:

| Paquete            | Rol                                                                      |
| ------------------ | ------------------------------------------------------------------------ |
| `@repo/api-client` | Cliente Axios con interceptores, hooks React Query y llamadas al backend |
| `@repo/store`      | Fábrica de auth store y tipos compartidos con la app web                 |
| `@repo/types`      | Interfaces TypeScript compartidas (`UserSession`, `TokenAdapter`, etc.)  |

---

## Navegación

La app usa **Expo Router** (file-based routing) sobre React Navigation. La estructura de carpetas define directamente el árbol de rutas.

### Árbol de navegación

```
Root Stack (_layout.tsx)
├── index.tsx            ← Puerta de entrada; redirige a login o home
├── (auth)/              ← Stack público (sin sesión)
│   ├── login/
│   ├── register/        ← Multi-paso: index → step-2 → step-3
│   ├── register-cuidador/
│   ├── recover-password/
│   ├── recover-password-email-sent/
│   └── senior-ui-suggestion/
└── (drawer)/            ← Drawer protegido (con sesión)
    ├── (tabs)/          ← Tabs anidadas dentro del drawer
    │   ├── home/
    │   ├── chat/
    │   ├── records/[id] ← Ruta dinámica para detalles
    │   ├── appointments/
    │   └── medications/  ← Oculto del tab bar
    ├── profile/
    └── settings/
```

### Convenciones de Expo Router

- Carpetas entre paréntesis `(name)` son **grupos de rutas** — no añaden segmento a la URL.
- `_layout.tsx` define el navegador del grupo (Stack, Drawer, Tabs).
- `[id].tsx` es una ruta dinámica; recibe parámetros vía `useLocalSearchParams()`.

### Configuración del Drawer

```
- Posición: derecha
- Tipo: 'front' (se superpone sobre el contenido)
- Ancho: 80% de la pantalla
- Swipe: deshabilitado (se abre desde ícono en header)
- Componente personalizado: AppDrawerContent
- Ítems visibles: ninguno (perfil y settings se abren desde AppDrawerContent)
```

### Configuración de Tabs

```
- Barra personalizada: TabBarPill (píldora flotante)
- Pestañas activas: Records | Home | Chat | Citas
- Medications: href: null (sin acceso desde tabs)
- Se oculta con el teclado
```

---

## Organización de carpetas en detalle

### `app/` — Rutas (Expo Router)

Las pantallas viven directamente en `app/`. Contienen solo la lógica de orquestación de la pantalla: leer del store, llamar hooks, componer componentes UI. No tienen lógica de negocio.

### `src/components/ui/` — Sistema de diseño atómico

```
atoms/       Componentes sin dependencias: Button, Input, Card, Badge, Avatar…
molecules/   Composiciones de atoms: FormField, AppointmentRow, ChatComposer…
organisms/   Bloques funcionales completos: ChatHistory, CalendarWidget, AppDrawerContent…
```

Regla: ningún componente de UI importa directamente desde `@repo/api-client`. Los datos llegan siempre via props o contexto.

### `src/stores/` — Estado global (Zustand)

| Store               | Propósito                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth.ts`           | Sesión del usuario (user, isLoading, hydrated)                                                                                                             |
| `seniorUI.store.ts` | Modo de accesibilidad senior (persiste en SecureStore)                                                                                                     |
| `activePaciente.ts` | Paciente activo seleccionado cuando el rol es `CUIDADOR_FAMILIAR`. Usado por `useActivePatientId()`, `EmptyPacienteActivoState` y `PacienteActivoSelector` |

El store de chat y mensajes vive en `@repo/store` para ser compartido con otras plataformas.

### `src/hooks/` — Hooks personalizados

| Hook                        | Propósito                                                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `useTheme()`                | Lee el tema actual (light/dark/senior) y devuelve los tokens                                                                        |
| `useDisclosure()`           | Control de estado abierto/cerrado para modales                                                                                      |
| `useVoiceAssistant()`       | Grabación de audio y síntesis de voz                                                                                                |
| `usePushNotifications()`    | Registro de token de notificaciones push                                                                                            |
| `usePdfData()`              | Descarga y preparación de resultados médicos en PDF                                                                                 |
| `useTakeMedication()`       | `PATCH /medications/:id/take` — registra una dosis tomada en el servidor                                                            |
| `useMedicationsByPatient()` | `GET /medications/patient/:id` — medicamentos de un paciente específico                                                             |
| `useVersionCheck()`         | `GET /health/version-check` — llamado al arrancar la app por `VersionGate`                                                          |
| `useActivePatientId()`      | Lee el store `activePaciente` y devuelve el ID del paciente en contexto de cuidador                                                 |
| `useRole()`                 | Devuelve el rol actual del usuario desde el auth store                                                                              |
| `useVinculacion()`          | Flujo de vinculación de cuidador: `useGenerarCodigo`, `useVincular`, `useRevocarVinculacion`, `useMisPacientes`, `useMisCuidadores` |
| `useMoodCheckIn()`          | Endpoint de mood tracking                                                                                                           |
| `useRegisterCuidador()`     | Registro de cuidador familiar                                                                                                       |
| `useStatsSummary()`         | `GET /stats/summary`                                                                                                                |
| `useAuditLogs()`            | `GET /audit-logs` (solo rol ADMIN)                                                                                                  |

### `src/adapters/` — Adapters de infraestructura

Los adapters implementan puertos definidos en `@repo/types`, desacoplando la lógica de negocio del almacenamiento específico de la plataforma.

| Adapter                | Puerto           | Implementación      |
| ---------------------- | ---------------- | ------------------- |
| `mobileTokenAdapter`   | `TokenAdapter`   | `expo-secure-store` |
| `mobileStorageAdapter` | `StorageAdapter` | `expo-secure-store` |

### `src/lib/api-setup.ts` — Configuración de infraestructura

Configura la instancia Axios del monorepo al arrancar la app:

```typescript
apiClient.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
apiClient.defaults.headers.common['x-client-platform'] = 'mobile';
attachAuthAdapter(mobileTokenAdapter);
wireRefresh('body'); // El refresh token viaja en el body (no en cookie httpOnly)
```

El header `x-client-platform: mobile` le indica al backend que debe responder con `refreshToken` en el body de la respuesta (en lugar de una cookie httpOnly, que es el comportamiento para la app web).

---

## Comunicación con el backend

### Flujo de una petición autenticada

```
Screen/Hook
  → React Query (useQuery / useMutation)
    → @repo/api-client (función de API)
      → Axios instance (apiClient)
        → Interceptor de request: adjunta Authorization: Bearer {accessToken}
          → Backend NestJS (apps/api)
            → Response
        ← Interceptor de response: si 401 → intenta refresh
```

### Hooks de React Query disponibles

Los hooks se definen en `@repo/api-client` y se usan directamente en las pantallas:

| Hook                        | Método   | Endpoint                            |
| --------------------------- | -------- | ----------------------------------- |
| `useLogin`                  | `POST`   | `/auth/login`                       |
| `useLoginWithCode`          | `POST`   | `/auth/login/code/:codigo`          |
| `useRegisterCuidador`       | `POST`   | `/auth/register-cuidador`           |
| `useCitas`                  | `GET`    | `/appointment`                      |
| `useMedicaments`            | `GET`    | `/medications`                      |
| `useTakeMedication`         | `PATCH`  | `/medications/:id/take`             |
| `useMedicationsByPatient`   | `GET`    | `/medications/patient/:id`          |
| `useDeleteMedication`       | `DELETE` | `/medications/:id`                  |
| `useMedicalResultsPaciente` | `GET`    | `/medical-results?paciente_id={id}` |
| `useChatHistory`            | `GET`    | `/ai/chat-history/:chatId`          |
| `useVoiceChat`              | `POST`   | `/ai/voice-chat`                    |
| `useVersionCheck`           | `GET`    | `/health/version-check`             |
| `useStatsSummary`           | `GET`    | `/stats/summary`                    |
| `useAuditLogs`              | `GET`    | `/audit-logs`                       |
| `savePushToken`             | `POST`   | `/notifications/register-token`     |

### Manejo de errores de red

Todos los errores de red se canalizan por `handleErrorPush` (`src/utils/handleErrorPush.ts`), que normaliza el mensaje de error antes de mostrarlo al usuario.

---

## Estado global en detalle

### Auth Store (`src/stores/auth.ts`)

```typescript
interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  _hasHydrated: boolean;
  setSession(user: UserSession): void;
  clearSession(): void;
  setIsLoading(v: boolean): void;
}
```

Se inicializa al arrancar la app a través de `SessionGate` / `AuthInitializer`, que invoca `useSession(mobileTokenAdapter, ...)`. Este hook:

1. Lee el `token` de SecureStore.
2. Si existe, llama al endpoint `/auth/me` para validarlo.
3. Si el token expiró, ejecuta el refresh automáticamente.
4. Setea `user` en el store o limpia la sesión.

### Senior UI Store (`src/stores/seniorUI.store.ts`)

```typescript
interface SeniorUIState {
  isSeniorUI: boolean;
  hasSeenSuggestion: boolean;
  _hasHydrated: boolean;
  setIsSeniorUI(v: boolean): void;
  setHasSeenSuggestion(): void;
  syncWithUser(user: UserSession | null): void;
  reset(): void;
}
```

Persiste en SecureStore. `syncWithUser` activa automáticamente el modo senior si `user.fechaNacimiento` indica que el usuario tiene ≥ 65 años.

### Active Paciente Store (`src/stores/activePaciente.ts`)

Mantiene el paciente actualmente seleccionado cuando el usuario tiene rol `CUIDADOR_FAMILIAR`. `useActivePatientId()` lee este store y provee el ID del paciente como contexto para todos los fetches de datos. Si el store está vacío, la pantalla Home renderiza `EmptyPacienteActivoState`.

---

## Organisms relevantes

| Organism            | Responsabilidad                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChatHistory`       | Listado de conversaciones previas con el asistente IA                                                                                                      |
| `CalendarWidget`    | Vista de calendario para navegar entre citas                                                                                                               |
| `AppDrawerContent`  | Contenido del drawer lateral (perfil, settings, logout)                                                                                                    |
| `VersionGate`       | Wrappea toda la app en `_layout.tsx`. Llama a `useVersionCheck()` al arrancar. Si `status === 'blocked'`, renderiza `ForceUpdateScreen` en lugar de la app |
| `ForceUpdateScreen` | Pantalla bloqueante de pantalla completa que se muestra cuando la versión de la app está por debajo del mínimo requerido por el backend                    |

---

## Sistema de temas

El hook `useTheme()` lee el esquema de color del dispositivo (`useColorScheme`) y devuelve el objeto de tokens correspondiente:

| Tema     | Condición                                                   |
| -------- | ----------------------------------------------------------- |
| `light`  | Dispositivo en modo claro + `isSeniorUI = false`            |
| `dark`   | Dispositivo en modo oscuro + `isSeniorUI = false`           |
| `senior` | `isSeniorUI = true` (independiente del esquema del sistema) |

Los tokens se definen en `src/constants/tokens.ts` e incluyen colores, tamaños de fuente, radios y espaciados.

---

## Capacidades nativas de Expo utilizadas

| Capacidad                   | Paquete                | Uso                                      |
| --------------------------- | ---------------------- | ---------------------------------------- |
| Almacenamiento seguro       | `expo-secure-store`    | Tokens de autenticación                  |
| Audio / grabación           | `expo-audio`           | Mensajes de voz en el chat               |
| Síntesis de voz             | `expo-speech`          | Respuestas habladas del asistente        |
| Selector de imágenes        | `expo-image-picker`    | Adjuntar imágenes al chat                |
| Notificaciones push         | `expo-notifications`   | Alertas de nuevos resultados             |
| Información del dispositivo | `expo-device`          | Detectar si es dispositivo físico (push) |
| Constantes de app           | `expo-constants`       | EAS project ID, versión                  |
| Gradientes                  | `expo-linear-gradient` | UI del hero en pantallas de auth         |

---

## Testing

Configuración en `jest.config.js`:

```
Framework: Jest + @testing-library/react-native
```

Los tests unitarios de hooks viven en `src/hooks/__tests__/`.
