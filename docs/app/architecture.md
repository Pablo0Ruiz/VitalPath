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
│           Zustand stores (auth, seniorUI)             │
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

| Store               | Propósito                                              |
| ------------------- | ------------------------------------------------------ |
| `auth.ts`           | Sesión del usuario (user, isLoading, hydrated)         |
| `seniorUI.store.ts` | Modo de accesibilidad senior (persiste en SecureStore) |

El store de chat y mensajes vive en `@repo/store` para ser compartido con otras plataformas.

### `src/hooks/` — Hooks personalizados

| Hook                     | Propósito                                                    |
| ------------------------ | ------------------------------------------------------------ |
| `useTheme()`             | Lee el tema actual (light/dark/senior) y devuelve los tokens |
| `useDisclosure()`        | Control de estado abierto/cerrado para modales               |
| `useVoiceAssistant()`    | Grabación de audio y síntesis de voz                         |
| `usePushNotifications()` | Registro de token de notificaciones push                     |
| `usePdfData()`           | Descarga y preparación de resultados médicos en PDF          |
| `useCompletedSet()`      | Estado de medicamentos marcados como tomados                 |

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
| `useLoginWithCode`          | `POST`   | `/auth/login-code`                  |
| `useCitas`                  | `GET`    | `/citas?paciente_id={id}`           |
| `useMedicaments`            | `GET`    | `/medicamentos`                     |
| `useDeleteMedication`       | `DELETE` | `/medicamentos/{id}`                |
| `useMedicalResultsPaciente` | `GET`    | `/medical-results?paciente_id={id}` |
| `useChatHistory`            | `GET`    | `/chat/history?chatId={id}`         |
| `useVoiceChat`              | `POST`   | `/chat/voice`                       |
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
