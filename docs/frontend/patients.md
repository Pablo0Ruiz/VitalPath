# Módulo de Pacientes (`patients` y `register-patient`)

## Propósito

Permitir la visualización, búsqueda, edición y alta de los registros médicos y perfiles de pacientes en el sistema VitalPath. Es un módulo de uso constante tanto por administradores como por médicos.

## Rutas / Páginas Principales

- **`/patients`**: Listado y buscador de pacientes.
- **`/patients/[id]`**: Vista detallada de la historia clínica, alergias, o tratamientos de un paciente específico.
- **`/register-patient`**: Formulario especializado (posiblemente wizard/multi-paso) para dar de alta a un paciente en el sistema de manera asistida.

## Componentes Clave

- **PatientTable / SearchBar:** Para filtrar y paginar eficientemente grandes cantidades de pacientes.
- **PatientProfile / ClinicalHistory:** Componentes que agrupan y estructuran los antecedentes médicos (usualmente en pestañas o _tabs_).
- **RegisterForm (en register-patient):** Formularios extensos que validan estrictamente datos sensibles y requeridos (contacto, historial base) utilizando Zod.

## Llamadas a la API

> **Nota:** No existe un controlador `/patients` en el backend. Las rutas de gestión de pacientes están distribuidas entre varios módulos.

| Acción                                 | Endpoint real                              | Roles requeridos                       |
| -------------------------------------- | ------------------------------------------ | -------------------------------------- |
| Registrar nuevo paciente               | `POST /api/auth/register-patient`          | `ADMIN`, `TRABAJADOR_CENTRO`           |
| Ver detalle de un paciente             | `GET /api/user/patients/:id`               | `MEDICO`, `TRABAJADOR_CENTRO`, `ADMIN` |
| Listar pacientes del centro            | `GET /api/user/center-patients`            | `ADMIN`, `TRABAJADOR_CENTRO`           |
| Ver resultados médicos de un paciente  | `GET /api/storage/resultado/pacientes/:id` | Autenticado con acceso al paciente     |
| Ver pacientes de un médico (vía citas) | `GET /api/appointment/allCitasMedico`      | `MEDICO`                               |

La página `/patients` en el frontend usa `useCitasMedico()` para derivar la lista de pacientes únicos a partir de las citas del médico autenticado, deduplicando por `paciente_ID._id`.

## Flujos Típicos

- **Listado de pacientes (médico):** Al ingresar a `/patients`, el componente `PatientList` llama a `GET /api/appointment/allCitasMedico`, obtiene las citas del médico y deduplica los pacientes por ID. Se puede filtrar por nombre y por estado de la cita.
- **Registro asistido:** Un nuevo paciente llega a la clínica. El personal administrativo usa `/register-patient`, que llama a `POST /api/auth/register-patient`. Al completar, se redirige a `/patients/[id]` del paciente recién creado.
- **Detalle del paciente:** Desde la lista, se navega a `/patients/[id]`. El componente llama a `GET /api/user/patients/:id` para obtener el perfil y a `GET /api/storage/resultado/pacientes/:id` para los estudios médicos.
