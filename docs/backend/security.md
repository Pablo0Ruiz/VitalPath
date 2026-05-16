# Seguridad de la API

La API de VitalPath aplica el concepto de defensa en profundidad. Se implementan múltiples capas de seguridad desde la cabecera HTTP hasta la persistencia en base de datos.

## Autenticación y Tokens JWT

El sistema de autenticación está basado en **JSON Web Tokens (JWT)**. Existen dos mecanismos principales para clientes web y nativos:

1. **Access Tokens:** Tokens de vida corta enviados en cada petición en la cabecera HTTP (`Authorization: Bearer <token>`).
2. **Refresh Tokens (Rotación Segura):**
   - **Para la Web:** Se almacenan en una cookie **HttpOnly, Secure y SameSite=None**, lo que evita que el código de cliente (JavaScript) lo intercepte (protección contra XSS).
   - **Para Clientes Móviles:** Los clientes móviles envían el token a través del cuerpo de las peticiones a un endpoint específico (`refresh-mobile`).

## Autorización: Decoradores y Guards

La autorización se maneja con un sistema de **Roles** (`PACIENTE`, `MEDICO`, `TRABAJADOR_CENTRO`, `ADMIN`).

Se utiliza un decorador personalizado `@Auth(...roles)` que empaqueta automáticamente Guards de NestJS para:

1. Validar el token JWT.
2. Extraer los datos del usuario logueado en la petición (`@GetUser()`).
3. Verificar que el usuario tenga alguno de los roles permitidos. Si la ruta es pública para cualquier usuario registrado, se usa `@Auth()` sin parámetros.

## Protección de Capa de Red y Aplicación

- **Helmet:** El módulo global carga `helmet()` para configurar cabeceras de seguridad HTTP de manera automática, mitigando ataques tipo _clickjacking_, _MIME-sniffing_ y configurando políticas de origen de seguridad (CSP, HSTS).
- **CORS Estricto:** Está configurado para aceptar peticiones solo desde orígenes específicos (`WEB_ORIGIN` en producción) y permitiendo cabeceras controladas. Requiere `credentials: true` para habilitar el uso de cookies en cross-domain.
- **Rate Limiting (Throttler):**
  - Implementado a nivel global mediante `@nestjs/throttler`.
  - Establece un límite predeterminado de peticiones por IP y por minuto (Ej: `50 peticiones / 60 segundos`).
  - Hay endpoints sensibles (como `/auth/login`, `/auth/refresh`) que tienen decoradores `@Throttle()` más restrictivos (por ejemplo, 5 peticiones por minuto) para evitar ataques de _fuerza bruta_.
- **Validación Estricta:**
  - El `ValidationPipe` global tiene habilitadas las opciones `whitelist: true` y `forbidNonWhitelisted: true`. Esto evita ataques de asignación masiva (_Mass Assignment_), ya que descarta o rechaza cualquier propiedad enviada por el cliente que no esté explícitamente listada en los DTOs.
  - Los archivos recibidos se validan y se gestionan usando `multer` a través de interceptores de NestJS.

## Gestión de Claves y Variables de Entorno

Toda la configuración sensible está externalizada mediante `@nestjs/config`. NestJS carga las variables de entorno en tiempo de ejecución validando la estructura obligatoria con un esquema de **Joi** (`JoiValidationSchema`). Nunca se exponen secretos, claves de firma JWT ni strings de base de datos en el código fuente.
