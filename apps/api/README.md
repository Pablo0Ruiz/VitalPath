# VitalPath API

Backend REST desarrollado con **NestJS** para la plataforma VitalPath AI. Sirve tanto a la app móvil como al portal web, y expone una API documentada con Swagger/OpenAPI.

---

## ¿Qué hace?

Centraliza toda la lógica de negocio de la plataforma:

- **Autenticación** con JWT (tokens de acceso + refresh vía cookies HttpOnly)
- **Gestión de citas** médicas con recordatorios automáticos push
- **Seguimiento de medicamentos** y horarios personalizados
- **Asistente de IA** conversacional usando Groq API con function calling (el AI puede consultar citas, medicamentos y estado de ánimo directamente)
- **Registros de salud** y subida de archivos/resultados médicos (Supabase Storage)
- **Registro de estado de ánimo** diario (mood check-in)
- **Vinculación paciente–cuidador** con flujo de invitación
- **Gestión de centros médicos** y doctores
- **Auditoría** de acciones mediante interceptor global
- **Estadísticas** de uso y salud agregadas

---

## Tech stack

| Herramienta           | Uso                                                        |
| --------------------- | ---------------------------------------------------------- |
| NestJS                | Framework principal (módulos, guards, interceptors, pipes) |
| MongoDB + Mongoose    | Base de datos documental                                   |
| Passport.js + JWT     | Estrategias de autenticación                               |
| Groq API              | IA conversacional con function calling                     |
| Supabase Storage      | Almacenamiento de archivos médicos                         |
| Brevo                 | Emails transaccionales (recuperación de contraseña, etc.)  |
| Expo Notifications    | Notificaciones push a dispositivos móviles                 |
| class-validator + Joi | Validación de DTOs y configuración                         |
| @nestjs/throttler     | Rate limiting por endpoint                                 |
| @nestjs/schedule      | Tareas programadas (recordatorios de citas)                |
| Helmet                | Headers de seguridad HTTP                                  |
| Swagger/OpenAPI       | Documentación interactiva en `/docs`                       |

---

## Módulos

| Módulo                  | Responsabilidad                                                         |
| ----------------------- | ----------------------------------------------------------------------- |
| `auth`                  | Registro, login, refresh de token, recuperación de contraseña           |
| `user`                  | Gestión de perfil y datos del usuario                                   |
| `groq`                  | Chat con IA: streaming, historial de conversación, transcripción de voz |
| `groq-tools`            | Function calling: el AI consulta citas, medicamentos y estado de ánimo  |
| `appointment`           | CRUD de citas y gestión de estados                                      |
| `appointment-reminders` | Tarea programada que envía push notifications antes de cada cita        |
| `medications`           | Seguimiento de medicamentos y horarios                                  |
| `hospitals`             | Registro de centros médicos e invitación de doctores                    |
| `mood`                  | Registro diario de estado de ánimo con historial                        |
| `health`                | Entradas de registros de salud por paciente                             |
| `stats`                 | Estadísticas de uso y métricas de salud agregadas                       |
| `vinculacion`           | Flujo de vinculación entre paciente y cuidador                          |
| `audit`                 | Interceptor global que registra todas las acciones                      |
| `supabase`              | Subida y descarga de archivos vía Supabase Storage                      |
| `push-notifications`    | Entrega de notificaciones push a través de Expo                         |
| `seed`                  | Datos iniciales para desarrollo y pruebas                               |

---

## Variables de entorno

Crear un archivo `.env` en `apps/api/`. Todas las variables son obligatorias en producción:

```env
PORT=3000
MONGO_URI=<mongodb-connection-string>
MONGO_DB_NAME=<nombre-de-la-base-de-datos>
JWT_SECRET=<secreto-fuerte-y-aleatorio>
FRONTEND_URL=<url-del-portal-web>
BREVO_API_KEY=<api-key-de-brevo>
BREVO_SENDER_EMAIL=<email-verificado-en-brevo>
BREVO_SENDER_NAME=<nombre-del-remitente>
SUPABASE_URL=<url-del-proyecto-supabase>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-de-supabase>
GROQ_API_KEY=<api-key-de-groq>
MIN_APP_VERSION=1.0.0
```

> ⚠️ **Nunca subas tu `.env` real al repositorio.** Está incluido en `.gitignore`. Usa los nombres de las variables como referencia, nunca sus valores reales.

---

## Ejecutar la API

```bash
# Desarrollo con hot reload
pnpm start:dev

# Build para producción
pnpm build
pnpm start:prod
```

Desde la raíz del monorepo:

```bash
pnpm --filter api start:dev
```

La API queda disponible en `http://localhost:3000/api`.  
La documentación Swagger en `http://localhost:3000/docs`.

---

## Tests

```bash
# Tests unitarios
pnpm test

# Tests en modo watch
pnpm test:watch

# Reporte de cobertura
pnpm test:cov

# Tests e2e
pnpm test:e2e
```

---

## Seguridad

- Helmet configura headers HTTP de seguridad en todas las respuestas.
- CORS restringido al origen de `FRONTEND_URL` (obligatorio en producción).
- Tokens JWT almacenados como cookies HttpOnly — no accesibles desde JavaScript del cliente.
- Rate limiting habilitado por endpoint con `@nestjs/throttler`.
- Validación estricta de DTOs: campos no declarados son rechazados (`forbidNonWhitelisted: true`).
