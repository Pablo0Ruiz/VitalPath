# Medicamentos (Medications) — App Móvil VitalPath

---

## Propósito

CRUD completo de medicamentos del paciente. Permite registrar, editar y eliminar medicamentos, con información de dosis y frecuencia. La pantalla principal del Dashboard también consume este módulo para el seguimiento diario.

---

## Ruta

`/(drawer)/(tabs)/medications`

> Esta ruta existe en el sistema de archivos pero está **oculta del tab bar** (`href: null`). Se accede a ella desde el Dashboard o mediante navegación programática.

---

## Componentes principales

| Componente          | Tipo     | Responsabilidad                                                 |
| ------------------- | -------- | --------------------------------------------------------------- |
| `MedicationRow`     | molecule | Fila de un medicamento con nombre, dosis, frecuencia y acciones |
| `CustomModal`       | molecule | Modal para agregar nuevo medicamento                            |
| `CustomUpdateModal` | molecule | Modal para editar medicamento existente                         |
| `CustomList`        | molecule | Lista genérica usada también en el Dashboard                    |
| `IconBox`           | atom     | Icono de pastilla/cápsula                                       |
| `Badge`             | atom     | Indicador de frecuencia                                         |
| `EmptyState`        | atom     | Estado vacío cuando no hay medicamentos                         |

---

## Estructura de datos

```typescript
interface Medicamento {
  _id: string;
  nombre: string;
  dosis: string; // Ej: "500mg"
  frecuencia: string; // Ej: "Cada 8 horas", "Una vez al día"
  paciente_ID: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Llamadas a la API

### Obtener medicamentos

```
GET /medicamentos
Headers: Authorization: Bearer {accessToken}

Response 200: Medicamento[]
```

El backend filtra automáticamente por el usuario autenticado (extraído del JWT).

### Crear medicamento

```
POST /medicamentos
Headers: Authorization: Bearer {accessToken}
Body: {
  nombre: string,
  dosis: string,
  frecuencia: string
}

Response 201: Medicamento
```

### Actualizar medicamento

```
PUT /medicamentos/{id}
Headers: Authorization: Bearer {accessToken}
Body: {
  nombre?: string,
  dosis?: string,
  frecuencia?: string
}

Response 200: Medicamento actualizado
```

### Eliminar medicamento

```
DELETE /medicamentos/{id}
Headers: Authorization: Bearer {accessToken}

Response 200: OK
```

El hook `useDeleteMedication` invalida el caché `['medicamentos']` de React Query tras una eliminación exitosa, lo que dispara un refetch automático.

---

## Flujo típico del usuario

```
Desde el Dashboard:
1. Usuario ve la lista de medicamentos del día
2. Toca el botón "+" → se abre CustomModal (agregar)
   → Ingresa nombre, dosis, frecuencia
   → POST /medicamentos
   → Modal se cierra → lista se actualiza automáticamente
3. Toca el ícono de editar en un medicamento → se abre CustomUpdateModal
   → Modifica los campos deseados
   → PUT /medicamentos/{id}
4. Toca el ícono de eliminar → confirmación → DELETE /medicamentos/{id}

Desde la pantalla de Medicamentos:
1. Vista completa de todos los medicamentos registrados
2. Mismas acciones de crear/editar/eliminar
3. Cada medicamento muestra nombre, dosis e indicador de frecuencia
```

---

## Uso en el Dashboard

El Dashboard usa `useMedicaments()` y `useCompletedSet()` juntos para el seguimiento diario:

```typescript
// useCompletedSet: un Set en memoria de IDs de medicamentos tomados hoy
const { completedSet, toggle } = useCompletedSet();

// En el render:
<MedicationRow
  key={med._id}
  medication={med}
  completed={completedSet.has(med._id)}
  onToggle={() => toggle(med._id)}
/>
```

> El `completedSet` es **solo visual** y vive en memoria. No se persiste en el backend ni en el dispositivo. Se reinicia cuando el usuario cierra y vuelve a abrir la app.

---

## Datos del usuario que se usan

| Dato           | Uso                                                                         |
| -------------- | --------------------------------------------------------------------------- |
| `token.access` | Autenticar todas las peticiones; el backend extrae el `paciente_ID` del JWT |
