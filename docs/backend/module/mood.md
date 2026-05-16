# Módulo: Mood

**Ubicación:** `apps/api/src/mood`

Módulo utilizado para que los pacientes lleven un control de su estado de ánimo y síntomas a diario (Daily Check-in).

## Endpoints

### 1. Registrar o Actualizar Estado de Ánimo

- **Método:** `POST`
- **Ruta:** `/mood`
- **Autorización:** Autenticado (`@Auth()`).
- **Cuerpo:** `CreateMoodDto` (fecha, estado general "mood", notas adicionales).
- **Respuesta Exitosa:** `201 Created`. Realiza un "upsert": Si ya existe un registro de ánimo para el día seleccionado, lo actualiza. Si no existe, lo crea.
