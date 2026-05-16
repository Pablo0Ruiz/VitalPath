# @repo/config

El paquete `@repo/config` provee configuraciones estandarizadas para las herramientas de desarrollo utilizadas en el monorepo.

## Propósito

- Mantener consistencia en el estilo de código (Linting y Formatting) en todos los desarrolladores y CI/CD pipelines.
- Configurar opciones estrictas y consistentes del compilador TypeScript.

## API Pública

- **`/eslint`**: Presets para ESLint (React, Node, base).
- **`/prettier`**: Configuración unificada de Prettier.
- **`/typescript`**: Archivos `tsconfig.json` base (ej. `base.json`, `nextjs.json`, `react-library.json`).

## Consumo y Uso

**Proyectos que lo usan**: Todos los proyectos y subpaquetes del ecosistema.

### Ejemplo de Uso (Paquete local)

```json
// En tsconfig.json de otro paquete
{
  "extends": "@repo/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```
