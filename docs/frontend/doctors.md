# Módulo de Médicos (`doctors`)

## Propósito

Permitir la gestión del personal médico (doctores y especialistas) que laboran en el sistema. Este módulo es usualmente accesible solo por perfiles de administración o dirección médica, y sirve para mantener actualizado el directorio, asignaciones, y perfiles profesionales.

## Rutas / Páginas Principales

- **`/doctors`**: Listado y directorio del personal médico.
- **`/doctors/[id]`**: Vista de perfil de un médico, que típicamente muestra sus datos, especialidad, y sus estadísticas o agenda asociada.

## Componentes Clave

- **DoctorList / Grid:** Visualización en formato de tarjetas o tabla para encontrar médicos por nombre o especialidad.
- **DoctorProfile:** Detalles del profesional y opciones de configuración (por ejemplo, habilitar/deshabilitar horarios).

## Llamadas a la API

> **Nota:** No existe un controlador `/doctors` en el backend. Todas las operaciones sobre médicos se realizan bajo el prefijo `/hospitals`.

| Acción                               | Endpoint real                                         | Roles requeridos             |
| ------------------------------------ | ----------------------------------------------------- | ---------------------------- |
| Listar todos los médicos del sistema | `GET /api/hospitals/doctors`                          | Autenticado                  |
| Invitar médico a un hospital         | `POST /api/hospitals/doctors/:doctorId/invite`        | `ADMIN`, `TRABAJADOR_CENTRO` |
| Actualizar horarios de un médico     | `PATCH /api/hospitals/doctors/:doctorUserId/schedule` | `ADMIN`, `TRABAJADOR_CENTRO` |
| Crear un hospital                    | `POST /api/hospitals`                                 | `ADMIN`, `TRABAJADOR_CENTRO` |

La invitación de un médico (`POST /api/hospitals/doctors/:doctorId/invite`) acepta opcionalmente un `hospitalId` en el cuerpo para vincular al médico con un hospital específico. Si se omite, el servicio determina el hospital por contexto.

## Flujos Típicos

- **Directorio de médicos:** Al ingresar a `/doctors`, el componente llama a `GET /api/hospitals/doctors`. La lista muestra todos los médicos registrados en el sistema con su especialidad y avatar.
- **Invitar médico:** Desde el panel de administración, se ingresa el `doctorId` de un usuario con rol `MEDICO` y se llama a `POST /api/hospitals/doctors/:doctorId/invite`. El médico queda vinculado al hospital y disponible para ser asignado en citas.
- **Gestión de horarios:** Desde `/schedule`, el administrador selecciona un médico y edita sus slots disponibles. La acción llama a `PATCH /api/hospitals/doctors/:doctorUserId/schedule` con el nuevo array de slots (full-replace).
