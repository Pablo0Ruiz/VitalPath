# Módulo: Health

**Ubicación:** `apps/api/src/health`

Endpoint de validación de vida ("liveness probe"), extremadamente útil en entornos de orquestación de contenedores (como Kubernetes) o plataformas PaaS (Koyeb/Render) para verificar que la aplicación NestJS está disponible y el servidor HTTP responde a las peticiones.

## Endpoints

### 1. Health Check (Liveness Probe)

- **Método:** `GET`
- **Ruta:** `/api/health`
- **Autorización:** Ninguna (Público).
- **Rate Limiting:** Este controlador omite el rate limiting global de la API utilizando el decorador `@SkipThrottle()`.
- **Respuesta Exitosa:** `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2026-05-14T00:00:00.000Z"
}
```
