# Arquitectura de la API (NestJS)

La API de VitalPath está desarrollada en **NestJS** aprovechando su arquitectura basada en inyección de dependencias, controladores y servicios, lo cual garantiza escalabilidad, testabilidad y un bajo acoplamiento.

## Tecnologías Principales

- **Framework Core:** NestJS (Node.js).
- **Base de Datos:** MongoDB.
- **ORM / ODM:** Mongoose (a través de `@nestjs/mongoose`).
- **Validación de Datos:** `class-validator` y `class-transformer` (implementados mediante un `ValidationPipe` global).
- **Servicios Externos:**
  - **Supabase:** Para el almacenamiento de objetos (Storage), como archivos PDF y resultados médicos.
  - **Groq:** Para funcionalidades avanzadas de IA (modelos de lenguaje generativo y transcripción de voz).
- **Documentación de API:** Swagger (OpenAPI).

## Estructura por Capas

En cada módulo de la API se utiliza el patrón MVC (simplificado para APIs):

1. **Módulo (`*.module.ts`):** Empaqueta y registra controladores y proveedores. Importa otros módulos necesarios. El archivo raíz es `app.module.ts`.
2. **Controlador (`*.controller.ts`):** Define las rutas HTTP (endpoints) de la aplicación y extrae el cuerpo (`Body`), parámetros (`Param`) o información de autenticación de las peticiones HTTP.
3. **Servicio (`*.service.ts`):** Capa donde reside toda la **lógica de negocio**. Interactúa directamente con los repositorios (Mongoose Models) y/o servicios de terceros (como Groq y Supabase).
4. **DTOs (Data Transfer Objects):** Clases que definen la forma estricta que deben tener los datos de entrada en las peticiones. Son validados automáticamente por el `ValidationPipe`.

## Módulos de la Aplicación y sus Relaciones

El entry-point de la aplicación es `AppModule`, que se encarga de importar y agrupar los módulos de dominio:

- **ConfigModule y MongooseModule:** Cargan la configuración (validada por Joi) y la conexión a MongoDB al inicio.
- **ScheduleModule (NestJS):** Módulo de infraestructura que habilita el soporte de tareas programadas (cron). Importado por `AppointmentRemindersModule`.
- **CommonModule / AuditModule:** Interceptores transversales, como el `AuditLoggerInterceptor` para registro de actividades.
- **AuthModule:** Importado por el resto cuando necesitan protección. Gestiona la autenticación de usuarios.
- **HealthModule:** Expone el liveness probe (`GET /health`) y la comprobación de versión mínima de la app (`GET /health/version-check`). Omite el rate limiting global con `@SkipThrottle()`.
- **Módulos de Dominio (Appointment, User, Medications, Mood, Hospitals):** Son los módulos principales que manejan colecciones individuales en MongoDB.
- **VinculacionModule:** Gestiona el emparejamiento paciente-cuidador mediante códigos numéricos de 6 dígitos con expiración temporal. Expone endpoints para generar código, vincular, revocar y consultar listas de pacientes/cuidadores.
- **StatsModule:** Agrega estadísticas globales del sistema (`GET /stats/summary`) accesible por roles ADMIN y TRABAJADOR_CENTRO.
- **PushNotificationsModule:** Servicio puro (sin controlador) que encapsula el envío de notificaciones push a dispositivos móviles mediante el SDK de Expo. Es consumido por otros módulos como `AppointmentRemindersModule`.
- **AppointmentRemindersModule:** Cron job diario (09:00 Europe/Madrid) que consulta las citas del día y envía recordatorios push a los pacientes. Depende de `PushNotificationsModule` y del `ScheduleModule` de NestJS.
- **GroqToolsModule:** Provee conjuntos de herramientas (ToolSets) diferenciados por rol para el módulo de IA. `GroqToolsService.getToolsFor(userId, role)` retorna las tools habilitadas para el usuario autenticado.
- **SeedModule:** Disponible solo en entornos de desarrollo y pruebas. Carga datos iniciales incluyendo un usuario de rol `CUIDADOR_FAMILIAR`.
- **Módulos de Integración Externa (GroqModule, SupabaseModule):** Se comunican con APIs externas. El controlador de `Supabase` interactúa con resultados médicos que posteriormente pueden estar atados a citas y pacientes.

## Flujos Principales

### Flujo de Creación de Recursos (Ej. Citas)

1. El cliente (Móvil/Web) envía un `POST /appointment` con su JWT.
2. El **Guard de Autenticación (`@Auth()`)** intercepta la llamada, verifica el JWT y extrae el perfil de usuario.
3. El **ValidationPipe** global valida que el cuerpo de la petición cumpla con el `CreateAppointmentDto`.
4. El `AppointmentController` recibe la data validada e invoca al `AppointmentService`.
5. El `AppointmentService` procesa la lógica, persiste la información en MongoDB mediante `Mongoose` y retorna la respuesta.

### Flujo de IA (Groq)

1. El cliente llama a `POST /ai/chat-stream`.
2. Se procesan archivos adjuntos (`UseInterceptors(FilesInterceptor(...))`).
3. El controlador llama al servicio de Groq para interactuar con la IA de forma asíncrona, abriendo un flujo SSE (Server-Sent Events) devolviendo fragmentos (chunks) en tiempo real para optimizar la percepción de latencia del cliente.
