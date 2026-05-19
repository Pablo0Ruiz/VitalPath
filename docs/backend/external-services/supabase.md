# Módulo: Supabase (Almacenamiento y Resultados)

**Ubicación:** `apps/api/src/supabase`

El módulo gestiona la subida segura de archivos hacia el Storage de Supabase (por ejemplo, PDFs de análisis médicos) e interactúa con el registro y resúmenes de resultados de pacientes.

## Endpoints

### 1. Subir Archivos Clínicos

- **Método:** `POST`
- **Ruta:** `/storage/upload-file`
- **Autorización:** Autenticado, requiere roles `TRABAJADOR_CENTRO` o `MEDICO`.
- **Tipo de Contenido:** `multipart/form-data`
- **Campos:**
  - `files`: Archivos a subir.
  - `paciente_ID`: Mongo ObjectId del paciente al que le corresponden los análisis.
  - `cita_ID`: Mongo ObjectId de la cita atada.
- **Respuesta Exitosa:** `201 Created`. Retorna confirmación de subida y metadatos del archivo en la nube.

### 2. Actualizar Notas del Médico de un Resultado

- **Método:** `PATCH`
- **Ruta:** `/storage/resultado/:id/notas`
- **Autorización:** Autenticado, requiere roles `TRABAJADOR_CENTRO` o `MEDICO`.
- **Parámetro Ruta:** `id` del resultado.
- **Cuerpo:** `{ "notasMedico": "Texto descriptivo" }`
- **Respuesta Exitosa:** `200 OK`. El médico o trabajador añade una explicación legible al estudio subido para que el paciente lo comprenda.

### 3. Obtener Mis Resultados (Paciente)

- **Método:** `GET`
- **Ruta:** `/storage/resultado/mis-resultados`
- **Autorización:** Autenticado, exclusivo para rol `PACIENTE`.
- **Respuesta Exitosa:** `200 OK`. Listado de estudios y resúmenes generados para el paciente autenticado.

### 4. Obtener Todos los Resultados (Administrativo)

- **Método:** `GET`
- **Ruta:** `/storage/resultado/pacientes`
- **Autorización:** Autenticado, roles `TRABAJADOR_CENTRO` o `MEDICO`.
- **Respuesta Exitosa:** `200 OK`. Lista administrativa de estudios emitidos o asociados a ese centro o doctor.

### 5. Obtener PDF / URL Pública de Supabase

- **Método:** `GET`
- **Ruta:** `/storage/get-pdf`
- **Autorización:** Autenticado (Cualquier rol).
- **Query Params:** `path` (ruta o nombre del recurso en Supabase).
- **Respuesta Exitosa:** `200 OK`. Retorna la URL firmada o pública para acceder de forma segura al recurso (PDF, imagen) y descargarlo.
