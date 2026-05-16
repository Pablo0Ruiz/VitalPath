# Módulo: Medications

**Ubicación:** `apps/api/src/medications`

Responsable de la creación y gestión de anotaciones libres de medicamentos (lista recordatoria) por parte del paciente para llevar su control personal.

## Endpoints

### 1. Crear Medicamento

- **Método:** `POST`
- **Ruta:** `/medications`
- **Autorización:** Autenticado (`@Auth()`)
- **Cuerpo:** `CreateMedicationDto` (nombre, dosis, frecuencia, horario, etc.).
- **Respuesta Exitosa:** `201 Created`
- **Respuesta de Error Frecuente:** `400 Bad Request` si la validación del DTO falla.

### 2. Obtener Mis Medicamentos

- **Método:** `GET`
- **Ruta:** `/medications`
- **Autorización:** Autenticado (`@Auth()`)
- **Respuesta Exitosa:** `200 OK`. Array de los medicamentos registrados por el paciente autenticado.

### 3. Obtener un Medicamento por ID

- **Método:** `GET`
- **Ruta:** `/medications/:id`
- **Autorización:** Autenticado (`@Auth()`)
- **Parámetro Ruta:** `id` del medicamento.
- **Respuesta Exitosa:** `200 OK`. Detalles de la medicina. `404 Not Found` si el medicamento no existe o no le pertenece al usuario.

### 4. Actualizar Medicamento

- **Método:** `PATCH`
- **Ruta:** `/medications/:id`
- **Autorización:** Autenticado (`@Auth()`)
- **Parámetro Ruta:** `id`.
- **Cuerpo:** `UpdateMedicationDto` (campos a modificar).
- **Respuesta Exitosa:** `200 OK`. Devuelve el objeto actualizado.

### 5. Eliminar Medicamento

- **Método:** `DELETE`
- **Ruta:** `/medications/:id`
- **Autorización:** Autenticado (`@Auth()`)
- **Parámetro Ruta:** `id`.
- **Respuesta Exitosa:** `200 OK`.
