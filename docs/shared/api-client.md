# @repo/api-client

El paquete `@repo/api-client` provee una instancia configurada de Axios y un sistema robusto de interceptores para manejar el ciclo de vida de la autenticación de forma completamente agnóstica a la plataforma.

## Propósito

- Exponer clientes HTTP (`apiClient` y `aiApi`) listos para usarse.
- Gestionar la inyección automática del token JWT en las cabeceras de cada petición.
- Manejar automáticamente la renovación (refresh) de tokens expirados.

## API Pública

### Instancias HTTP

- **`apiClient`**: Instancia principal de Axios configurada con `withCredentials: true` y los headers base (Content-Type y Accept como `application/json`).
- **`aiApi`**: Instancia secundaria destinada a peticiones relacionadas con servicios de inteligencia artificial.

### Funciones Principales

- **`attachAuthAdapter(adapter: TokenAdapter): void`**
  - **Parámetros**: Un objeto que implemente la interfaz `TokenAdapter` (definida en `@repo/types`).
  - **Propósito**: Permite a la aplicación consumidora proveer las funciones para obtener, guardar y borrar tokens, así como para navegar a otra pantalla (ej: `/login` al fallar el refresco).
- **`attachAuthHeader(instance): void`**
  - Registra el interceptor de request en cualquier instancia de Axios para inyectar `Authorization: Bearer <token>`. Ya está aplicado a `apiClient` y `aiApi` internamente.
- **`wireRefresh(mode: 'cookie' | 'body'): void`**
  - **Parámetros**: El modo de refresco a utilizar.
  - **Propósito**: Configura el interceptor de respuesta para renovar el token al recibir un `401 Unauthorized`.
  - **Detalle**:
    - Si `mode === 'cookie'`, el interceptor llama a `/api/auth/refresh` y asume que el navegador enviará y procesará las cookies `httpOnly`. No se necesita adaptador para el refresh token.
    - Si `mode === 'body'`, el interceptor llama a `/api/auth/refresh-mobile`, enviando el `refreshToken` obtenido del adaptador en el cuerpo de la petición y almacenando la respuesta. Usado en la app móvil.

### Módulos de acciones (server actions)

El paquete exporta funciones async por dominio:

| Módulo                    | Funciones representativas                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `auth.actions`            | `login`, `register`, `logout`, `refreshToken`, `registerPatientByWorker`                                                  |
| `medication.actions`      | `getMedicaments`, `createMedication`, `updateMedication`, `deleteMedication`, `takeMedication`, `getMedicationsByPatient` |
| `appointment.actions`     | `getCitas`, `createCita`, `updateCita`, `deleteCita`                                                                      |
| `doctor.actions`          | `getDoctors`, `getDoctorById`                                                                                             |
| `medical-results.actions` | `getResultados`, `uploadResultado`, `getResultadosByPatient`                                                              |
| `user.actions`            | `patchMe`, `savePushToken`, `getPatientById`, `getCenterPatients`                                                         |
| `ai.actions`              | Streaming de chat e historial de conversaciones                                                                           |
| `stats.actions`           | `getStatsSummary` → `GET /api/stats/summary`                                                                              |
| `vinculacion.actions`     | `postGenerarCodigo`, `postVincular`, `patchRevocarVinculacion`, `getMisPacientes`, `getMisCuidadores`                     |
| `audit.actions`           | `getAuditLogs(query?: AuditLogQuery)` → `GET /api/audit-logs`                                                             |
| `health.actions`          | `checkAppVersion(version: string)` → `GET /api/health/version-check`                                                      |

### Hooks de React Query

Todos los hooks están listos para usar en componentes React/React Native con `@tanstack/react-query`.

