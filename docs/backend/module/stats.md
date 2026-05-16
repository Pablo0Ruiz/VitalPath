# Módulo: Stats

**Ubicación:** `apps/api/src/stats`

Permite a los administradores generar vistas agregadas y estadísticas de la plataforma (por ejemplo, citas de la semana, cantidad de pacientes activos, etc).

## Endpoints

### 1. Obtener Resumen Estadístico

- **Método:** `GET`
- **Ruta:** `/stats/summary`
- **Autorización:** Autenticado, requiere roles `ADMIN` o `TRABAJADOR_CENTRO`.
- **Respuesta Exitosa:** `200 OK`. Objeto `StatsSummaryDto` con métricas globales del uso de la aplicación, como la distribución de citas por estado y conteos generales.
