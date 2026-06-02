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

### 2. Version Check

- **Método:** `GET`
- **Ruta:** `/api/health/version-check`
- **Autorización:** Ninguna (Público).
- **Rate Limiting:** Omitido via `@SkipThrottle()` a nivel de clase.
- **Query Params:** `?version={semver}` (requerido) — versión semver enviada por la app móvil (ej. `?version=1.2.0`).
- **Comportamiento:** Compara la versión recibida contra la variable de entorno `MIN_APP_VERSION` usando semver. Si la versión es mayor o igual al mínimo, responde `ok`; si es menor, responde `blocked`.
- **Respuesta Exitosa:** `200 OK`

```json
{
  "status": "ok",
  "minVersion": "1.0.0"
}
```

O cuando la app está bloqueada:

```json
{
  "status": "blocked",
  "minVersion": "1.2.0"
}
```

- **Uso:** La app móvil llama a este endpoint en el arranque. El componente `VersionGate` lee la respuesta y, si `status === 'blocked'`, bloquea la interfaz e impide el acceso hasta que el usuario actualice la app.
