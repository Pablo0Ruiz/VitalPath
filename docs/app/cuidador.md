# Cuidador Familiar — App Móvil VitalPath

---

## Propósito del rol

El `CUIDADOR_FAMILIAR` es un usuario que acompaña a uno o más pacientes vinculados. Su acceso es de lectura delegada: puede ver las citas y datos de sus pacientes vinculados, pero no puede crear citas, acceder a resultados de estudios médicos propios ni interactuar con el sistema clínico de forma directa.

El rol está diseñado para que un familiar (hijo, cónyuge, cuidador contratado) pueda estar informado del estado de salud del paciente mayor sin comprometer la privacidad ni el control del propio paciente.

---

## Registro

### Ruta: `/(auth)/register-cuidador`

Pantalla de registro específica para el rol cuidador. No usa el flujo de registro por pasos (`register/step-2`, `step-3`) del paciente: es un formulario único.

**Campos del formulario:**

| Campo             | Tipo   | Validación                  |
| ----------------- | ------ | --------------------------- |
| `name`            | string | Requerido                   |
| `lastName`        | string | Requerido                   |
| `fechaNacimiento` | string | Formato `DD/MM/AAAA`        |
| `genero`          | enum   | Masculino / Femenino / Otro |
| `email`           | string | Formato email válido        |
| `password`        | string | Mínimo 6 caracteres         |

**Hook:** `useRegisterCuidador` de `@repo/api-client`. Asigna `role: 'cuidador_familiar'` automáticamente.

**Endpoint:** `POST /auth/register-cuidador`

Al registrarse con éxito, el token de sesión se almacena y la app redirige a `ROUTES.HOME`.

---

## Vinculación con un paciente

### Flujo general

```
PACIENTE genera código de 6 dígitos
    │
    │  (pantalla: /(drawer)/cuidadores)
    │  Código visible en pantalla · válido 15 minutos
    │
    ▼
CUIDADOR ingresa el código + tipo de vínculo
    │
    │  (pantalla: /(drawer)/vincular)
    │
    ▼
Backend valida código y activa el vínculo
    │
    ▼
Estado de la vinculación: ACTIVO
```

### Pantalla del paciente: `/(drawer)/cuidadores`

El paciente gestiona sus cuidadores desde esta pantalla:

- Genera un código de 6 dígitos pulsando "Generar código".
- El código se muestra en pantalla con su hora de expiración (válido 15 minutos).
- Puede generar un nuevo código si el anterior expiró.
- Lista todos sus cuidadores vinculados (`VinculacionConCuidador[]`).
- Puede revocar el acceso de cualquier cuidador con confirmación.

**Hooks utilizados:**

- `useGenerarCodigo()` — `POST /vinculacion/generar-codigo`
- `useMisCuidadores()` — `GET /vinculacion/mis-cuidadores`
- `useRevocarVinculacion()` — `PATCH /vinculacion/:id/revocar`

### Pantalla del cuidador: `/(drawer)/vincular`

El cuidador ingresa el código que le compartió el paciente:

- Campo numérico de 6 dígitos con estilo grande (`fontSize: 28, letterSpacing: 8`).
- Selector de tipo de vínculo: `Hijo/a`, `Esposo/a`, `Cuidador contratado`, `Otro`.
- Al completar la vinculación correctamente se muestra una alerta de éxito y vuelve a la pantalla anterior.

**Errores manejados en pantalla:**

| Código de error     | Mensaje mostrado al usuario                     |
| ------------------- | ----------------------------------------------- |
| `CODE_EXPIRED`      | El código expiró. Pedí uno nuevo a tu familiar. |
| `CODE_ALREADY_USED` | Este código ya fue utilizado.                   |
| `ALREADY_LINKED`    | Ya estás vinculado con este paciente.           |
| (genérico)          | Código inválido o no encontrado.                |

**Hook:** `useVincular()` — `POST /vinculacion/vincular`

---

## Lista de pacientes vinculados: `/(drawer)/pacientes`

Pantalla exclusiva del cuidador. Muestra todos los pacientes con estado de vínculo `ACTIVO`.

- Botón "Vincular nuevo paciente" que navega a `/(drawer)/vincular`.
- Lista de `VinculacionConPaciente[]` renderizada con `PacienteRow`.
- Estado vacío con acción directa de vinculación.

**Hook:** `useMisPacientes()` — `GET /vinculacion/mis-pacientes`

---

## Estado global: `useActivePacienteStore`

