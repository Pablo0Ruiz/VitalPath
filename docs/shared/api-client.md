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
- **`wireRefresh(mode: 'cookie' | 'body'): void`**
  - **Parámetros**: El modo de refresco a utilizar.
  - **Propósito**: Configura el interceptor de respuesta para renovar el token al recibir un `401 Unauthorized`.
  - **Detalle**:
    - Si `mode === 'cookie'`, el interceptor llama a `/api/auth/refresh` y asume que el navegador enviará y procesará las cookies `httpOnly`.
    - Si `mode === 'body'`, el interceptor llama a `/api/auth/refresh-mobile`, enviando el `refreshToken` obtenido del adaptador en el cuerpo de la petición y almacenando la respuesta.

## Consumo y Uso

**Proyectos que lo usan**: Frontend (`apps/web`) y App Móvil (`apps/vitalpath`).

### Manejo de Tokens

1. **Obtención/Recepción**: La app consumidora inyecta su propio mecanismo de lectura (ej. `localStorage` en web o `SecureStore` en móvil) a través de `attachAuthAdapter`.
2. **Uso**: Para cada petición de Axios configurada, se ejecuta un interceptor de request que obtiene el token del adaptador y añade `Authorization: Bearer <token>`.
3. **Renovación**: Manejado automáticamente por el interceptor agregado mediante `wireRefresh`.

### Ejemplo de Uso (Next.js)

```typescript
import { apiClient, attachAuthAdapter, wireRefresh } from '@repo/api-client';

// Configuración inicial en el Entrypoint (ej. un Provider en Next.js)
attachAuthAdapter({
  getToken: async () => localStorage.getItem('access_token'),
  setToken: async token => localStorage.setItem('access_token', token),
  deleteToken: async () => localStorage.removeItem('access_token'),
  getRefreshToken: async () => null, // No aplica, usa cookies
  setRefreshToken: async () => {},
  deleteRefreshToken: async () => {},
  navigate: path => (window.location.href = path),
});

wireRefresh('cookie');

// Uso en componentes o hooks
const fetchUsers = async () => {
  const { data } = await apiClient.get('/users');
  return data;
};
```
