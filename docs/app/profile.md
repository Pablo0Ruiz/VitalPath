# Perfil (Profile) — App Móvil VitalPath

---

## Propósito

Pantalla de gestión de datos personales del usuario. Permite ver y editar la información del perfil, cambiar la foto de perfil y revisar los datos de salud básicos registrados en el sistema.

---

## Ruta

`/(drawer)/profile`

Se accede desde el `AppDrawerContent` (drawer de navegación), no desde el tab bar.

---

## Componentes principales

| Componente     | Tipo     | Responsabilidad                              |
| -------------- | -------- | -------------------------------------------- |
| `UserAvatar`   | atom     | Foto de perfil circular con opción de cambio |
| `Avatar`       | atom     | Versión sin interacción del avatar           |
| `FormField`    | molecule | Campo de formulario editable                 |
| `GenderForm`   | molecule | Selector de género                           |
| `ScreenHeader` | atom     | Encabezado con título y botón de guardado    |
| `Button`       | atom     | Acción de guardar cambios                    |

---

## Datos del perfil

El perfil muestra y permite editar los siguientes campos de `UserSession`:

| Campo             | Editable          | Descripción                                 |
| ----------------- | ----------------- | ------------------------------------------- |
| `name`            | Sí                | Nombre completo del usuario                 |
| `email`           | No (solo lectura) | Email de la cuenta                          |
| `phone`           | Sí                | Número de teléfono de contacto              |
| `fechaNacimiento` | No                | Fecha de nacimiento (calculada en registro) |
| `genero`          | Sí                | Género (`M` / `F` / `Otro`)                 |
| `fotoPerfil`      | Sí                | URL de la imagen de perfil                  |

---

## Llamadas a la API

### Obtener datos del perfil

```
GET /auth/me
Headers: Authorization: Bearer {accessToken}

Response 200: UserSession
```

Se usa para obtener los datos más recientes del usuario al abrir el perfil.

### Actualizar datos del perfil

```
PUT /users/{user._id}
Headers: Authorization: Bearer {accessToken}
Body: {
  name?: string,
  phone?: string,
  genero?: 'M' | 'F' | 'Otro',
  fotoPerfil?: string
}

Response 200: UserSession actualizado
```

Tras una actualización exitosa, se llama `setSession(updatedUser)` para actualizar el store global.

### Cambiar foto de perfil

```
1. expo-image-picker.launchImageLibraryAsync()
2. POST /storage/upload
   Headers: Authorization: Bearer {accessToken}
            Content-Type: multipart/form-data
   Body: FormData con la imagen
   Response: { url: string }

3. PUT /users/{user._id} con { fotoPerfil: url }
```

---

## Flujo típico del usuario

```
1. Usuario abre el drawer → toca "Mi Perfil"
2. GET /auth/me para cargar datos frescos
3. Se muestran los campos del perfil
4. Usuario toca la foto → expo-image-picker
   → Selecciona imagen → se sube al backend
   → URL actualizada en el perfil → avatar se actualiza
5. Usuario edita nombre o teléfono → toca "Guardar"
   → PUT /users/{id} con los campos modificados
   → setSession(updatedUser) actualiza el store
   → HeaderHome en el Dashboard refleja el nuevo nombre/foto inmediatamente
```

---

## Datos del usuario que se usan

| Dato              | Uso                             |
| ----------------- | ------------------------------- |
| `user._id`        | Endpoint PUT /users/{id}        |
| `user.fotoPerfil` | Mostrar avatar actual           |
| `accessToken`     | Autenticar todas las peticiones |
