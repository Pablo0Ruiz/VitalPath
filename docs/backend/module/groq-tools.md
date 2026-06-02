# Módulo: Groq Tools

**Ubicación:** `apps/api/src/groq-tools`

El módulo `GroqTools` implementa el sistema de herramientas (tool use) que el asistente de IA usa para acceder a datos reales del sistema. Cada rol tiene un conjunto de herramientas diferente: esto garantiza que la IA solo pueda leer o escribir datos que el usuario autenticado tiene permiso de ver.

## Arquitectura general

```
GroqService.chatStream(userId, role)
    │
    ├── groqToolsService.getToolsFor(userId, role)
    │       └── retorna un ToolSet (Vercel AI SDK)
    │
    └── chatPromptStreamUseCase({ tools, ... })
            └── pasa el ToolSet a la API de Groq
```

El `GroqToolsService` es el único punto de entrada para resolver herramientas. `GroqService` lo usa en cada conversación para obtener el `ToolSet` correcto según el rol del usuario.

## Método principal: `getToolsFor`

```typescript
getToolsFor(userId: string, role: UserRoles): ToolSet
```

| Rol                 | Herramientas incluidas                                   |
| ------------------- | -------------------------------------------------------- |
| `PACIENTE`          | `appointmentTools` + `medicosTools` + `patientDataTools` |
| `MEDICO`            | `doctorTools` + `medicosTools`                           |
| `TRABAJADOR_CENTRO` | `workerTools`                                            |
| (cualquier otro)    | `{}` — sin herramientas                                  |

---

## Archivos de herramientas

### `appointment-tools.ts` — Gestión de citas (PACIENTE)

Permite al asistente crear, listar, actualizar y cancelar citas en nombre del paciente autenticado. El `userId` se cierra en el closure: la IA no puede actuar sobre citas de otro usuario.

| Herramienta          | Descripción                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `createAppointment`  | Agenda una nueva cita con `medico_ID`, `centroSalud_ID`, `fecha`, `hora` |
| `getAppointments`    | Lista todas las citas del paciente actual                                |
| `getAppointmentById` | Obtiene el detalle de una cita por ID                                    |
| `updateAppointment`  | Modifica los campos de una cita existente                                |
| `cancelAppointment`  | Cancela una cita por ID                                                  |

---

### `patient-data-tools.ts` — Datos del paciente (PACIENTE)

Permite al asistente consultar los estudios médicos del paciente autenticado.

| Herramienta      | Descripción                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| `getMisEstudios` | Retorna los `resultadosEstudio` del perfil del paciente (con resumen IA) |

---

### `medicos-tools.ts` — Directorio médico (PACIENTE + MEDICO)

Disponible para pacientes y médicos. Permite al asistente consultar el directorio de médicos y centros de salud del sistema.

| Herramienta       | Descripción                                  |
| ----------------- | -------------------------------------------- |
| `getDoctors`      | Lista todos los médicos disponibles          |
| `getCentrosSalud` | Lista todos los centros de salud disponibles |

> El paciente necesita esta herramienta para que la IA pueda ayudarle a elegir un médico al crear una cita.

---

### `doctor-tools.ts` — Vista clínica del médico (MEDICO)

Permite al asistente acceder a la agenda y a los datos del paciente asociado a una cita, desde la perspectiva del médico.

| Herramienta       | Descripción                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `getMisCitas`     | Lista todas las citas asignadas al médico autenticado             |
| `getPacienteData` | Obtiene los datos del paciente asociado a una cita (por `citaId`) |

---

### `worker-tools.ts` — Gestión administrativa (TRABAJADOR_CENTRO)

Permite al asistente ver y gestionar todas las citas del centro médico, sin restricción de ownership.

| Herramienta            | Descripción                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `getAllCitas`          | Lista todas las citas de todos los pacientes del centro                 |
| `actualizarEstadoCita` | Avanza el estado de una cita (`AGENDADA → ASISTIDA → ... → COMPLETADA`) |
| `getPacienteData`      | Obtiene los datos del paciente de una cita por ID                       |

---

## Seguridad por roles

El check de rol ocurre en `GroqToolsService.getToolsFor()` antes de retornar el `ToolSet`. Si el rol no coincide con ningún caso conocido, el método retorna `{}` (sin herramientas), por lo que la IA opera en modo solo-conversación sin acceso a datos del sistema.

El `userId` se cierra en cada closure de herramienta en el momento de construir el `ToolSet`. Esto significa que incluso si la IA generara un argumento incorrecto, las llamadas a los servicios de aplicación solo operan con el `userId` del usuario autenticado — nunca con uno externo.

## Integración con Vercel AI SDK

Las herramientas usan el helper `tool()` de la librería `ai` (Vercel AI SDK). El `inputSchema` está definido con Zod. El tipo de retorno es `ToolSet`, que es el tipo que acepta la función `streamText` de la SDK al llamar a la API de Groq.

```typescript
import { tool, type ToolSet } from 'ai';
import { z } from 'zod';

// Ejemplo de definición de herramienta
createAppointment: tool({
  description: 'Agenda una nueva cita médica. El paciente es el usuario autenticado.',
  inputSchema: z.object({
    medico_ID:       z.string(),
    centroSalud_ID:  z.string(),
    fecha:           z.string(), // YYYY-MM-DD
    hora:            z.string(), // HH:mm
  }),
  execute: async (args) => { ... },
}),
```
