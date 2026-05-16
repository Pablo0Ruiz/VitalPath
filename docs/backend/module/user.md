# Módulo: User

**Ubicación:** `apps/api/src/user`

Este módulo permite la gestión y lectura del perfil del usuario registrado. A diferencia de Auth, que maneja autenticación, este se centra en detalles de cuenta, configuraciones y notificaciones de dispositivos.

## Endpoints

### 1. Obtener Mi Perfil

- **Método:** `GET`
- **Ruta:** `/me`
- **Autorización:** Autenticado Bearer (`@Auth()`)
- **Respuesta Exitosa:** `200 OK`. Devuelve la información completa del perfil del usuario autenticado (sin contraseñas o tokens asociados).

### 2. Actualizar Mi Perfil

- **Método:** `PATCH`
- **Ruta:** `/me`
- **Autorización:** Autenticado Bearer (`@Auth()`)
- **Cuerpo (Body):** `UpdateUserDto` (pueden ser campos como el nombre o teléfono).
- **Respuesta Exitosa:** `200 OK`. Perfil actualizado en BD.

### 3. Guardar Token Push de Dispositivo

- **Método:** `PATCH`
- **Ruta:** `/me/push-token`
- **Autorización:** Autenticado Bearer (`@Auth()`)
- **Cuerpo (Body):** `SavePushTokenDto` (`token` válido de Expo Push).
- **Respuesta Exitosa:** `200 OK`. Retorna el estado actualizado del usuario con su nuevo token de notificaciones push de Expo registrado para que servicios posteriores puedan enviar alertas a la aplicación móvil nativa.
