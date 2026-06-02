# Vinculación Paciente-Cuidador (`@repo/types`)

## Propósito

El sistema de vinculación conecta a un **paciente** con su **cuidador familiar** (rol `CUIDADOR_FAMILIAR`) mediante un código numérico de 6 dígitos con expiración temporal. Una vez activo el vínculo, el cuidador puede consultar las citas del paciente sin necesidad de que el paciente comparta sus credenciales.

## Tipos exportados desde `@repo/types`

### `EstadoVinculo`

```typescript
export type EstadoVinculo = 'PENDIENTE' | 'ACTIVO' | 'REVOCADO';
```

| Valor       | Descripción                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `PENDIENTE` | El código fue generado pero el cuidador aún no lo ha usado para vincular |
| `ACTIVO`    | El vínculo está establecido y el cuidador tiene acceso                   |
| `REVOCADO`  | El vínculo fue cancelado manualmente por cualquiera de las partes        |

### `TipoVinculo`

```typescript
export type TipoVinculo =
  | 'HIJO_A'
  | 'ESPOSO_A'
  | 'CUIDADOR_CONTRATADO'
  | 'OTRO';
```

Describe la relación entre el cuidador y el paciente. Es elegido por el cuidador al momento de vincular.

### `Vinculacion`

```typescript
export interface Vinculacion {
  _id: string;
  paciente_id: string;
  cuidador_id: string | null;
  tipo_vinculo: TipoVinculo | null;
  estado_vinculo: EstadoVinculo;
  createdAt: string;
  updatedAt: string;
}
```

Entidad base donde `paciente_id` y `cuidador_id` son IDs de Mongo sin poblar.

### `VinculacionUserPopulated`

```typescript
export interface VinculacionUserPopulated {
  _id: string;
  name: string;
  lastName: string;
  fotoPerfil?: string;
  fechaNacimiento?: string;
}
```

Subconjunto del perfil de usuario usado cuando el backend popula los IDs de la vinculación.

### `VinculacionConCuidador`

```typescript
export interface VinculacionConCuidador extends Omit<
  Vinculacion,
  'cuidador_id'
> {
  cuidador_id: VinculacionUserPopulated;
}
```

Retornada por `GET /api/vinculacion/mis-cuidadores`. El paciente recibe su lista de cuidadores con el perfil populado.

### `VinculacionConPaciente`

```typescript
export interface VinculacionConPaciente extends Omit<
  Vinculacion,
  'paciente_id'
> {
  paciente_id: VinculacionUserPopulated;
}
```

Retornada por `GET /api/vinculacion/mis-pacientes`. El cuidador recibe su lista de pacientes con el perfil populado.

### `VincularPayload`

```typescript
export interface VincularPayload {
  codigo: string;
  tipo_vinculo: TipoVinculo;
}
```

Body enviado al endpoint `POST /api/vinculacion/vincular` para establecer el vínculo usando el código del paciente.

### `GenerarCodigoResponse`

```typescript
export interface GenerarCodigoResponse {
  codigo: string;
  expireAt: string; // ISO 8601 timestamp
}
```

Respuesta de `POST /api/vinculacion/generar-codigo`. El paciente recibe el código de 6 dígitos y su fecha de expiración.

## Endpoints del backend relacionados

| Acción                            | Método | Endpoint                          | Rol requerido       |
| --------------------------------- | ------ | --------------------------------- | ------------------- |
| Generar código de vinculación     | POST   | `/api/vinculacion/generar-codigo` | `PACIENTE`          |
| Vincular con código               | POST   | `/api/vinculacion/vincular`       | `CUIDADOR_FAMILIAR` |
| Revocar vínculo                   | PATCH  | `/api/vinculacion/:id/revocar`    | Autenticado         |
| Obtener mis pacientes (cuidador)  | GET    | `/api/vinculacion/mis-pacientes`  | `CUIDADOR_FAMILIAR` |
| Obtener mis cuidadores (paciente) | GET    | `/api/vinculacion/mis-cuidadores` | `PACIENTE`          |

## Uso en la App Móvil (`apps/vitalpath`)

```typescript
import type {
  Vinculacion,
  VinculacionConCuidador,
  VinculacionConPaciente,
  VincularPayload,
  GenerarCodigoResponse,
  TipoVinculo,
  EstadoVinculo,
} from '@repo/types';
import {
  useVinculacion,
  useMisPacientes,
  useMisCuidadores,
  useRegisterCuidador,
} from '@repo/api-client';

// En la pantalla del paciente: generar código para que el cuidador se vincule
const { data: codigo } = useQuery<GenerarCodigoResponse>({
  queryKey: ['generar-codigo'],
  queryFn: postGenerarCodigo,
});

// En la pantalla del cuidador: ver sus pacientes vinculados
const { data: pacientes } = useMisPacientes(); // VinculacionConPaciente[]

// En la pantalla del paciente: ver sus cuidadores
const { data: cuidadores } = useMisCuidadores(); // VinculacionConCuidador[]
```

## Uso en la Web (`apps/web`)

```typescript
import type { VinculacionConPaciente } from '@repo/types';
import { getMisPacientes } from '@repo/api-client';

// En un componente server o cliente del portal web
const pacientes: VinculacionConPaciente[] = await getMisPacientes();
// Acceder al perfil populado del paciente:
pacientes.forEach(v => {
  console.log(v.paciente_id.name, v.estado_vinculo);
});
```
