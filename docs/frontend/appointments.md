# Módulo de Citas (`appointments` y `schedule`)

## Propósito

Este grupo de módulos centraliza todo lo relacionado con la agenda y calendario de consultas médicas de la institución. Permite asignar, reprogramar, cancelar y buscar los turnos de los pacientes.

## Rutas / Páginas Principales

- **`/appointments`**: Listado tabular y buscador avanzado de citas (estado, fecha, paciente).
- **`/schedule`**: Vista orientada a calendario (diario/semanal/mensual) donde se aprecia de forma visual la ocupación horaria de la clínica o de un médico específico.

## Componentes Clave

- **CalendarView / TimeGrid:** Elementos interactivos que permiten ver franjas horarias libres o bloqueadas.
- **AppointmentModal / Form:** Un diálogo o formulario lateral (_drawer_) para crear o editar una cita rápidamente sin perder el contexto visual del calendario.
- **StatusBadges:** Componentes visuales que marcan claramente el estado de una cita (Pendiente, Confirmada, Cancelada, Atendida).

## Llamadas a la API

- **Listado/Filtros:** `GET /appointments?status=pending&date_from=...`
- **Obtención de Horarios Libres:** `GET /schedule/available?doctorId=...`
- **Creación de Cita:** `POST /appointments` enviando `patientId`, `doctorId`, `startTime`, `endTime`.
- **Cambio de estado:** `PATCH /appointments/:id/status` para transiciones rápidas de estado (ej: confirmar llegada del paciente).

## Flujos Típicos

- **Programación desde calendario:** El usuario entra a `/schedule`, busca un día en el calendario visual. Hace clic en un "hueco" en la columna de un cardiólogo. Se abre el `AppointmentModal` con el médico, fecha y hora pre-rellenados. El calendario se actualiza automáticamente mediante la invalidación de caché de React Query.
