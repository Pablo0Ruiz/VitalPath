# Flujos de Datos y Autenticación

En este documento se describe, a través de diagramas de flujo y explicaciones detalladas, el recorrido del token y de los datos del usuario a lo largo del frontend web.

### Explicación del flujo de token:

1. **Inicio de sesión:** Al ingresar las credenciales, el backend retorna un Access Token en el cuerpo de la respuesta y setea una cookie `httpOnly` para el Refresh Token.
2. **Almacenamiento:** El adaptador (`webTokenAdapter`) coge el Access Token y lo guarda en `document.cookie` para uso del cliente.
3. **Navegación:** Al intentar entrar a una ruta protegida, el middleware en Next.js verifica directamente esa cookie.
4. **Renovación silenciosa:** Si una petición API falla por 401, Axios intercepta, llama al endpoint de refresco. El backend lee la cookie httpOnly directamente, devuelve un nuevo token, Axios reintenta la llamada original de forma invisible para el usuario.
5. **Cierre de sesión:** Al salir, el backend revoca el refresh token y el frontend elimina su acceso, limpiando toda la memoria caché.

### Explicación del flujo de datos del usuario:

1. Cuando se ingresa a cualquier página interna, la aplicación comprueba si ya dispone de los datos de la sesión actual en su estado global (Zustand).
2. Si no están (por ejemplo, se hizo un F5/refresh a la página y la memoria volátil se limpió), se ejecuta un hook de React Query para rehidratar el estado base de usuario.
3. El perfil de usuario es centralizado en un contexto (Store).
4. Cuando existen interacciones (ej: actualización de datos), tras la respuesta optimista o exitosa de la API, el frontend actualiza inmediatamente el Store para reflejar los cambios en la UI sin tener que recargar por completo la pantalla.
