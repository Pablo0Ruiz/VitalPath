# Configuración (Settings) — App Móvil VitalPath

---

## Propósito

Pantalla de preferencias de la aplicación. Permite al usuario controlar el modo de accesibilidad Senior UI, cambiar su contraseña y cerrar sesión de forma segura.

---

## Ruta

`/(drawer)/settings`

Se accede desde el `AppDrawerContent` (drawer de navegación).

---

## Componentes principales

| Componente            | Tipo     | Responsabilidad                                  |
| --------------------- | -------- | ------------------------------------------------ |
| `ScreenHeader`        | atom     | Encabezado de la pantalla                        |
| `Checkbox` (o Toggle) | atom     | Control para activar/desactivar modo Senior      |
| `SecurityBanner`      | molecule | Información sobre seguridad de la cuenta         |
| `Button`              | atom     | Acción de cerrar sesión y de cambiar contraseña  |
| `CustomModal`         | molecule | Modal de confirmación para acciones destructivas |

---

## Funcionalidades

### Modo Senior UI

```typescript
const { isSeniorUI, setIsSeniorUI } = useSeniorUIStore();
```

El toggle activa/desactiva el modo de accesibilidad:

- Fuentes 50% más grandes
- Áreas de toque 27% más grandes
- Contraste alto
- Asistente de voz (FAB) visible en el Dashboard

El estado persiste en SecureStore vía `seniorUI.store.ts`.

### Cambio de contraseña

```
POST /auth/change-password
Headers: Authorization: Bearer {accessToken}
Body: {
  currentPassword: string,
  newPassword: string
}

Response 200: OK
Response 400: Contraseña actual incorrecta
```

### Cerrar sesión

```typescript
// Proceso de logout
const handleLogout = async () => {
  clearSession(); // Limpia user del store
  await mobileTokenAdapter.deleteToken(); // Borra access token de SecureStore
  await mobileTokenAdapter.deleteRefreshToken(); // Borra refresh token de SecureStore
  queryClient.clear(); // Invalida todo el caché de React Query
  seniorUI.reset(); // Limpia preferencias de UI
  router.replace('/(auth)/login'); // Navega a login
};
```

---

## Flujo típico del usuario

```
1. Usuario abre el drawer → toca "Configuración"
2. Ve opciones: Modo Senior, Cambiar contraseña, Cerrar sesión

Cambiar contraseña:
3. Toca "Cambiar contraseña"
4. Modal con campos: contraseña actual, nueva contraseña, confirmar
5. POST /auth/change-password
6. Si OK: mensaje de éxito y modal se cierra

Cerrar sesión:
3. Toca "Cerrar sesión"
4. Modal de confirmación ("¿Estás seguro?")
5. Usuario confirma → handleLogout()
6. App redirige a /(auth)/login
7. Todos los datos locales han sido eliminados
```

---

## Datos del usuario que se usan

| Dato          | Uso                                |
| ------------- | ---------------------------------- |
| `isSeniorUI`  | Estado actual del modo senior      |
| `accessToken` | Autenticar el cambio de contraseña |