**Ubicación:** `apps/vitalpath/src/stores/activePaciente.ts`  
**Implementación base:** `packages/store/src/activePaciente.store.ts`

El store persiste qué paciente tiene seleccionado el cuidador en este momento. Usa Zustand con persistencia (AsyncStorage en mobile).

```typescript
interface ActivePacienteState {
  activePacienteId: string | null;
  activePacienteNombre: string | null;
  _hasHydrated: boolean;
  setActivePaciente: (payload: { id: string; nombre: string }) => void;
  clearActivePaciente: () => void;
  setHasHydrated: () => void;
}
```

**Clave de persistencia:** `'active-paciente-store'`

Solo se persisten `activePacienteId` y `activePacienteNombre` (no el estado de hidratación).

---

## Hook: `useActivePatientId()`

**Ubicación:** `apps/vitalpath/src/hooks/useActivePatientId.ts`

Es el punto de acceso centralizado al ID del paciente activo. Cualquier pantalla o hook que necesite el ID del paciente para hacer un fetch debe usarlo.

```typescript
interface ActivePatientIdResult {
  patientId: string | null; // ID a usar en los fetches
  isCuidador: boolean; // true si el usuario autenticado es cuidador_familiar
  needsSelection: boolean; // true si es cuidador y no tiene paciente seleccionado
}
```

**Lógica:**

- Si el usuario es `PACIENTE`: devuelve `user._id` directamente (nunca necesita selección).
- Si el usuario es `CUIDADOR_FAMILIAR`: devuelve `activePacienteId` del store. Si es `null`, `needsSelection` es `true`.

---

## Componentes de UI para el cuidador

### `EmptyPacienteActivoState`

**Ubicación:** `apps/vitalpath/src/components/ui/molecules/EmptyPacienteActivoState/`

Se muestra en el home del cuidador cuando `needsSelection === true` (no tiene paciente activo seleccionado). Invita al usuario a abrir el menú lateral para elegir un paciente.

```
[Icono user-plus]
Seleccioná un paciente
Elegí desde el menú a quién querés acompañar para ver sus datos.
[Abrir menú]  ← abre el Drawer
```

### `PacienteActivoSelector`

**Ubicación:** `apps/vitalpath/src/components/ui/molecules/PacienteActivoSelector/`

Barra horizontal de chips que aparece en el home y en medications cuando el usuario es `CUIDADOR_FAMILIAR`. Muestra todos los pacientes vinculados activos como chips seleccionables.

- El chip del paciente activo se muestra con `variant='primary'`.
- Al tocar un chip, se llama a `setActivePaciente({ id, nombre })` y navega al home.
- Si no hay pacientes vinculados, muestra un chip "Vincular paciente" que navega a `/(drawer)/vincular`.
- Devuelve `null` para usuarios que no sean `cuidador_familiar`.

---

## Reglas de acceso a datos

| Dato                           | CUIDADOR accede  | Cómo                                        |
| ------------------------------ | ---------------- | ------------------------------------------- |
| Citas del paciente vinculado   | Sí (lectura)     | `GET /appointment/cuidador?pacienteId={id}` |
| Medicamentos del paciente      | Sí (lectura)     | `GET /medications/patient/:id`              |
| Resultados de estudios         | No               | —                                           |
| Historial clínico del paciente | No               | —                                           |
| Datos de perfil del paciente   | Parcial (nombre) | Expuesto en `VinculacionConPaciente`        |

El cuidador **solo** puede acceder a datos del paciente que tenga seleccionado en `useActivePacienteStore`. Todos los hooks de datos pasan el `patientId` obtenido de `useActivePatientId()` y tienen `enabled: !!id` para no ejecutarse si no hay selección activa.

---

## Ejemplos de hooks con contexto de cuidador

### `useMedicationsByPatient`

```typescript
// packages/api-client/src/hooks/useMedication.ts
export const useMedicationsByPatient = (id?: string) => {
  return useQuery<Medication[]>({
    queryKey: [...medicationKeys.all, 'patient', id],
    queryFn: () => getMedicationsByPatient(id!),
    enabled: !!id, // ← no ejecuta si id es undefined/null
    staleTime: 300_000,
  });
};
```

Usado en la pantalla de medicamentos cuando el usuario activo es cuidador. Recibe el `patientId` de `useActivePatientId()`.

### Citas del cuidador

```
GET /appointment/cuidador
GET /appointment/cuidador?pacienteId={activePacienteId}

Response 200: Cita[]
```

Devuelve las citas de todos los pacientes vinculados al cuidador. Con `pacienteId` filtra por el paciente activo.
