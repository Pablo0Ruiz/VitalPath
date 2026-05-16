# Módulo: Hospitals

**Ubicación:** `apps/api/src/hospitals`

Este módulo se centra en la gestión de centros médicos (Hospitales, Clínicas) y en el reclutamiento e invitación del personal médico.

## Endpoints

### 1. Crear Hospital

- **Método:** `POST`
- **Ruta:** `/hospitals`
- **Autorización:** Requerido (`@Auth()`), solo con roles `ADMIN` o `TRABAJADOR_CENTRO`.
- **Cuerpo:** `CreateHospitalDto` (información del centro).
- **Respuesta Exitosa:** `201 Created`
- **Respuestas de Error:** `403 Forbidden` (Si un paciente intenta registrar un hospital).

### 2. Invitar Médico a un Hospital

- **Método:** `POST`
- **Ruta:** `/hospitals/doctors/:doctorId/invite`
- **Autorización:** Requerido (`@Auth()`), roles `ADMIN` o `TRABAJADOR_CENTRO`.
- **Parámetros de Ruta:** `doctorId` (ID del médico a invitar).
- **Cuerpo (Body):**
  - Opcional: `{ "hospitalId": "..." }` para ligar el doctor a un centro específico.
- **Respuesta Exitosa:** `201 Created`
- **Comportamiento:** Emite un enlace o código de invitación para que el médico finalice su registro desde el cliente.

### 3. Obtener Todos los Médicos

- **Método:** `GET`
- **Ruta:** `/hospitals/doctors`
- **Autorización:** Autenticado (`@Auth()`) general.
- **Respuesta Exitosa:** `200 OK`. Retorna la lista de médicos registrados en el sistema, lo cual es útil para que los pacientes o trabajadores centro puedan agendar citas.