| Hook                          | Tipo     | Descripción                                                    |
| ----------------------------- | -------- | -------------------------------------------------------------- |
| `useSession`                  | query    | Sesión del usuario autenticado                                 |
| `useUser`                     | query    | Perfil completo del usuario                                    |
| `useLogin`                    | mutation | Inicio de sesión                                               |
| `useLoginWithCode`            | mutation | Inicio de sesión con código de verificación                    |
| `useRegister`                 | mutation | Registro de usuario base                                       |
| `useRegisterPatientByWorker`  | mutation | Registro de paciente por personal administrativo               |
| `useLogout`                   | mutation | Cierre de sesión                                               |
| `useRecoverPassword`          | mutation | Recuperación de contraseña                                     |
| `useMedicaments`              | query    | Lista de medicamentos del usuario autenticado                  |
| `useMedicament(id)`           | query    | Detalle de un medicamento por ID                               |
| `useCreateMedication`         | mutation | Crear medicamento                                              |
| `useUpdateMedication`         | mutation | Actualizar medicamento                                         |
| `useDeleteMedication`         | mutation | Eliminar medicamento                                           |
| `useTakeMedication`           | mutation | Registrar toma de dosis; retorna `TakeMedicationResponse`      |
| `useMedicationsByPatient(id)` | query    | Medicamentos de un paciente específico (para cuidadores/staff) |
| `useCitas`                    | query    | Citas del usuario autenticado                                  |
| `useDoctor`                   | query    | Lista de médicos disponibles                                   |
| `useMedicalResults`           | query    | Resultados médicos                                             |
| `useVoiceChat`                | mutation | Envío de audio para chat de voz                                |
| `useChatHistory`              | query    | Historial de mensajes de una conversación                      |
| `useConversations`            | query    | Lista de conversaciones del usuario                            |
| `useMoodCheckIn`              | mutation | Registro de estado de ánimo                                    |
| `useStatsSummary`             | query    | Estadísticas agregadas (`StatsSummary`)                        |
| `useVinculacion`              | query    | Estado de vinculación del usuario                              |
| `useMisPacientes`             | query    | Pacientes vinculados al cuidador autenticado                   |
| `useMisCuidadores`            | query    | Cuidadores vinculados al paciente autenticado                  |
| `useRegisterCuidador`         | mutation | Registro de un nuevo cuidador_familiar                         |
| `useAuditLogs(query?)`        | query    | Registros de auditoría filtrados (solo ADMIN)                  |
| `useVersionCheck`             | query    | Verifica si la versión de la app es compatible con el backend  |

## Consumo y Uso

**Proyectos que lo usan**: Frontend (`apps/web`) y App Móvil (`apps/vitalpath`).

### Manejo de Tokens

1. **Obtención/Recepción**: La app consumidora inyecta su propio mecanismo de lectura (`SecureStore` en móvil, cookies httpOnly en web) a través de `attachAuthAdapter`.
2. **Uso**: Para cada petición de Axios configurada, se ejecuta un interceptor de request que obtiene el token del adaptador y añade `Authorization: Bearer <token>`.
3. **Renovación**: Manejado automáticamente por el interceptor agregado mediante `wireRefresh`.

### Ejemplo de Uso (Next.js — modo cookie)

En la web, el token de acceso se gestiona mediante cookies `httpOnly`. El adaptador no necesita leer ni escribir tokens manualmente; el navegador lo hace automáticamente. Solo se necesita el `navigate` para redirigir al login en caso de fallo de refresco:

```typescript
import { attachAuthAdapter, wireRefresh } from '@repo/api-client';

// Configuración inicial en el Provider de la app
attachAuthAdapter({
  getToken: async () => null, // La web usa cookies httpOnly; no hay token en JS
  setToken: async () => {},
  deleteToken: async () => {},
  getRefreshToken: async () => null, // No aplica en modo cookie
  setRefreshToken: async () => {},
  deleteRefreshToken: async () => {},
  navigate: path => (window.location.href = path),
});

wireRefresh('cookie'); // Usa /api/auth/refresh con cookie httpOnly
```

### Ejemplo de Uso (React Native — modo body)

En la app móvil, los tokens se almacenan en `expo-secure-store`. El adaptador lee y escribe tokens explícitamente:

```typescript
import * as SecureStore from 'expo-secure-store';
import {
  attachAuthAdapter,
  wireRefresh,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@repo/api-client';
import { router } from 'expo-router';

attachAuthAdapter({
  getToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setToken: token => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  deleteToken: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: token => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  deleteRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  navigate: path => router.replace(path as any),
});

wireRefresh('body'); // Usa /api/auth/refresh-mobile con el refresh token en el body
```
