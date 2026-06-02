# Módulo de Reportes (`reports`)

## Propósito

Proveer una vista consolidada de estadísticas operativas del centro de salud. La página muestra métricas agregadas sobre pacientes, médicos y el estado de las citas, orientada a la toma de decisiones por parte del personal administrativo.

## Rutas / Páginas Principales

- **`/reports`**: Panel de estadísticas del centro. Muestra KPIs generales y un desglose de citas por estado.

## Componentes Clave

- **StatCard:** Tarjetas de KPI que muestran valores numéricos con ícono y etiqueta (total de pacientes, total de médicos, total de check-ins de ánimo).
- **DataTable:** Tabla que lista la distribución de citas por estado (`appointmentsByState`).
- **EmptyState / Skeleton:** Estados de carga y error.

## Fuente de Datos

La página **no** consume endpoints bajo `/reports`. El único origen de datos es:

- **`GET /api/stats/summary`** — Accesible para roles `ADMIN` y `TRABAJADOR_CENTRO`.
- Hook: `useStatsSummary()` del paquete `@repo/api-client`.

La respuesta tiene la forma `StatsSummary`:

```typescript
interface StatsSummary {
  totalPatients: number;
  totalDoctors: number;
  appointmentsByState: Record<string, number>; // ej. { PENDIENTE: 12, CONFIRMADA: 8 }
  totalMoods: number;
}
```

## Capacidades actuales

| Funcionalidad               | Disponible |
| --------------------------- | ---------- |
| Total de pacientes          | Sí         |
| Total de médicos            | Sí         |
| Citas por estado            | Sí         |
| Total de check-ins de ánimo | Sí         |
| Filtro por rango de fechas  | No         |
| Exportación a PDF o CSV     | No         |

## Flujo Típico

1. Un administrador o trabajador de centro ingresa a `/reports`.
2. React Query ejecuta `GET /api/stats/summary` al montar el componente.
3. Mientras carga, se muestran tres `Skeleton` en el grid de KPIs.
4. Al resolverse, los `StatCard` muestran los totales y la `DataTable` despliega la distribución de citas por estado.
