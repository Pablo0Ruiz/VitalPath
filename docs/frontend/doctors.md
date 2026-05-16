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

- **Directorio:** `GET /doctors`
- **Detalle de perfil:** `GET /doctors/:id`
- **Operaciones CRUD:** `POST /doctors`, `PATCH /doctors/:id` (según los permisos del backend).

## Flujos Típicos

- Un administrador del centro requiere agregar un nuevo médico a la plantilla de Cardiología.
- Ingresa a `/doctors`, utiliza el formulario de alta ingresando nombre, colegiatura y especialidad.
- Tras el guardado, el nuevo médico ya es elegible para ser seleccionado en el módulo de `schedule` y `appointments`.
