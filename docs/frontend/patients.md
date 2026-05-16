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

- **Listado:** `GET /patients?page=1&search=...`
- **Detalle:** `GET /patients/:id`
- **Registro:** `POST /patients` (Cuerpo: `{ nombre, fechaNacimiento, ... }`)
- **Actualización:** `PATCH /patients/:id`

## Flujos Típicos

- **Búsqueda rápida:** El usuario administrativo utiliza la barra de búsqueda en `/patients` tecleando parte del nombre o apellido del paciente, y presiona enter. El componente realiza peticiones de búsqueda y muestra la tabla de resultados actualizados dinámicamente.
- **Registro asistido:** Un nuevo paciente llega a la clínica; se usa `/register-patient`. El sistema valida paso a paso. Al completar, se le redirige al `/patients/[id]` del recién creado para programarle una cita inmediata.
