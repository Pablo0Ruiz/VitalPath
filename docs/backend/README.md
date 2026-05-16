# VitalPath - Documentación de la API Backend (NestJS)

Bienvenido a la documentación de la API REST de VitalPath. Esta API está desarrollada con **NestJS** y sirve como el núcleo central del sistema, gestionando la comunicación entre la aplicación móvil, el dashboard web y la base de datos (MongoDB).

## Visión General y Propósito

VitalPath es una plataforma diseñada para digitalizar y optimizar procesos de salud. El propósito de la API backend es:

- Procesar y gestionar citas médicas, pacientes, hospitales y medicamentos.
- Proveer un sistema seguro de autenticación y autorización basado en roles (`paciente`, `medico`, `trabajador_centro`, `admin`).
- Integrarse con servicios de Inteligencia Artificial (Groq) para ofrecer funcionalidades de chat de soporte clínico y transcripción de voz.
- Gestionar almacenamiento de resultados médicos y archivos a través de Supabase.

## Casos de Uso Principales

1. **Gestión de Citas Médicas:** Permite a los pacientes agendar citas, y a los médicos/trabajadores visualizarlas y gestionar sus estados.
2. **Historial y Medicamentos:** Los pacientes pueden gestionar su lista de medicamentos y registrar su estado de ánimo diario.
3. **Análisis con IA (Groq):** Ofrece un asistente de chat impulsado por inteligencia artificial para ayudar tanto a pacientes como a personal médico, admitiendo entrada por texto y voz.
4. **Almacenamiento de Resultados (Supabase):** Carga, visualización y generación de resúmenes de resultados médicos.
5. **Administración de Hospitales:** Invitar a médicos, registrar hospitales y obtener reportes agregados.

## Módulos Principales (Resumen)

El proyecto está estructurado de manera modular siguiendo las buenas prácticas de NestJS. Aquí los más destacados:

- **AuthModule:** Gestión de la autenticación, rotación de tokens (refresh tokens) y autorización.
- **UserModule:** Gestión de perfiles de usuario y notificaciones push.
- **AppointmentModule:** CRUD y cambio de estado de las citas médicas.
- **MedicationsModule:** Gestión del tratamiento médico del paciente.
- **HospitalsModule:** Administración de centros de salud y sus médicos.
- **GroqModule:** Integración con la API de IA de Groq (transcripción de audio y chats).
- **SupabaseModule:** Almacenamiento seguro de archivos y resultados médicos.
- **MoodModule & StatsModule:** Registro de ánimos diarios y estadísticas de la plataforma.

## Empezando Rápido (Quick Start)

Para ejecutar la API localmente, necesitas:

1. Clonar el repositorio.
2. Copiar el archivo `.env.example` a `.env` y configurar las variables requeridas (como `MONGO_URI`, `JWT_SECRET`, las credenciales de `SUPABASE`, y las API Keys de `GROQ`).
3. Instalar dependencias e iniciar el servidor:

```bash
cd apps/api
npm install
npm run start:dev
```

### Swagger UI

Una vez ejecutada la aplicación (por defecto en el puerto `3000`), puedes acceder a la especificación OpenAPI generada por Swagger en:
`http://localhost:3000/docs`

Allí podrás ver interactivamente todos los endpoints, modelos (DTOs) requeridos y respuestas esperadas, además de poder probar peticiones insertando tu token JWT en el botón "Authorize".

---

**Navega por el resto de la documentación:**

- [Arquitectura de la API](architecture.md)
- [Seguridad](security.md)
- [Privacidad y Manejo de Datos](privacy.md)
- Documentación específica de módulos: [Auth](auth.md), [Citas](appointment.md), [IA (Groq)](groq.md), etc.
