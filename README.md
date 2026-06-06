# VitalPath AI

VitalPath AI es una plataforma de gestión de salud desarrollada como monorepo con **Turborepo** y **pnpm workspaces**. Integra una aplicación móvil para pacientes y cuidadores, un portal web para el personal médico y administradores, y una API REST compartida como backend.

El proyecto fue desarrollado como Capstone para demostrar una solución end-to-end en el dominio de salud digital: desde el seguimiento de medicamentos y citas hasta un asistente de IA conversacional integrado.

---

## Aplicaciones

| App              | Tecnología          | Descripción                                       |
| ---------------- | ------------------- | ------------------------------------------------- |
| `apps/vitalpath` | React Native + Expo | App móvil para pacientes y cuidadores             |
| `apps/web`       | Next.js 16          | Portal web para personal médico y administradores |
| `apps/api`       | NestJS              | API REST backend compartida por ambos clientes    |

Cada aplicación tiene su propio `README.md` con instrucciones específicas de configuración y ejecución.

---

## Paquetes compartidos

| Paquete               | Descripción                                                   |
| --------------------- | ------------------------------------------------------------- |
| `packages/api-client` | Cliente HTTP basado en Axios con adaptadores de autenticación |
| `packages/store`      | Stores de Zustand compartidos entre web y móvil               |
| `packages/types`      | Tipos TypeScript compartidos (modelos de dominio)             |
| `packages/tailwind`   | Configuración de Tailwind CSS compartida                      |
| `packages/config`     | Configuraciones de ESLint, Prettier y TypeScript compartidas  |

---

## Stack tecnológico

| Capa                | Tecnología                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| Mobile              | React Native, Expo SDK 54, Expo Router v6 (file-based), Zustand, React Query |
| Web                 | Next.js 16, React 19, Tailwind CSS v4, Zustand, React Query                  |
| Backend             | NestJS, MongoDB (Mongoose), Passport.js                                      |
| IA                  | Groq API (chat con streaming + function calling)                             |
| Almacenamiento      | Supabase Storage (archivos e imágenes médicas)                               |
| Email               | Brevo (emails transaccionales)                                               |
| Autenticación       | JWT con tokens de acceso y refresh via cookies HttpOnly                      |
| Notificaciones push | Expo Notification Service                                                    |
| Monorepo            | Turborepo + pnpm workspaces                                                  |
| Lenguaje            | TypeScript (en todo el stack)                                                |

---

## Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/) v8 o superior
- Instancia de MongoDB (local o en la nube)
- Proyecto en Supabase
- Cuenta en Groq
- Cuenta en Brevo (para emails transaccionales)

---

## Inicio rápido

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Cada app requiere su propio archivo `.env`. Ver el README de cada una:

- [`apps/api/README.md`](apps/api/README.md) — variables del backend
- [`apps/vitalpath/README.md`](apps/vitalpath/README.md) — variables de la app móvil
- [`apps/web/README.md`](apps/web/README.md) — variables del portal web

### 3. Iniciar todas las apps en paralelo

```bash
pnpm dev
```

O iniciar cada app individualmente:

```bash
# Backend API
pnpm --filter api start:dev

# App móvil
pnpm --filter vitalpath start

# Portal web
pnpm --filter web dev
```

---

## Estructura del monorepo

```
VitalPathAI/
├── apps/
│   ├── api/          # Backend NestJS (REST + Swagger en /docs)
│   ├── vitalpath/    # App móvil React Native / Expo
│   └── web/          # Portal web Next.js
└── packages/
    ├── api-client/   # Cliente HTTP compartido
    ├── config/       # Configuraciones de tooling
    ├── store/        # Estado global compartido (Zustand)
    ├── tailwind/     # Preset de Tailwind compartido
    └── types/        # Tipos TypeScript de dominio
```

---

## Documentación de la API

En modo desarrollo, la API expone documentación interactiva en:

```
http://localhost:3000/docs
```

Generada con Swagger/OpenAPI. Incluye autenticación Bearer JWT para probar endpoints protegidos.
