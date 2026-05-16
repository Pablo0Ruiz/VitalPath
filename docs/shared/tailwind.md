# @repo/tailwind-config

El paquete `@repo/tailwind-config` centraliza el sistema de diseño (Design System) del proyecto.

## Propósito

- Evitar duplicación de variables de colores, tipografías y sombras.
- Proveer una configuración base de Tailwind para proyectos Web y configuraciones nativas compatibles con NativeWind para React Native.

## API Pública

- **`/web`**: Exporta `tailwind.web.ts` (Configuración estándar para Next.js).
- **`/native`**: Exporta `tailwind.native.js` (Preset para NativeWind en Expo).
- **`/colors.css`, `/dark.css`, `/light.css`**: Variables CSS base y temas.

## Consumo y Uso

**Proyectos que lo usan**: Frontend (`apps/web`) y App Móvil (`apps/vitalpath`).

### Ejemplo de Uso (Next.js)

```typescript
// En tailwind.config.ts de apps/web
import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config/web';

const config: Pick<Config, 'presets'> = {
  presets: [sharedConfig],
};
export default config;
```
