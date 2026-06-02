# Módulo de Gestión de Horarios (`schedule`)

## Propósito

Permitir al administrador visualizar y editar los slots de disponibilidad horaria de cada médico del centro. Es el punto de control central para la configuración de la agenda médica.

## Rutas / Páginas Principales

- **`/schedule`**: Panel dividido en dos paneles: lista de médicos (izquierda) y editor de horarios (derecha).

## Control de Acceso

- **Roles permitidos:** `admin` únicamente.
- Si un usuario con otro rol intenta acceder, es redirigido automáticamente a `/dashboard`.

## Componentes Clave

### DoctorScheduleManager (organism raíz)

Orquesta el layout completo. Mantiene el estado del médico seleccionado (`selectedDoctor: DoctorSession | null`) y coordina los dos paneles.

### DoctorListPanel

- Panel izquierdo de ancho fijo (320px).
- Lista todos los médicos del sistema obtenidos desde `GET /api/hospitals/doctors`.
- Resalta visualmente el médico actualmente seleccionado.
- Al hacer clic en un médico, actualiza `selectedDoctor` en el estado del padre.

### ScheduleEditor

- Panel derecho que ocupa el espacio restante.
- Se monta con `key={selectedDoctor.user._id}` para resetear el estado local al cambiar de médico.
- Muestra el nombre, especialidad y slots actuales del médico seleccionado.
- Permite agregar y eliminar slots de disponibilidad.
- Al guardar, llama a `PATCH /api/hospitals/doctors/:doctorUserId/schedule` con el array completo de slots (full-replace, no merge).

## Llamadas a la API

| Acción                        | Endpoint                                              | Método | Roles requeridos             |
| ----------------------------- | ----------------------------------------------------- | ------ | ---------------------------- |
| Obtener lista de médicos      | `GET /api/hospitals/doctors`                          | GET    | Autenticado                  |
| Actualizar horarios de médico | `PATCH /api/hospitals/doctors/:doctorUserId/schedule` | PATCH  | `ADMIN`, `TRABAJADOR_CENTRO` |

El cuerpo del `PATCH` es un `UpdateDoctorScheduleDto` con el campo `slots` (array completo de disponibilidad). La operación reemplaza completamente los slots existentes.

## Estado cuando no hay médico seleccionado

El panel derecho muestra un estado vacío con el mensaje "Seleccioná un médico" y una descripción hasta que el usuario elija uno de la lista.

## Flujo Típico

1. El administrador ingresa a `/schedule`.
2. `DoctorListPanel` carga la lista de médicos del sistema.
3. El administrador hace clic en un médico de la lista.
4. `ScheduleEditor` se monta con los slots actuales de ese médico.
5. El administrador modifica los horarios disponibles (agrega o elimina slots).
6. Al guardar, se realiza `PATCH /api/hospitals/doctors/:doctorUserId/schedule`.
7. El médico ahora tiene los nuevos slots disponibles para la asignación de citas.
