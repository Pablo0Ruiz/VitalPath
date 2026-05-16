# @repo/types

El paquete `@repo/types` es la piedra angular del ecosistema de VitalPath para mantener la seguridad de tipos en todo el monorepo.

## Propósito

- Contener todas las interfaces, tipos y enums de TypeScript.
- Definir esquemas de validación de Zod para garantizar que los datos cumplan con las reglas de negocio tanto en clientes como en el servidor.
- Actuar como una capa de dominio o contrato común.

## API Pública

- **Tipos de Usuario/Sesión**: `UserSession`, interfaces de pacientes.
- **Tipos de Arquitectura**: `TokenAdapter` (usado por `api-client`).
- **Esquemas de Validación (Zod)**: Exportados en su propia carpeta `schema/` para validación de DTOs en el NestJS y formularios en React/React Native.

## Consumo y Uso

**Proyectos que lo usan**: Backend (`apps/api`), Frontend (`apps/web`), App Móvil (`apps/vitalpath`) y otros paquetes del monorepo (`@repo/api-client`, `@repo/store`).

### Ejemplo de Uso (Backend NestJS)

```typescript
import { z } from 'zod';
import { CreatePatientSchema } from '@repo/types';

// Usado dentro de un Pipe de validación en NestJS
const result = CreatePatientSchema.parse(payload);
```
