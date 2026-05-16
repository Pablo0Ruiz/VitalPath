# Privacidad — App Móvil VitalPath

---

## Datos almacenados en el dispositivo

### Almacenamiento persistente (SecureStore)

Todos los datos persistentes se guardan en `expo-secure-store`, que cifra el contenido usando el Keychain (iOS) o Keystore (Android).

| Dato                       | Clave           | Propósito                                               |
| -------------------------- | --------------- | ------------------------------------------------------- |
| Access token JWT           | `token.access`  | Autenticar peticiones al backend                        |
| Refresh token JWT          | `token.refresh` | Renovar el access token sin re-login                    |
| Sesión del usuario (JSON)  | `auth-storage`  | Evitar llamadas innecesarias al backend al abrir la app |
| Preferencia de modo senior | `senior-ui`     | Recordar la preferencia de accesibilidad entre sesiones |

El objeto `UserSession` que se persiste contiene:

```typescript
{
  _id: string;
  name: string;
  email: string;
  phone?: string;
  fechaNacimiento?: string;
  genero?: 'M' | 'F' | 'Otro';
  seniorMode?: boolean;
  fotoPerfil?: string;  // URL a imagen en backend, no imagen local
}
```

> No se almacena la contraseña en ningún momento ni en ningún formato.

### Datos solo en memoria (no persistentes)

| Dato                        | Ubicación en memoria          | Ciclo de vida                                                          |
| --------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| Mensajes del chat IA        | Zustand chat store            | Se limpia al cerrar sesión o al iniciar un nuevo chat                  |
| Caché de citas              | React Query cache             | TTL configurable; se invalida al hacer `queryClient.clear()` en logout |
| Caché de medicamentos       | React Query cache             | Ídem                                                                   |
| Caché de resultados médicos | React Query cache             | Ídem                                                                   |
| Audio grabado               | Buffer temporal de expo-audio | Se descarta tras enviar el mensaje de voz                              |
| Imágenes adjuntas al chat   | Buffer temporal               | Se descartan tras enviar el mensaje                                    |

---

## Minimización de datos

La app aplica el principio de mínima recolección:

1. **Tokens solamente** — el backend no devuelve datos sensibles como contraseñas ni PINs. Los tokens son el único dato de autenticación que persiste.
2. **Sin base de datos local** — no hay SQLite, Realm ni ninguna base de datos local. Todos los datos médicos viven en el backend y se traen bajo demanda.
3. **Imágenes de perfil por URL** — la foto de perfil se almacena como URL en el backend; la app solo guarda la URL en el objeto `UserSession`, no la imagen en sí.
4. **Chat no persistente en dispositivo** — el historial de conversaciones se almacena en el backend. El dispositivo no guarda mensajes localmente.

---

## Permisos requeridos

### Android

| Permiso                 | Uso                                  | Obligatorio                         |
| ----------------------- | ------------------------------------ | ----------------------------------- |
| `RECORD_AUDIO`          | Mensajes de voz en el chat           | No (se solicita al usar la función) |
| `MODIFY_AUDIO_SETTINGS` | Control de volumen durante grabación | No                                  |
| Notificaciones push     | Alertas de nuevos resultados         | No (se solicita al iniciar sesión)  |

### iOS

| Permiso           | Uso                          | Obligatorio                                  |
| ----------------- | ---------------------------- | -------------------------------------------- |
| Micrófono         | Mensajes de voz en el chat   | No (se solicita al usar la función)          |
| Notificaciones    | Alertas de nuevos resultados | No (se solicita al iniciar sesión)           |
| Fototeca / Cámara | Adjuntar imágenes al chat    | No (se solicita al usar `expo-image-picker`) |

> La app no solicita acceso a la ubicación, contactos, Bluetooth ni ningún otro permiso sensible.

---

## Gestión del consentimiento

### Notificaciones push

Al iniciar sesión, la app solicita permiso de notificaciones a través de `expo-notifications`:

```typescript
const { status } = await Notifications.requestPermissionsAsync();
if (status === 'granted') {
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: EAS_PROJECT_ID,
  });
  await savePushToken(token.data); // Registra el token en el backend
}
```

El usuario puede denegar el permiso sin afectar ninguna otra funcionalidad de la app.

### Grabación de audio

Se solicita en el momento en que el usuario intenta usar el micrófono por primera vez. Si se deniega, el botón de micrófono se deshabilita con un mensaje explicativo.

### Acceso a la fototeca

Se solicita mediante el diálogo nativo de `expo-image-picker` en el momento en que el usuario intenta adjuntar una imagen al chat.

---

## Datos en tránsito

- Todas las peticiones viajan sobre **HTTPS** en producción.
- Los tokens se transmiten en el header `Authorization: Bearer {token}` (no en la URL ni en parámetros de query).
- El refresh token se envía en el body de la petición `POST /auth/refresh-mobile` (no en la URL).

---

## Eliminación de datos

Al cerrar sesión, la app elimina de forma activa todos los datos locales:

1. Access token y refresh token borrados de SecureStore.
2. Objeto `UserSession` borrado de SecureStore.
3. Caché completo de React Query invalidado.
4. Estado del chat limpiado.

Los datos del usuario en el backend (historial médico, citas, medicamentos) no se ven afectados por el logout en el dispositivo; son datos del sistema de salud y se gestionan según las políticas del backend.
