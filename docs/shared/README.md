# Documentación de Paquetes Compartidos (`packages/`)

Esta carpeta contiene todos los paquetes compartidos del monorepo de VitalPath. El objetivo principal de mantener una estructura de monorepo con paquetes compartidos es maximizar la reutilización de código, tipos, configuración y lógica de negocio entre los diferentes consumidores del ecosistema (principalmente el backend NestJS, el frontend web Next.js y la app móvil React Native con Expo).

## Propósito

Tener una arquitectura basada en paquetes permite:

- **Single Source of Truth (SSOT)**: Los tipos, esquemas de validación y configuraciones se definen una sola vez.
- **Reutilización de lógica de negocio**: Clientes HTTP, stores de estado global y utilidades se comparten entre la web y la app móvil.
- **Mantenimiento centralizado**: Un cambio en un tipo o cliente de API se refleja en todos los proyectos simultáneamente.
- **Seguridad y consistencia**: La lógica de manejo de tokens e intercepción de peticiones está estandarizada, reduciendo el riesgo de vulnerabilidades.

## Paquetes Disponibles

A continuación, se listan todos los paquetes que se encuentran actualmente en `packages/`:

1. **`@repo/api-client`** (`packages/api-client/`)
   - Cliente HTTP base configurado (basado en Axios).
   - Maneja la inyección de tokens de autenticación y la lógica de refresco (interceptores).
   - Consumido por: Frontend (Next.js) y App Móvil (Expo).

2. **`@repo/config`** (`packages/config/`)
   - Configuraciones compartidas para las herramientas de desarrollo (ESLint, Prettier, TypeScript).
   - Consumido por: Todos los proyectos y paquetes del monorepo.

3. **`@repo/store`** (`packages/store/`)
   - Definición de los stores globales (usando Zustand) para el manejo de estado compartido.
   - Contiene el `auth.store` y el `chatContext.store`.
   - Soporta inyección de adaptadores de almacenamiento para persistir datos tanto en web como en móvil.
   - Consumido por: Frontend (Next.js) y App Móvil (Expo).

4. **`@repo/tailwind-config`** (`packages/tailwind/`)
   - Configuración centralizada de Tailwind CSS, incluyendo definiciones de colores, temas claros/oscuros y configuraciones específicas para web.
   - Consumido por: Frontend (Next.js) y App Móvil (Expo).

5. **`@repo/types`** (`packages/types/`)
   - Tipos de TypeScript e interfaces compartidas.
   - Esquemas de validación (Zod).
   - Consumido por: Backend (NestJS), Frontend (Next.js) y App Móvil (Expo).

## Consumidores del Monorepo

Los paquetes de este directorio están diseñados para ser consumidos por las aplicaciones ubicadas en la carpeta `apps/`:

- **Backend NestJS (`apps/api`)**: Principalmente consume `@repo/types` para mantener las entidades, DTOs y validaciones sincronizadas con los clientes, además de usar `@repo/config`.
- **Frontend Next.js (`apps/web`)**: Consume todos los paquetes: `@repo/types` para tipado, `@repo/api-client` para peticiones HTTP, `@repo/store` para manejar el estado local del usuario, `@repo/tailwind-config` para estilos, y `@repo/config`.
- **App Móvil Expo (`apps/vitalpath`)**: Consume los paquetes de forma similar al frontend web, utilizando adaptadores específicos para React Native (ej. adaptadores de almacenamiento asíncrono para el store, interceptores de API configurados para tokens en el body o storage seguro).
