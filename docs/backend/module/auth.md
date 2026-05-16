# Módulo: Auth

**Ubicación:** `apps/api/src/auth`

Este módulo es responsable de toda la autenticación y el registro en la API. Implementa un sistema de seguridad dual utilizando JSON Web Tokens (JWT) con tokens de acceso (Access Tokens de vida corta) y rotación de tokens de refresco (Refresh Tokens de vida larga). Dependiendo del cliente emisor (app móvil web), maneja los refresh tokens en cuerpo del mensaje o de forma segura mediante cookies `HttpOnly`.

## Endpoints

### 1. Registrar Nuevo Usuario

- **Método:** `POST`
- **Ruta:** `/auth/register`
- **Autorización:** Ninguna (Público)
- **Cuerpo (Body):**
  - Objeto `RegisterDto` que requiere campos como nombre, email y contraseña.
- **Respuesta Exitosa:** `201 Created`
  - Retorna los datos del usuario creado y un token de acceso (también establece la cookie de refresh token si es cliente web).

### 2. Inicio de Sesión

- **Método:** `POST`
- **Ruta:** `/auth/login`
- **Autorización:** Ninguna (Público)
- **Cuerpo (Body):**
  - Objeto `LoginUserDto` (email y password).
- **Respuesta Exitosa:** `201 Created`
  - Retorna `accessToken` y la información del usuario. Configura cookie de refresco.

### 3. Inicio de Sesión con Código de Acceso

- **Método:** `POST`
- **Ruta:** `/auth/login/code/:codigo`
- **Autorización:** Ninguna (Público)
- **Parámetros de Ruta:** `codigo` (string numérico)
- **Respuesta Exitosa:** `201 Created` con tokens.

### 4. Recuperación de Contraseña

- **Método:** `POST`
- **Ruta:** `/auth/recover-password`
- **Autorización:** Ninguna
- **Cuerpo:** `RecoverPasswordDto` (email).
- **Respuesta Exitosa:** `201 Created` indicando envío del email.

### 5. Configurar Código de Acceso

- **Método:** `PATCH`
- **Ruta:** `/auth/set-access-code/:id`
- **Autorización:** Requiere autenticación Bearer (`@Auth()`). Solo el propio usuario puede asignarse su código.
- **Parámetros de Ruta:** `id` (Mongo ID).
- **Cuerpo:** `{ "accessCode": "123456" }`
- **Respuesta:** `200 OK`

### 6. Verificar Invitación de Médico

- **Método:** `POST`
- **Ruta:** `/auth/verify-doctor/:verificationCode`
- **Autorización:** Ninguna
- **Cuerpo:** `InviteDoctorDto` (contraseña nueva y confirmación).
- **Respuesta:** `201 Created` verificando la invitación y devolviendo los tokens de sesión.

### 7. Rotación de Refresh Token (Web)

- **Método:** `POST`
- **Ruta:** `/auth/refresh`
- **Autorización:** Cookie `refresh_token` requerida.
- **Respuesta Exitosa:** `201 Created` con un nuevo `accessToken`. El refresh token anterior se invalida automáticamente (Rotation) y se emite uno nuevo en las cookies.

### 8. Rotación de Refresh Token (Móvil)

- **Método:** `POST`
- **Ruta:** `/auth/refresh-mobile`
- **Autorización:** Refresh token manual en el cuerpo.
- **Cuerpo:** `RefreshMobileDto` (`refreshToken`).
- **Respuesta Exitosa:** `201 Created` con nuevo `accessToken` y `refreshToken`.

### 9. Cerrar Sesión

- **Método:** `POST`
- **Ruta:** `/auth/logout`
- **Autorización:** Requiere autenticación Bearer.
- **Respuesta Exitosa:** `201 Created`. Invalida los tokens en la base de datos y borra la cookie de sesión en clientes web.
