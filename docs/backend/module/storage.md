# Módulo: Storage (Resultados de Estudios)

**Ubicación:** `apps/api/src/supabase`  
**Controlador:** `SupabaseController` → prefijo de ruta: `/storage`

El módulo gestiona la subida y consulta de resultados de estudios médicos (archivos, principalmente PDFs) respaldados por Supabase Storage. Cada archivo subido genera un documento `ResultadoEstudio` en MongoDB que registra las referencias al paciente, al médico y a la cita correspondiente.

## Bucket de Supabase

**Nombre del bucket:** `vitalpath-storage`  
Definido en `apps/api/src/supabase/supabase.constants.ts`:

```typescript
export const SUPABASE_CLIENT = 'vitalpath-storage';
```

Los archivos se almacenan bajo la ruta `public/{paciente_ID}/{timestamp}-{nombreOriginal}`. Ejemplo:

```
public/6643a1f.../1748200000000-resultado-ecografia.pdf
```

## Endpoints

### 1. Subir archivo

- **Método:** `POST`
- **Ruta:** `/storage/upload-file`
- **Autorización:** `MEDICO` o `TRABAJADOR_CENTRO`
- **Content-Type:** `multipart/form-data`
- **Respuesta exitosa:** `201 Created`

```
Body (form-data):
  files       ← archivo(s) a subir
  paciente_ID ← ObjectId del paciente
  cita_ID     ← ObjectId de la cita (opcional)
```

**Efectos secundarios al subir:**

1. Sube el archivo a Supabase Storage bajo `public/{paciente_ID}/`.
2. Crea un documento `ResultadoEstudio` en MongoDB con `fileUrl`, `medico_ID`, `paciente_ID` y `cita_ID`.
3. Agrega la referencia del resultado al array `resultadosEstudio` del documento `Patient`.
4. Si se especificó `cita_ID`, avanza el estado de la cita según esta tabla de transiciones:

| Estado actual       | Nuevo estado        |
| ------------------- | ------------------- |
| `ASISTIDA`          | `EN_PROCESO`        |
| `EN_PROCESO`        | `RESULTADOS_LISTOS` |
| `RESULTADOS_LISTOS` | `COMPLETADA`        |

---

### 2. Actualizar notas del médico

- **Método:** `PATCH`
- **Ruta:** `/storage/resultado/:id/notas`
- **Autorización:** `MEDICO` o `TRABAJADOR_CENTRO`
- **Respuesta exitosa:** `200 OK` — devuelve el `ResultadoEstudio` actualizado

```json
Body:
{
  "notasMedico": "Paciente presenta leve inflamación. Se recomienda reposo."
}
```

---

### 3. Mis resultados (vista paciente)

- **Método:** `GET`
- **Ruta:** `/storage/resultado/mis-resultados`
- **Autorización:** `PACIENTE`
- **Respuesta exitosa:** `200 OK` — lista de `ResultadoEstudio[]` del paciente autenticado

Los resultados vienen con `cita_ID` populado (`fecha`, `hora`, `estado`) y `medico_ID` populado (`name`, `lastName`, `especialidad`).

---

### 4. Resultados de un paciente específico (vista staff)

- **Método:** `GET`
- **Ruta:** `/storage/resultado/pacientes/:id`
- **Autorización:** `MEDICO`, `TRABAJADOR_CENTRO` o `ADMIN`
- **Parámetro:** `id` — ObjectId del paciente
- **Respuesta exitosa:** `200 OK` — lista de `ResultadoEstudio[]`

---

### 5. Resumen de todos los resultados (vista médico/worker)

- **Método:** `GET`
- **Ruta:** `/storage/resultado/pacientes`
- **Autorización:** `MEDICO` o `TRABAJADOR_CENTRO`
- **Respuesta exitosa:** `200 OK` — lista de `ResultadoEstudio[]` asociados al médico autenticado

Los resultados vienen con `medico_ID`, `paciente_ID` y `cita_ID` populados con nombre y fecha.

---

### 6. Obtener URL pública de un PDF

- **Método:** `GET`
- **Ruta:** `/storage/get-pdf`
- **Autorización:** `MEDICO`, `TRABAJADOR_CENTRO` o `PACIENTE`
- **Query param:** `path` — ruta relativa o completa del archivo en Supabase
- **Respuesta exitosa:** `200 OK`

```json
{
  "publicUrl": "https://xxx.supabase.co/storage/v1/object/public/vitalpath-storage/public/...",
  "resumen": "Texto generado por IA con el resumen del documento médico."
}
```

Al obtener la URL pública, el servicio descarga el archivo en base64 y lo envía a `GroqService.resumenResultadoEstudio()` para generar un resumen automático con IA. Si Groq no está disponible, devuelve `"Resumen no disponible temporalmente."` sin lanzar error.

---

## Tabla resumen de endpoints

| Método  | Ruta                                | Roles autorizados                         | Código exitoso |
| ------- | ----------------------------------- | ----------------------------------------- | -------------- |
| `POST`  | `/storage/upload-file`              | `MEDICO`, `TRABAJADOR_CENTRO`             | `201`          |
| `PATCH` | `/storage/resultado/:id/notas`      | `MEDICO`, `TRABAJADOR_CENTRO`             | `200`          |
| `GET`   | `/storage/resultado/mis-resultados` | `PACIENTE`                                | `200`          |
| `GET`   | `/storage/resultado/pacientes/:id`  | `MEDICO`, `TRABAJADOR_CENTRO`, `ADMIN`    | `200`          |
| `GET`   | `/storage/resultado/pacientes`      | `MEDICO`, `TRABAJADOR_CENTRO`             | `200`          |
| `GET`   | `/storage/get-pdf`                  | `MEDICO`, `TRABAJADOR_CENTRO`, `PACIENTE` | `200`          |

---

## Entidad: `ResultadoEstudio`

**Colección MongoDB:** colección por defecto de Mongoose (timestamps automáticos).

```typescript
class ResultadoEstudio extends Document {
  cita_ID: Types.ObjectId; // ref: Appointment — opcional
  medico_ID: Types.ObjectId; // ref: User — opcional, inferido de la cita
  paciente_ID: Types.ObjectId; // ref: User — opcional
  fileUrl: string; // ruta completa en Supabase Storage (unique)
  resumenIA: string; // resumen generado por IA (opcional)
  notasMedico: string; // notas escritas por el médico (opcional)
  // timestamps: createdAt, updatedAt
}
```

---

## Integración con notificaciones push

Aunque el módulo `SupabaseService` no llama directamente a `PushNotificationsService`, la subida de un resultado avanza el estado de la cita a `RESULTADOS_LISTOS`. Ese cambio de estado puede disparar notificaciones a través de otros mecanismos del sistema (como el módulo de citas o futuros hooks).

Los cuidadores vinculados al paciente también pueden recibir notificaciones cuando el estado de la cita cambia, vía `VinculacionService.getActiveTokensForPaciente()`.
