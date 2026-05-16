# Módulo Dashboard (`dashboard`)

## Propósito

El Dashboard o Panel de Control es la pantalla de inicio ("landing page" interna) a la que acceden los usuarios autorizados tras el inicio de sesión. Su objetivo es brindar una visión panorámica e inmediata del estado del sistema, citas programadas para el día y métricas relevantes de la clínica.

## Rutas / Páginas Principales

- **`/dashboard`**: Vista principal que consolida widgets y tablas resumen.

## Componentes Clave

- **Widgets de Resumen (KPIs):** Tarjetas que muestran estadísticas rápidas (ej. cantidad de pacientes hoy, citas canceladas, doctores activos).
- **Lista de Próximas Citas:** Un componente tipo tabla o lista que renderiza las citas más inminentes para permitir acciones rápidas.

## Interacción y Datos

- **Llamadas API comunes:**
  - `GET /stats/daily` o similar (para KPIs).
  - `GET /appointments?date=today&limit=5` (para lista resumida).
- React Query es esencial aquí, ya que el dashboard a menudo monta múltiples peticiones simultáneamente. Se utilizan `useQueries` o llamadas paralelas para que las distintas secciones de la pantalla se carguen independientemente sin bloquearse entre sí.

## Flujos Típicos

1. Un recepcionista o administrador (`trabajador_centro`) ingresa en su turno.
2. Accede directamente a `/dashboard` y ve el número de pacientes esperados para la mañana.
3. Observa la tabla de las citas más próximas y hace clic en una para ver detalles (redirigiéndolo hacia el módulo de `appointments` o `patients`).
