# Módulo: Appointment

**Ubicación:** `apps/api/src/appointment`

El módulo de citas ("appointments") gestiona todo el ciclo de vida de una visita médica o procedimiento dentro del hospital, desde la creación por parte de un paciente hasta su conclusión por parte del personal médico.

## Endpoints

### 1. Crear Cita

- **Método:** `POST`
- **Ruta:** `/appointment`
- **Autorización:** Autenticado (`@Auth()`). Actúa como paciente.
- **Cuerpo:** `CreateAppointmentDto` (fecha, hora, motivo de la cita).
- **Respuesta Exitosa:** `201 Created` con el ID de la cita.

### 2. Obtener Mis Citas

- **Método:** `GET`
- **Ruta:** `/appointment`
- **Autorización:** Autenticado (`@Auth()`).
- **Respuesta Exitosa:** `200 OK`. Retorna la lista de todas las citas del paciente autenticado.

### 3. Obtener Todas las Citas (Administrativo)

- **Método:** `GET`
- **Ruta:** `/appointment/allCitas`
- **Autorización:** Autenticado, requiere rol `TRABAJADOR_CENTRO` o `ADMIN`.
- **Respuesta Exitosa:** `200 OK`. Retorna la lista global de citas asociadas a ese centro hospitalario.

### 4. Obtener Citas de un Médico

- **Método:** `GET`
- **Ruta:** `/appointment/allCitasMedico`
- **Autorización:** Autenticado, requiere rol `MEDICO`.
- **Respuesta Exitosa:** `200 OK`. Retorna las citas asignadas al doctor autenticado.

### 5. Obtener Cita por ID

- **Método:** `GET`
- **Ruta:** `/appointment/:id`
- **Autorización:** Autenticado.
- **Parámetros de Ruta:** `id` (ID de la cita).
- **Respuesta Exitosa:** `200 OK`. Retorna los detalles.

### 6. Avanzar Estado de la Cita

- **Método:** `PATCH`
- **Ruta:** `/appointment/:id/estado`
- **Autorización:** Autenticado, requiere rol `TRABAJADOR_CENTRO`.
- **Parámetros de Ruta:** `id`.
- **Cuerpo:** `UpdateCitaEstadoDto` (`estado`).
- **Respuesta Exitosa:** `200 OK`. Actualiza la máquina de estados de la cita (ej. `PENDIENTE` -> `CONFIRMADA`).

### 7. Actualizar Detalles de la Cita

- **Método:** `PATCH`
- **Ruta:** `/appointment/:id`
- **Autorización:** Autenticado.
- **Cuerpo:** `UpdateAppointmentDto` (campos opcionales).
- **Respuesta Exitosa:** `200 OK`.

### 8. Cancelar Cita

- **Método:** `DELETE`
- **Ruta:** `/appointment/:id`
- **Autorización:** Autenticado.
- **Respuesta Exitosa:** `200 OK`. Marca la cita como cancelada o la elimina de forma lógica de la agenda del médico y paciente.
