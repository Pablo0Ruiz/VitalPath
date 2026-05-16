# Privacidad y Manejo de Datos

Este documento describe la política y las prácticas técnicas de privacidad relativas al manejo de datos de usuarios (y datos médicos indirectos) en el cliente frontend.

## Exposición de Datos del Usuario

El frontend web muestra información sensible a la que sólo deben acceder usuarios autorizados. Dependiendo del rol (`admin`, `medico`, `trabajador_centro`), la interfaz limita los datos mostrados.

- **Médicos:** Ven las historias médicas, datos biométricos de los pacientes, citas y reportes clínicos asignados.
- **Administradores:** Visualizan reportes generales, listas de pacientes, doctores e infraestructuras hospitalarias.

## Minimización de Almacenamiento en Cliente

La regla general de privacidad en VitalPath es no confiar en el almacenamiento a largo plazo en el dispositivo o navegador del cliente:

1. **Estado en Memoria:**
   - Los datos de las listas de pacientes, información clínica y configuraciones se mantienen puramente en memoria volátil durante el tiempo de ejecución mediante Zustand o la caché de React Query.
   - Al cerrar la pestaña o recargar, estos datos desaparecen o deben ser solicitados de nuevo con el token válido.
2. **Cookies:**
   - Se guarda en una cookie accesible, un JWT opaco y con caducidad temprana.
   - No se almacenan correos, nombres de paciente o URLs de historiales en las cookies.
3. **Storage APIs (`localStorage`, `sessionStorage`, `IndexedDB`):**
   - No se almacenan datos privados clínicos en `localStorage`. Si se llega a usar, será para temas de experiencia de usuario (por ejemplo, preferencia de "modo oscuro" o colapso del sidebar), totalmente disociados del expediente del paciente.

## Políticas y Cumplimiento

Dado que el entorno médico puede involucrar legislaciones como el RGPD (GDPR) o HIPAA:

- **Ausencia de Tracking:** El portal administrativo no inyecta scripts de marketing ni de tracking de comportamiento de terceros.
- **Anonimización:** Cuando el sistema realiza logs de errores del frontend hacia servicios como Sentry u otros, se aplican filtros (data sanitization) para que los identificadores médicos no viajen en los volcados de error del navegador.
