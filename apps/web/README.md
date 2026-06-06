# VitalPath Web Portal

Portal web desarrollado con **Next.js 16** para la plataforma VitalPath AI. Orientado al personal médico y administradores de centros de salud, ofrece una interfaz centralizada para gestionar pacientes, doctores, citas, reportes y auditoría del sistema.

---

## ¿Qué hace?

- Permite a **administradores y doctores** iniciar sesión con credenciales propias
- Ofrece un **dashboard** con métricas clave del centro médico
- Gestiona **citas** desde la perspectiva del centro (vistas de admin y doctor)
- Administra el **registro de pacientes** del centro
- Permite **registrar nuevos pacientes** directamente desde el portal
- Gestiona los **doctores** del centro y sus horarios
- Genera **reportes** de salud y uso de la plataforma
- Provee un visor de **logs de auditoría** del sistema

---

## Tech stack

| Herramienta                | Uso                                                              |
| -------------------------- | ---------------------------------------------------------------- |
| Next.js 16 (App Router)    | Framework principal con SSR y routing file-based                 |
| React 19                   | UI con las últimas capacidades de concurrent features            |
| Tailwind CSS v4            | Estilos utilitarios con la nueva API de configuración en CSS     |
| Zustand (`@repo/store`)    | Estado global compartido con la app móvil                        |
| TanStack React Query       | Fetching, caché e invalidación de datos del servidor             |
| Axios (`@repo/api-client`) | Cliente HTTP con interceptores de autenticación                  |
| React Hook Form + Zod      | Formularios con validación tipada en cliente                     |
| Hugeicons                  | Librería de iconos consistente en todo el portal                 |
| `jose`                     | Verificación y decodificación de JWT en el servidor (middleware) |
| Vitest + Testing Library   | Tests unitarios y de integración de componentes                  |

---

## Rutas del portal

| Ruta                | Descripción                                     | Acceso         |
| ------------------- | ----------------------------------------------- | -------------- |
| `/login`            | Inicio de sesión para staff y administradores   | Público        |
| `/dashboard`        | Resumen general y métricas del centro           | Admin / Doctor |
| `/appointments`     | Gestión de citas (vistas diferenciadas por rol) | Admin / Doctor |
| `/patients`         | Lista global de pacientes                       | Admin          |
| `/center-patients`  | Pacientes registrados en este centro médico     | Admin / Doctor |
| `/doctors`          | Gestión de doctores del centro                  | Admin          |
| `/register-patient` | Registro de un nuevo paciente                   | Admin          |
| `/schedule`         | Gestión del horario de atención del doctor      | Doctor         |
| `/reports`          | Reportes de salud y estadísticas de uso         | Admin          |
| `/audit-logs`       | Visor del log de auditoría del sistema          | Admin          |

---

## Estructura de código (`src/`)

```
src/
├── adapters/     # Adaptadores de la API (funciones de fetching por dominio)
├── components/   # Componentes reutilizables del portal
├── lib/          # Utilidades, configuración de React Query, clientes
├── providers/    # Providers globales (QueryClient, auth context, etc.)
└── utils/        # Helpers y funciones auxiliares
```

---

## Variables de entorno

Crear un archivo `.env.local` en `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> En producción, esta variable debe apuntar a la URL pública del backend desplegado.

---

## Ejecutar el portal

```bash
# Desarrollo con hot reload
pnpm dev

# Build de producción
pnpm build
pnpm start
```

Desde la raíz del monorepo:

```bash
pnpm --filter web dev
```

El portal queda disponible en `http://localhost:3001` (el puerto puede variar si el 3001 está ocupado).

---

## Tests

```bash
# Tests en modo watch (desarrollo)
pnpm test

# Ejecución única (CI)
pnpm test:run
```

Los tests usan **Vitest** con **Testing Library**. La configuración está en `vitest.config.ts` y el setup global en `vitest.setup.ts`.
