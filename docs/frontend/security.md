# Seguridad del Frontend

Este documento detalla las medidas de seguridad implementadas en el cliente web para proteger las credenciales, rutas y datos sensibles de los usuarios.

## Gestión del Token de Autenticación

El frontend utiliza un esquema de tokens dobles (Access Token + Refresh Token):

1. **Access Token:**
   - **Almacenamiento:** Se almacena como una cookie estándar (accesible vía JS y mediante la cabecera Cookie) con el atributo `SameSite=Lax`.
   - **Uso:** El `webTokenAdapter` (`src/adapters/webTokenAdapter.ts`) lo lee y `@repo/api-client` lo adjunta automáticamente en la cabecera `Authorization: Bearer <token>` de las peticiones a la API.

2. **Refresh Token:**
   - **Almacenamiento:** Lo gestiona y emite el backend como una cookie **`httpOnly`**. El código JavaScript del frontend _no puede_ leer ni modificar este token.
   - **Uso:** Cuando el Access Token expira, el backend responde con error 401. El cliente HTTP captura este error y ejecuta una llamada de renovación. El navegador envía la cookie `httpOnly` de forma segura y transparente; el backend retorna un nuevo Access Token.

## Protección de Rutas

Para evitar accesos no autorizados a las páginas protegidas, se emplean dos capas de seguridad:

### 1. Middleware de Next.js (`proxy.ts`)

Se interceptan las peticiones a las rutas de `(portal)` (`/dashboard`, `/patients`, `/doctors`, etc.).

- **Verificación JWT:** Se usa la librería `jose` para validar criptográficamente la firma del JWT directamente en el Edge de Next.js antes de renderizar la página.
- **Autorización basada en Roles (RBAC):** El middleware lee el payload del JWT y verifica que el rol sea uno de los permitidos (`admin`, `trabajador_centro`, `medico`).
- Si el token falta, es inválido o el rol no coincide, la petición se redirige inmediatamente a `/login`.

### 2. Guardias de Cliente / Interceptores

Si en cualquier momento la sesión expira estando dentro de la app y no se puede hacer un _silent refresh_, el interceptor HTTP de `@repo/api-client` captura el error definitivo de autenticación y ejecuta una redirección dura (`window.location.href = '/login'`), asegurando que el usuario es expulsado de la vista privada.

## Prevención de Fugas y Ataques

- **XSS (Cross-Site Scripting):** React y Next.js escapan automáticamente el contenido inyectado en el DOM. Además, el no usar `localStorage` para el refresh token mitiga críticamente el robo de sesión prolongada si el sitio sufriese inyección JS.
- **CSRF (Cross-Site Request Forgery):** Se mitiga en gran medida a través del atributo `SameSite=Lax` en las cookies y el hecho de que las llamadas a la API (en su mayoría) usan Bearer tokens explicitly adjuntados por el Axios client.
- **Ocultación de Errores:** Las respuestas detalladas de la API no se muestran en crudo en la interfaz. Se interceptan y se traducen a notificaciones amigables (ej. "Las credenciales son inválidas" en lugar de trazas de pila o errores específicos de DB).
