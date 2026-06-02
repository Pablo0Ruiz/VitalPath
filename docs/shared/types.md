# @repo/types

El paquete `@repo/types` es la piedra angular del ecosistema de VitalPath para mantener la seguridad de tipos en todo el monorepo.

## Propósito

- Contener todas las interfaces, tipos y enums de TypeScript.
- Definir esquemas de validación de Zod para garantizar que los datos cumplan con las reglas de negocio tanto en clientes como en el servidor.
- Actuar como una capa de dominio o contrato común.

## Exports del paquete

El punto de entrada (`src/index.ts`) re-exporta desde tres fuentes:

- `./interface/index` — interfaces y tipos de dominio (detalle abajo)
- `./schema/auth.schema` — esquemas Zod para formularios de autenticación
- `./schema/schema` — esquemas Zod adicionales

## API Pública

### Tipos de autenticación y sesión (`auth.interface.ts`)

| Export                        | Tipo        | Descripción                                                                                                                                                                                    |
| ----------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Role`                        | `type`      | Unión de roles: `'paciente' \| 'cuidador_familiar' \| 'medico' \| 'trabajador_centro' \| 'admin'`                                                                                              |
| `normalizeRole(raw?)`         | `function`  | Normaliza un string a `Role \| null`; retorna `null` si el rol es inválido                                                                                                                     |
| `UserSession`                 | `interface` | Perfil de usuario en sesión (`_id`, `name`, `lastName`, `email`, `role`, `medicaments`, `fechaNacimiento`, `genero`, `seniorMode`)                                                             |
| `TokenAdapter`                | `interface` | Contrato que deben implementar las apps consumidoras para gestionar tokens JWT (`getToken`, `setToken`, `deleteToken`, `getRefreshToken`, `setRefreshToken`, `deleteRefreshToken`, `navigate`) |
| `UserCredentials`             | `type`      | Respuesta del login: `{ accessToken, refreshToken?, user: UserSession }`                                                                                                                       |
| `LoginCredentials`            | `interface` | `{ email, password }`                                                                                                                                                                          |
| `RegisterCredentials`         | `interface` | Campos base para registro de usuario                                                                                                                                                           |
| `RegisterCuidadorCredentials` | `interface` | Extiende el registro base con `role: 'cuidador_familiar'`                                                                                                                                      |

### Tipos de medicamentos (`medication.interface.ts`)

| Export                    | Tipo        | Descripción                                                                                                                       |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `MedicationFrequency`     | `type`      | `4 \| 6 \| 8 \| 12 \| 24` (horas entre dosis)                                                                                     |
| `Medication`              | `interface` | Entidad completa: `_id`, `name`, `description?`, `startTime?`, `frequencyHours`, `durationDays?`, `dosesTaken`, `notificationIds` |
| `CreateMedicationPayload` | `interface` | Payload de creación (todos los campos opcionales excepto `name`)                                                                  |
| `UpdateMedicationPayload` | `interface` | `Partial<CreateMedicationPayload> & { id: string }`                                                                               |
| `TakeMedicationResponse`  | `interface` | `{ medication?: Medication, completed: boolean }` — `completed: true` indica que se tomaron todas las dosis del ciclo             |

### Tipos de vinculación (`vinculacion.interface.ts`)

| Export                   | Tipo        | Descripción                                                              |
| ------------------------ | ----------- | ------------------------------------------------------------------------ |
| `EstadoVinculo`          | `type`      | `'PENDIENTE' \| 'ACTIVO' \| 'REVOCADO'`                                  |
| `TipoVinculo`            | `type`      | `'HIJO_A' \| 'ESPOSO_A' \| 'CUIDADOR_CONTRATADO' \| 'OTRO'`              |
| `Vinculacion`            | `interface` | Entidad de vínculo con IDs como strings                                  |
| `VinculacionConCuidador` | `interface` | `Vinculacion` con `cuidador_id` populado como `VinculacionUserPopulated` |
| `VinculacionConPaciente` | `interface` | `Vinculacion` con `paciente_id` populado como `VinculacionUserPopulated` |
| `VincularPayload`        | `interface` | `{ codigo: string, tipo_vinculo: TipoVinculo }`                          |
| `GenerarCodigoResponse`  | `interface` | `{ codigo: string, expireAt: string }`                                   |

### Otros tipos de dominio

| Export            | Archivo                        | Descripción                                                            |
| ----------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `StatsSummary`    | `stats.interface.ts`           | `{ totalPatients, totalDoctors, appointmentsByState, totalMoods }`     |
| `AuditLog`        | `audit-log.interface.ts`       | `{ _id, action, userId, resourceId, ipAddress?, details?, createdAt }` |
| `AuditLogQuery`   | `audit-log.interface.ts`       | Parámetros de filtro para `GET /audit-logs`                            |
| `IPatientProfile` | `patient-profile.interface.ts` | Perfil simplificado de paciente para listas del centro                 |

### Esquemas Zod (`schema/auth.schema.ts`)

Disponibles para validar formularios en React/React Native:

| Export                   | Uso                                            |
| ------------------------ | ---------------------------------------------- |
| `loginSchema`            | Formulario de inicio de sesión                 |
| `recoverPasswordSchema`  | Formulario de recuperación de contraseña       |
| `registerSchema`         | Registro en 3 pasos (step1 + step2 + step3)    |
| `registerCuidadorSchema` | Registro específico para rol cuidador_familiar |
| `inviteSchema`           | Invitación de médico/trabajador por el admin   |
| `codigoSchema`           | Validación de código numérico de 6 dígitos     |

## Consumo y Uso

**Proyectos que lo usan**: Backend (`apps/api`), Frontend (`apps/web`), App Móvil (`apps/vitalpath`) y otros paquetes del monorepo (`@repo/api-client`, `@repo/store`).

### Ejemplo de Uso (App Móvil / Web)

```typescript
import type { Medication, TakeMedicationResponse, Role } from '@repo/types';
import { normalizeRole } from '@repo/types';

const role: Role | null = normalizeRole(rawRoleFromJWT);

const med: Medication = {
  _id: '...',
  name: 'Ibuprofeno',
  frequencyHours: 8,
  dosesTaken: 2,
  notificationIds: [],
};
```

### Ejemplo de Uso (Validación de formularios)

```typescript
import { registerCuidadorSchema } from '@repo/types';

const result = registerCuidadorSchema.safeParse(formValues);
if (!result.success) {
  // result.error.issues contiene los errores de validación
}
```
