# Chat IA — App Móvil VitalPath

---

## Propósito

Interfaz de conversación con el asistente de inteligencia artificial de VitalPath. Permite al usuario hacer preguntas sobre su salud, obtener información sobre sus medicamentos y citas, y recibir respuestas tanto en texto como en audio.

---

## Ruta

`/(drawer)/(tabs)/chat`

---

## Componentes principales

| Componente         | Tipo     | Responsabilidad                                                          |
| ------------------ | -------- | ------------------------------------------------------------------------ |
| `ChatHeader`       | molecule | Encabezado con nombre del asistente y estado (online/escribiendo)        |
| `ChatHistory`      | organism | Listado de conversaciones anteriores; permite retomar un chat previo     |
| `ChatMessages`     | molecule | Área de mensajes del chat activo (burbujas de texto, imágenes, markdown) |
| `ChatComposer`     | molecule | Input de texto con botones de adjuntar imagen y micrófono                |
| `ConversationCard` | molecule | Tarjeta de resumen de una conversación previa en el historial            |
| `MessageItem`      | atom     | Burbuja de mensaje de texto                                              |
| `MessageItemImage` | atom     | Burbuja de mensaje con imagen adjunta                                    |

---

## Estado del chat

El estado de la conversación vive en el store de chat de `@repo/store`:

```typescript
interface ChatContextStore {
  chatId: string; // ID de la conversación activa
  messages: Message[]; // Mensajes del chat actual
  geminiWriting: boolean; // El asistente está generando una respuesta

  setChatId(id: string): void;
  setMessages(msgs: Message[]): void;
  addMessage(
    text: string,
    attachments: any[],
    actionFn: Function,
  ): Promise<void>;
  clearChat(): void;
}
```

El store no persiste en disco — los mensajes solo existen en memoria durante la sesión activa. El historial completo vive en el backend.

---

## Vista dual: historial vs. chat activo

La pantalla tiene dos modos visuales:

```
Sin chatId activo → Vista de historial (ChatHistory)
Con chatId activo → Vista de chat (ChatMessages + ChatComposer)
```

El usuario puede volver al historial tocando el botón de retroceso en el ChatHeader.

---

## Llamadas a la API

### Enviar mensaje de texto

```
POST /chat/send
Headers: Authorization: Bearer {accessToken}
Body: {
  chatId: string,
  message: string,
  attachments?: string[]    // URLs de imágenes subidas
}

Response: ReadableStream (streaming de respuesta del modelo)
```

La respuesta es un **stream** que se va acumulando en `ChatMessages` a medida que llega. El flag `geminiWriting` se mantiene en `true` durante el streaming y vuelve a `false` al completarse.

### Enviar mensaje de voz

```
POST /chat/voice
Headers: Authorization: Bearer {accessToken}
         Content-Type: multipart/form-data
Body:    FormData con el archivo de audio grabado

Response: { text: string, audioResponse?: string }
```

El flujo de voz es manejado por `src/core/actions/chat-stream.actions.ts`.

### Obtener historial de conversaciones

```
GET /chat/history?chatId={chatId}
Headers: Authorization: Bearer {accessToken}

Response 200: Message[]
```

El hook `useChatHistory` carga el historial de una conversación al retomar un chat previo.

---

## Integración con capacidades nativas

### Grabación de audio (`expo-audio`)

```
Usuario toca el botón de micrófono en ChatComposer
  → useVoiceAssistant() inicia grabación vía expo-audio
  → Usuario suelta el botón → grabación finaliza
  → Audio enviado vía POST /chat/voice
  → Respuesta de texto mostrada en ChatMessages
  → Si hay audioResponse → expo-speech reproduce la respuesta en voz
```

### Síntesis de voz (`expo-speech`)

Cuando el asistente devuelve una respuesta en audio o en modo Senior UI, la respuesta de texto se puede reproducir con `expo-speech`:

```typescript
Speech.speak(responseText, { language: 'es-ES', rate: 0.9 });
```

### Selector de imágenes (`expo-image-picker`)

El botón de adjuntar en `ChatComposer` abre el selector de imágenes:

```
Usuario toca el ícono de imagen
  → expo-image-picker.launchImageLibraryAsync()
  → Usuario selecciona imagen
  → Imagen subida al backend (POST /storage o similar)
  → URL devuelta se incluye en el mensaje como attachment
```

---

## Flujo típico del usuario

```
1. Usuario abre la tab Chat
2. Si no hay chatId activo → se muestra ChatHistory (conversaciones previas)
3. Usuario toca "Nueva conversación" o un chat existente
   → si nuevo: setChatId(uuid())
   → si existente: useChatHistory carga los mensajes → setMessages()
4. ChatMessages muestra los mensajes
5. Usuario escribe en ChatComposer y envía
   → addMessage() agrega el mensaje al store local
   → POST /chat/send con streaming
   → geminiWriting = true → indicador de escritura en ChatHeader
   → Tokens llegan en stream → se acumulan en el último mensaje del asistente
   → geminiWriting = false al completarse
6. Usuario puede grabar un mensaje de voz (botón micrófono)
   → mismo flujo pero con POST /chat/voice
7. Usuario retrocede → vuelve a ChatHistory
```

---

## Datos del usuario que se usan

| Dato           | Uso                                                  |
| -------------- | ---------------------------------------------------- |
| `token.access` | Autenticar todas las peticiones del chat             |
| `user._id`     | Contexto del usuario en el backend para el modelo IA |
| `user.name`    | Personalización del asistente ("Hola, [nombre]")     |
