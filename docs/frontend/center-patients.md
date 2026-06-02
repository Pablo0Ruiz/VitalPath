# Módulo de Pacientes del Centro (`center-patients`)

## Propósito

Mostrar al personal del centro de salud (trabajadores administrativos y administradores) el listado completo de pacientes vinculados al centro. Permite buscar pacientes rápidamente por nombre o email para acceder a su información.

## Rutas / Páginas Principales

- **`/center-patients`**: Lista de todos los pacientes del centro con buscador.

## Control de Acceso

La página no aplica una redirección explícita por rol en el `page.tsx`, pero los datos son retornados por el backend únicamente para usuarios con acceso al centro (roles `ADMIN` y `TRABAJADOR_CENTRO`).

## Componentes Clave

- **CenterPatientList:** Componente organism principal que encapsula toda la lógica de la página.
- **Input de búsqueda:** Filtra la lista localmente por nombre completo o email (sin nueva petición al servidor).
- **Card:** Contenedor visual de la lista con contador de resultados.
- **Avatar:** Muestra las iniciales del paciente.

## Fuente de Datos

- **Hook:** `useCenterPatients()` del paquete `@repo/api-client`.
- **Endpoint:** `GET /api/user/center-patients`
- **Tipo de respuesta:** `IPatientProfile[]`

```typescript
interface IPatientProfile {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  profile?: Record<string, unknown> | null;
}
```

## Capacidades de Búsqueda

El filtrado es **client-side**: se ejecuta sobre los datos ya cargados en memoria, sin nuevas peticiones al servidor.

| Criterio de búsqueda | Implementado |
| -------------------- | ------------ |
| Nombre completo      | Sí           |
| Email                | Sí           |
| ID de paciente       | No           |

## Diferencia con `/patients`

| Característica        | `/patients`                                    | `/center-patients`                              |
| --------------------- | ---------------------------------------------- | ----------------------------------------------- |
| Fuente de datos       | `GET /api/appointment/allCitasMedico` (citas)  | `GET /api/user/center-patients`                 |
| Información mostrada  | Pacientes únicos derivados de citas del médico | Pacientes directamente registrados en el centro |
| Navegación al detalle | Sí, enlace a `/patients/:id`                   | No (solo listado)                               |
| Filtro por estado     | Sí (tabs por estado de cita)                   | No                                              |

## Flujo Típico

1. Un trabajador administrativo ingresa a `/center-patients`.
2. El componente ejecuta `GET /api/user/center-patients` al montar.
3. Se muestra la lista de pacientes con nombre, avatar y email.
4. El usuario escribe en el buscador; la lista se filtra en tiempo real sin tocar la red.
