# Módulo: Vinculación

**Ubicación:** `apps/api/src/vinculacion`

El módulo de vinculación implementa el sistema de emparejamiento seguro entre pacientes y cuidadores familiares. Un paciente genera un código temporal; el cuidador lo canjea para establecer un vínculo activo. El paciente conserva el control total: puede revocar el acceso en cualquier momento.

## Endpoints

### 1. Generar código de vinculación

- **Método:** `POST`
- **Ruta:** `/vinculacion/generar-codigo`
- **Autorización:** `PACIENTE` únicamente.
- **Cuerpo:** ninguno.
- **Respuesta exitosa:** `201 Created`

```json
{
  "codigo": "482951",
  "expireAt": "2026-05-25T09:15:00.000Z"
}
```

El backend genera un número de 6 dígitos aleatorio (`crypto.randomInt`), lo hashea con HMAC-SHA256 para búsqueda rápida (`codigo_lookup`) y con bcrypt para verificación segura (`codigo_vinculacion`). La expiración es de **15 minutos** desde la generación.

Si el paciente ya tiene un código `PENDIENTE` no expirado, el backend lo rota en lugar de crear uno nuevo (evita acumulación de documentos pendientes).

---

### 2. Vincular con código

- **Método:** `POST`
- **Ruta:** `/vinculacion/vincular`
- **Autorización:** `CUIDADOR_FAMILIAR` únicamente.
- **Throttling:** 5 peticiones por minuto por IP (`@Throttle({ default: { limit: 5, ttl: 60000 } })`).
- **Cuerpo:** `VincularDto`

```json
{
  "codigo": "482951",
  "tipo_vinculo": "HIJO_A"
}
```

**Valores de `tipo_vinculo`:**

| Valor                 | Descripción         |
| --------------------- | ------------------- |
| `HIJO_A`              | Hijo/a              |
| `ESPOSO_A`            | Esposo/a            |
| `CUIDADOR_CONTRATADO` | Cuidador contratado |
| `OTRO`                | Otro                |

**Respuesta exitosa:** `200 OK` — devuelve el documento `VinculacionPacienteCuidador` activado.

**Proceso de validación (en orden):**

1. Lookup por HMAC del código (`codigo_lookup`).
2. Verificación de expiración.
3. Verificación de estado `PENDIENTE`.
4. Comparación bcrypt del código en texto plano.
5. Comprobación de que el cuidador no esté ya vinculado activamente con ese paciente.
6. Actualización atómica: `findOneAndUpdate` con condición `{ estado_vinculo: PENDIENTE, cuidador_id: null }` (previene race conditions).

Tras la vinculación exitosa, se eliminan `codigo_lookup`, `codigo_vinculacion` y `codigoExpireAt` del documento.

---

### 3. Revocar vinculación

- **Método:** `PATCH`
- **Ruta:** `/vinculacion/:id/revocar`
- **Autorización:** `PACIENTE`. Solo puede revocar vínculos donde es el propietario (`paciente_id`).
- **Respuesta exitosa:** `200 OK` — devuelve el documento actualizado con `estado_vinculo: REVOCADO`.

El estado cambia a `REVOCADO` pero el documento no se elimina, preservando el historial de vinculaciones.

---

### 4. Listar mis pacientes

- **Método:** `GET`
- **Ruta:** `/vinculacion/mis-pacientes`
- **Autorización:** `CUIDADOR_FAMILIAR` únicamente.
- **Respuesta exitosa:** `200 OK` — lista de vinculaciones con estado `ACTIVO`.

```json
[
  {
    "_id": "...",
    "paciente_id": {
      "_id": "...",
      "name": "Carlos",
      "lastName": "López",
      "fotoPerfil": "...",
      "fechaNacimiento": "1945-03-10"
    },
    "tipo_vinculo": "HIJO_A",
    "estado_vinculo": "ACTIVO",
    "createdAt": "..."
  }
]
```

Solo retorna vínculos `ACTIVO`. Los `PENDIENTE` y `REVOCADO` no se incluyen.

---

### 5. Listar mis cuidadores

- **Método:** `GET`
- **Ruta:** `/vinculacion/mis-cuidadores`
- **Autorización:** `PACIENTE` únicamente.
- **Respuesta exitosa:** `200 OK` — lista de **todas** las vinculaciones del paciente (cualquier estado).

