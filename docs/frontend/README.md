# VitalPath - Frontend Web

Bienvenido a la documentación del frontend web de VitalPath. Este proyecto está construido con **Next.js** y utiliza el **App Router**. Forma parte de un monorepositorio (Turborepo) y se encarga de proporcionar la interfaz principal de administración y portal para médicos y trabajadores del centro.

## Visión General

El frontend es la herramienta principal para la gestión de citas, pacientes, médicos y reportes del sistema VitalPath AI. Su propósito es proveer una interfaz rápida, segura y reactiva.

### Características principales:

- **Next.js (App Router):** Enrutamiento avanzado, Server Components y layouts anidados.
- **Tailwind CSS:** Para el sistema de diseño y utilidades.
- **React Query & Axios:** Para la gestión de peticiones asíncronas y caché.
- **Zustand:** Manejo del estado global de la aplicación.
- **React Hook Form + Zod:** Manejo y validación de formularios fuertemente tipados.

## Casos de Uso y Flujo General

1. **Autenticación:** El usuario (médico, admin o trabajador de centro) inicia sesión.
2. **Dashboard:** Tras acceder, se le redirige al panel de control que resume las métricas y citas del día.
3. **Gestión Operativa:** Los usuarios pueden navegar por distintos módulos (Pacientes, Médicos, Citas, Reportes) según su nivel de acceso.
4. **Cierre de Sesión:** El token se invalida y los datos en memoria se limpian por completo.

## Módulos Principales

La aplicación se divide lógicamente en dos áreas de enrutamiento:

- `(auth)`: Contiene las rutas públicas, principalmente el inicio de sesión (`/login`).
- `(portal)`: Rutas protegidas que requieren autenticación, incluyendo:
  - **Dashboard:** Resumen general.
  - **Appointments:** Gestión de citas.
  - **Doctors / Patients:** Gestión de personal médico y pacientes (incluyendo registro).
  - **Reports:** Informes de analítica.
  - **Schedule:** Horarios y agendas.

## Requisitos y Configuración Local

### Prerrequisitos

- **Node.js:** v20 o superior.
- **Gestor de paquetes:** pnpm (recomendado al ser monorepositorio).

### Instalación y Ejecución

Dado que es un monorepositorio, la forma más común de levantarlo es desde la raíz, pero si estás posicionado en `apps/web`:

```bash
# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm run dev
```

El servidor estará disponible en `http://localhost:3000`.

### Variables de Entorno

Crea un archivo `.env` o `.env.local` en `apps/web` con las siguientes variables principales (las reales dependen del entorno):

```env
# URL de la API del backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Secreto para verificar JWT en el middleware (debe coincidir con el backend)
JWT_SECRET=tu_super_secreto_aqui
```
