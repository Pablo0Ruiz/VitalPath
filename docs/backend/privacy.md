# Privacidad y Manejo de Datos

Dada la naturaleza del sistema (HealthTech), la API de VitalPath trata Datos Personales Identificables (PII) e Información de Salud Protegida (PHI). Por lo tanto, el diseño de la aplicación tiene consideraciones de privacidad por defecto.

## Manejo de Datos Sensibles

1. **Datos Almacenados:**
   - **Perfiles:** Nombre completo, email.
   - **Historial Clínico:** Citas médicas, notas libres de medicamentos (lista recordatoria), registros diarios de estado de ánimo, transcripciones de consultas por IA.
   - **Archivos:** Exámenes médicos en formato PDF almacenados en Supabase Storage.
2. **Protección Criptográfica:**
   - Las contraseñas se encuentran en formato _hash_ asimétrico y _salteadas_ en base de datos.
   - Todo el tráfico ocurre bajo el protocolo HTTPS/TLS de manera forzosa en los despliegues.

## Segregación de Datos y Principio de Privilegio Mínimo

El acceso a los recursos siempre está circunscrito a la pertenencia del recurso:

- **Pacientes:** Un usuario autenticado como paciente (`@GetUser('_id') userId`) únicamente puede solicitar sus propias citas, medicamentos y resultados. Todos los controladores filtran las búsquedas con `userId` para que sea imposible realizar iteraciones e ingresar en registros de otras personas (mitigando Insecure Direct Object References - IDOR).
- **Personal Médico / Trabajadores:** Únicamente los médicos con permisos o administradores asignados al centro pueden ver listas globales de pacientes para operar agendas (`/appointment/allCitas`).

## Trazabilidad y Auditoría

La API incluye un interceptor de registro de auditoría transversal: el `AuditLoggerInterceptor` (en `apps/api/src/common/interceptors`).

- **Mecanismo:** Intercepta todas las peticiones, recopila la IP, el usuario actuante (si está autenticado), el endpoint solicitado, el método y el payload relevante (sanitizando información altamente sensible).
- **Finalidad:** Garantizar la trazabilidad ante accesos no autorizados y proveer registros inmutables requeridos frecuentemente por normativas locales de manejo de datos médicos (GDPR, HIPAA, etc.).

## Anonimización y Entorno de Desarrollo

Se busca la práctica de minimización de datos. En las interacciones con APIs de terceros (Groq), se recomienda, según las políticas internas, que el texto procesado por IA contenga el mínimo PII posible; en el frontend/backend se evitan enviar identificadores del mundo real cuando sólo el contexto clínico es necesario.
Para entornos de desarrollo, no se exponen los dumps de producción localmente sin antes someterlos a anonimización de nombres y direcciones.
