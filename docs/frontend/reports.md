# Módulo de Reportes (`reports`)

## Propósito

Proveer capacidades analíticas y de exportación de datos sobre la actividad clínica y administrativa de VitalPath. Sirve para la toma de decisiones, auditorías y seguimiento de KPIs a lo largo del tiempo.

## Rutas / Páginas Principales

- **`/reports`**: Panel centralizado de reportes, gráficas y opciones de exportación (ej. informes de citas canceladas, volumen de pacientes atendidos, ingresos, etc.).

## Componentes Clave

- **Charts / Gráficas:** Componentes visuales (usando librerías especializadas o SVGs) para mostrar series de tiempo y distribuciones.
- **DateRangePicker:** Un componente fundamental para filtrar los datos analíticos por periodos (diario, mensual, trimestral).
- **ExportButtons:** Botones que interactúan con APIs para solicitar PDFs, excels (CSV) del reporte generado.

## Llamadas a la API

- **Métricas:** `GET /reports/metrics?startDate=...&endDate=...`
- **Exportación:** `GET /reports/export?format=pdf` (Suele retornar un _Blob_ o un enlace de descarga firmado).

## Flujos Típicos

- El administrador ingresa a `/reports` al final del mes.
- Selecciona el rango de fechas en el `DateRangePicker` del mes que culmina.
- React Query hace fetch de la data y las gráficas se actualizan para mostrar el porcentaje de ocupación médica.
- El usuario hace clic en "Exportar PDF"; el sistema descarga automáticamente el reporte para ser impreso o enviado por correo.
