# Seguridad en Paquetes Compartidos

La seguridad del sistema se fundamenta en gran parte en cómo los paquetes compartidos gestionan la autenticación, la autorización y la comunicación segura con el backend.

## Lógica de Seguridad en `packages/`

La principal responsabilidad de seguridad recae en el paquete **`@repo/api-client`** y en menor medida en **`@repo/store`**.

### Manejo de Tokens (`@repo/api-client`)

El paquete proporciona un interceptor avanzado (`refresh-interceptor.ts`) y un cliente pre-configurado (`client.ts`) para gestionar el ciclo de vida de los tokens de acceso y refresco de forma agnóstica a la plataforma.

1. **Inyección Dinámica de Tokens (Adapter Pattern)**
   - El cliente de la API no interactúa directamente con `localStorage` o `SecureStore`.
   - Expone la función `attachAuthAdapter(adapter: TokenAdapter)` para que el proyecto consumidor inyecte la forma segura de obtener y establecer tokens.
   - El interceptor intercepta cada petición y agrega la cabecera `Authorization: Bearer <token>`.

2. **Flujo de Refresco de Tokens (Refresh Flow)**
   - Cuando una petición retorna un error `401 Unauthorized`, el interceptor pausa las peticiones subsiguientes (añadiéndolas a una cola `pendingQueue`).
   - Existen dos modos de refresco, configurables en el inicio de la app mediante `wireRefresh(mode)`:
     - **Modo `'cookie'` (Frontend Web)**: Realiza una petición POST a `/api/auth/refresh`. El navegador envía automáticamente la cookie `httpOnly` de refresco. Este modo protege contra ataques XSS, ya que el token de refresco nunca es accesible vía JavaScript.
     - **Modo `'body'` (App Móvil)**: La app lee el `refreshToken` a través del adaptador y lo envía en el cuerpo de la petición POST a `/api/auth/refresh-mobile`.
   - Tras obtener el nuevo `accessToken` (y el nuevo `refreshToken` si aplica), se reanudan todas las peticiones fallidas originales.

3. **Manejo de Errores de Autenticación**
   - Si el proceso de refresco falla (e.g., token de refresco revocado o expirado), el cliente invoca la limpieza de tokens (`deleteToken()`, `deleteRefreshToken()`) en el adaptador y ejecuta una redirección dura (`adapter.navigate('/login')`) forzando el cierre de sesión seguro.

### Validación de Entrada (`@repo/types`)

- **Zod Schemas**: Todos los datos que fluyen hacia el backend se validan con esquemas de Zod antes de ser enviados y en el momento en que el backend los recibe. Esto protege contra inyecciones y manipulaciones de carga útil (payload tampering).

## Contribución a la Seguridad Global

- **Prevención de Lógica Duplicada**: Al centralizar el interceptor y la inyección del token en `api-client`, se elimina el riesgo de que la web y la app móvil tengan implementaciones diferentes de seguridad. Si se arregla una vulnerabilidad en el ciclo del token, ambas plataformas se actualizan al instante.
- **Protección de Credenciales**: Manteniendo el cliente HTTP completamente agnóstico del medio de almacenamiento, se habilita el uso de medidas de seguridad superiores como `SecureStore` (en iOS/Android) sin tener que ensuciar la lógica de negocio HTTP.
