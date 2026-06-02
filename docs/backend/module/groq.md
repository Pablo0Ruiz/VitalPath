# Módulo: Groq (Inteligencia Artificial)

**Ubicación:** `apps/api/src/groq`

Este módulo se integra con el servicio externo de IA generativa (Groq). Provee soporte tanto para transcripción de audio (Whisper o similar vía Groq) como soporte interactivo de Chat a través de Eventos Enviados por el Servidor (Server-Sent Events / SSE).

## Endpoints

### 1. Chat Inteligente por Streaming

- **Método:** `POST`
- **Ruta:** `/ai/chat-stream`
- **Autorización:** Autenticado (`@Auth()`)
- **Tipo de Contenido:** `multipart/form-data`
- **Campos del Formulario:**
  - `prompt`: Mensaje enviado por el usuario.
  - `chatId`: UUID de la conversación.
  - `files`: (Opcional) Array de archivos binarios pasados por un `FilesInterceptor` (ej. PDFs para extraer contexto).
- **Respuesta Exitosa:** `200 OK`. Una conexión abierta emitiendo eventos _SSE_ (Server-Sent Events) en fragmentos (chunks) para visualizar en tiempo real la respuesta en el cliente.

### 2. Chat de Voz (Voice Chat)

- **Método:** `POST`
- **Ruta:** `/ai/voice-chat`
- **Autorización:** Autenticado (`@Auth()`)
- **Tipo de Contenido:** `multipart/form-data`
- **Campos del Formulario:**
  - `chatId`: ID de la conversación.
  - `file`: Archivo binario de audio capturado por el micrófono del cliente (pasado por `FileInterceptor`).
- **Respuesta Exitosa:** `201 Created`.
- **Comportamiento:** Transcribe el audio recibido, inserta la transcripción como _prompt_ en la conversación existente, y retorna la respuesta procesada por la IA.

### 3. Obtener Historial de Conversaciones

- **Método:** `GET`
- **Ruta:** `/ai/conversations`
- **Autorización:** Autenticado (`@Auth()`)
- **Respuesta Exitosa:** `200 OK`. Listado de todas las sesiones de chat del usuario.

### 4. Obtener Detalles de una Conversación (Chat History)

- **Método:** `GET`
- **Ruta:** `/ai/chat-history/:chatId`
- **Autorización:** Autenticado (`@Auth()`)
- **Parámetro Ruta:** `chatId`.
- **Respuesta Exitosa:** `200 OK`. Lista ordenada de mensajes mapeados a `{ role: 'user' | 'model', parts: "text" }`.

## Sistema de herramientas (Tool-Use)

El `GroqModule` se integra con `GroqToolsModule` para proveer capacidades de IA diferenciadas según el rol del usuario autenticado.

### Cómo funciona

`GroqToolsService.getToolsFor(userId, role)` retorna un `ToolSet` específico para el usuario. Cada función `execute` dentro del ToolSet cierra sobre el `userId` del usuario autenticado, de modo que la IA **no puede actuar fuera del scope del usuario** (principio de mínimo privilegio).

### ToolSets por rol

| Rol                 | Herramientas disponibles                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `PACIENTE`          | `appointment-tools`, `patient-data-tools`, `medicos-tools` — consulta sus propias citas, medicamentos y médicos |
| `MEDICO`            | `doctor-tools`, `medicos-tools` — accede a la lista de pacientes y puede escribir notas clínicas                |
| `TRABAJADOR_CENTRO` | `worker-tools` — herramientas de agendamiento y administración                                                  |
| Rol desconocido     | ToolSet vacío (fallback seguro, la IA no recibe herramientas)                                                   |

### Ejemplo de uso interno

```typescript
// En GroqService, al procesar un chat-stream:
const toolSet = await groqToolsService.getToolsFor(userId, user.role);
// toolSet.tools es el array de herramientas que se pasa al modelo de Groq
```

El rol se extrae del JWT del usuario autenticado. Si el rol no coincide con ninguno de los casos conocidos, se retorna un ToolSet vacío en lugar de lanzar un error, garantizando que el endpoint de chat nunca falla por un rol inesperado.
