# Arquitectura del Frontend Web

El proyecto sigue una arquitectura modular y escalable basada en el **App Router** de Next.js, diseñada para ser mantenible y separar claramente la lógica de presentación, la gestión de estado y las llamadas a la API.

## Estructura de Directorios

La estructura principal dentro de `apps/web` es la siguiente:

```text
apps/web/
├── app/                  # Rutas de la aplicación (App Router)
│   ├── (auth)/           # Grupo de rutas públicas (Login)
│   ├── (portal)/         # Grupo de rutas protegidas (Dashboard, etc.)
│   ├── layout.tsx        # Layout principal raíz
│   └── globals.css       # Estilos globales de Tailwind
├── src/                  # Código fuente (Lógica y Componentes)
│   ├── adapters/         # Adaptadores (ej. persistencia de tokens)
│   ├── components/       # Componentes de UI (Atómicos y Organismos)
│   ├── lib/              # Utilidades, configuración de API
│   └── providers/        # Proveedores de contexto (React Query, etc.)
├── proxy.ts              # Middleware de seguridad de Next.js
└── vitest.config.ts      # Configuración de testing
```

## Enrutado (App Router)

El sistema de rutas utiliza los **Route Groups** de Next.js (carpetas entre paréntesis como `(auth)`) para no afectar la estructura de las URL, pero permitiendo tener Layouts diferentes.

- **Rutas públicas:** Agrupadas en `(auth)`. No tienen navbar interno ni sidebar del portal.
- **Rutas protegidas:** Agrupadas en `(portal)`. Comparten un layout con navegación lateral, header y verificación de sesión en cliente.

## Comunicación con el Backend

La aplicación se comunica con el backend (NestJS) mediante un paquete interno del monorepositorio llamado `@repo/api-client`, basado en **Axios**.

### Configuración (API Setup)

En `src/lib/api-setup.ts`, el frontend inicializa el cliente HTTP:

1. Fija la URL base según la variable `NEXT_PUBLIC_API_URL`.
2. Asocia el `webTokenAdapter`, responsable de inyectar el token de acceso desde las cookies a cada petición.
3. Activa la interceptación de "silent refresh", que escucha los errores HTTP 401 para intentar renovar la sesión mediante la cookie `httpOnly` del refresh token.

### Data Fetching

El frontend utiliza **TanStack React Query** (`@tanstack/react-query`) sobre las peticiones Axios. Esto proporciona:

- Caché inteligente e invalidación automática.
- Estados declarativos de carga y error (`isLoading`, `isError`).
- Reintentos automáticos configurables.

## Estado Global

Para el estado que necesita ser compartido en varios niveles de componentes, se utiliza **Zustand** (mediante el paquete `@repo/store`). Zustand permite tener un store ligero, libre de boilerplate y sin requerir Providers envolventes para cada fragmento de estado.

La información del usuario en sesión, permisos de interfaz, o configuraciones locales del panel se almacenan aquí y se limpian durante el flujo de logout.