```json
[
  {
    "_id": "...",
    "cuidador_id": {
      "_id": "...",
      "name": "Ana",
      "lastName": "García",
      "fotoPerfil": "..."
    },
    "tipo_vinculo": "HIJO_A",
    "estado_vinculo": "ACTIVO"
  }
]
```

Incluye vinculaciones `PENDIENTE`, `ACTIVO` y `REVOCADO`, para que el paciente tenga visibilidad total del historial.

---

## Tabla resumen de endpoints

| Método  | Ruta                          | Rol requerido       | Código exitoso |
| ------- | ----------------------------- | ------------------- | -------------- |
| `POST`  | `/vinculacion/generar-codigo` | `PACIENTE`          | `201`          |
| `POST`  | `/vinculacion/vincular`       | `CUIDADOR_FAMILIAR` | `200`          |
| `PATCH` | `/vinculacion/:id/revocar`    | `PACIENTE`          | `200`          |
| `GET`   | `/vinculacion/mis-pacientes`  | `CUIDADOR_FAMILIAR` | `200`          |
| `GET`   | `/vinculacion/mis-cuidadores` | `PACIENTE`          | `200`          |

---

## Códigos de error

| HTTP | Código de error interno | Cuándo ocurre                                                   |
| ---- | ----------------------- | --------------------------------------------------------------- |
| 404  | —                       | Código no encontrado (lookup no existe)                         |
| 409  | `CODE_ALREADY_USED`     | El código ya fue canjeado (estado ≠ PENDIENTE)                  |
| 409  | `ALREADY_LINKED`        | El cuidador ya tiene un vínculo ACTIVO con ese paciente         |
| 410  | `CODE_EXPIRED`          | El código existe pero `codigoExpireAt` ya pasó                  |
| 403  | —                       | El paciente intenta revocar una vinculación que no le pertenece |

---

## Entidad: `VinculacionPacienteCuidador`

**Colección MongoDB:** `vinculaciones_paciente_cuidador`

```typescript
class VinculacionPacienteCuidador extends Document {
  cuidador_id: Types.ObjectId | null; // ref: User — null mientras estado es PENDIENTE
  paciente_id: Types.ObjectId; // ref: User — requerido
  tipo_vinculo: TipoVinculo | null; // null hasta que el cuidador canjea
  codigo_lookup: string | null; // HMAC-SHA256 del código — eliminado tras vincular
  codigo_vinculacion: string | null; // bcrypt del código — eliminado tras vincular
  codigoExpireAt: Date | null; // TTL 15 min — eliminado tras vincular
  estado_vinculo: EstadoVinculo; // PENDIENTE | ACTIVO | REVOCADO
  // timestamps: createdAt, updatedAt
}
```

**Índices:**

| Índice                                  | Tipo                        | Propósito                                     |
| --------------------------------------- | --------------------------- | --------------------------------------------- |
| `{ cuidador_id: 1, estado_vinculo: 1 }` | compuesto                   | Filtrar pacientes activos de un cuidador      |
| `{ paciente_id: 1 }`                    | simple                      | Listar cuidadores de un paciente              |
| `{ codigo_lookup: 1 }`                  | único + sparse              | Lookup rápido del código sin colisiones       |
| `{ codigoExpireAt: 1 }`                 | TTL (expireAfterSeconds: 0) | MongoDB limpia docs expirados automáticamente |

---

## Seguridad

### Código de uso único

El código solo puede canjearse una vez: el endpoint `vincular` usa `findOneAndUpdate` con la condición `{ estado_vinculo: PENDIENTE, cuidador_id: null }`. Si dos cuidadores intentan canjear el mismo código simultáneamente, solo uno tendrá éxito (el otro recibe `CODE_ALREADY_USED`).

### Almacenamiento seguro del código

El código en texto plano nunca se persiste. El backend guarda:

- **HMAC-SHA256** (secreto: `JWT_SECRET`) para buscar el documento en O(1) sin iterar.
- **bcrypt (cost 10)** para verificar que el texto plano que presenta el cuidador es correcto.

Esto garantiza que incluso con acceso directo a la base de datos, el código no es recuperable.

### TTL automático en MongoDB

El índice `{ codigoExpireAt: 1, expireAfterSeconds: 0 }` delega en MongoDB la limpieza de documentos con código expirado. No hay cron manual necesario.

### Throttling en `/vincular`

El endpoint `POST /vinculacion/vincular` está limitado a **5 peticiones por minuto por IP**. Esto previene ataques de fuerza bruta sobre el espacio de 1.000.000 posibles códigos de 6 dígitos.
