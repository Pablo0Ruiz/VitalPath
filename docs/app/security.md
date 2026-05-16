# Seguridad — App Móvil VitalPath

---

## Almacenamiento de tokens

### ¿Dónde se guardan?

Los tokens de autenticación se almacenan en **`expo-secure-store`**, que en iOS usa el **Keychain** y en Android el **Keystore** del sistema operativo. Ambos son cifrados por hardware y solo accesibles para la propia app.

> Nunca se usan `AsyncStorage`, `MMKV` ni ningún otro mecanismo no cifrado para datos de autenticación.

### Implementación

El adapter de token implementa el puerto `TokenAdapter` definido en `@repo/types`:

```typescript
export const mobileTokenAdapter: TokenAdapter = {
  getToken: () => SecureStore.getItemAsync('vitalpath.access'),
  setToken: t => SecureStore.setItemAsync('vitalpath.access', t),
  deleteToken: () => SecureStore.deleteItemAsync('vitalpath.access'),

  getRefreshToken: () => SecureStore.getItemAsync('vitalpath.refresh'),
  setRefreshToken: t => SecureStore.setItemAsync('vitalpath.refresh', t),
  deleteRefreshToken: () => SecureStore.deleteItemAsync('vitalpath.refresh'),

  navigate: route => router.replace(route as Href),
};
```

El adapter de storage también usa `expo-secure-store` para persistir el estado del auth store.

---

## Ciclo de vida del access token

### Adjunto a peticiones HTTP

Al inicializar la app se registra el adapter en el cliente Axios compartido:

```typescript
attachAuthAdapter(mobileTokenAdapter);
```

El interceptor de **request** de `@repo/api-client` lee el token antes de cada petición:

```
Petición saliente
  → interceptor lee mobileTokenAdapter.getToken()
  → si existe: adjunta header Authorization: Bearer {accessToken}
  → si no existe: deja la petición sin header (endpoints públicos)
```

### Refresh automático

El interceptor de **response** está configurado en modo `'body'`:

```typescript
wireRefresh('body');
```

Flujo cuando el backend devuelve `401 Unauthorized`:

```
Response 401 recibida
  → interceptor pausa la petición fallida
  → llama POST /auth/refresh-mobile con body { refreshToken }
  → si OK: guarda nuevo accessToken + refreshToken en SecureStore
           reintenta la petición original con el nuevo accessToken
  → si falla (refresh expirado/inválido): llama mobileTokenAdapter.navigate('/(auth)/login')
                                          limpia sesión del store
```

> La diferencia con la app web es que en web el refresh token viaja como cookie httpOnly; en mobile viaja en el body de la petición porque las cookies httpOnly no son compatibles de forma nativa con `fetch`/Axios en React Native.

---

## Protección de pantallas (guards de navegación)

### Mecanismo principal: `SessionGate`

El componente `SessionGate` envuelve el árbol de navegación en el root layout. Al arrancar la app:

1. Espera a que el store se hidrate desde SecureStore (`_hasHydrated`).
2. Invoca `useSession(mobileTokenAdapter, ...)`.
3. Si hay sesión válida → setea `user` en el store.
4. Si no hay sesión → limpia el store.

### Guard en `app/index.tsx`

La pantalla raíz lee el store y redirige de forma declarativa:

```typescript
useEffect(() => {
  if (!navigationState?.key || isLoading) return;
  if (user) {
    router.replace(ROUTES.HOME); // /(drawer)/(tabs)/home
  } else {
    router.replace('/(auth)/login');
  }
}, [isLoading, user, navigationState?.key]);
```

Este efecto se re-ejecuta cada vez que `user` cambia (por ejemplo, al hacer logout). No existe ninguna pantalla dentro de `(drawer)` que sea accesible sin sesión activa porque la redirección ocurre antes de que el drawer se renderice.

### Guard implícito por grupos de rutas

La separación en grupos `(auth)` y `(drawer)` crea una frontera de navegación: el usuario nunca puede navegar manualmente desde auth hacia drawer (o viceversa) sin pasar por el guard del `index.tsx`.

---

## Logout y limpieza de sesión

El proceso de logout limpia todos los datos sensibles:

```
1. clearSession() en el auth store → user = null
2. mobileTokenAdapter.deleteToken()       → borra token de SecureStore
3. mobileTokenAdapter.deleteRefreshToken() → borra refresh token de SecureStore
4. React Query: queryClient.clear()       → invalida todo el caché de datos
5. seniorUI.store.reset()                 → limpia el estado de UI senior
6. Redirección a /(auth)/login
```

---

## Comunicaciones de red

- Todas las peticiones al backend se realizan sobre **HTTPS** en producción (configurado en el backend).
- La app no implementa SSL pinning adicional (el pinning nativo del SO es suficiente para el modelo de amenaza actual).
- El header `x-client-platform: mobile` permite al backend diferenciar el comportamiento de refresh sin exponer lógica adicional al cliente.

---

## Minimización de exposición de datos sensibles

### Logs

- La app no usa `console.log` con datos de tokens en código de producción.
- El cliente Axios no loguea headers de autorización.

### Capturas de pantalla

React Native en Android bloquea capturas de pantalla en modo release por defecto en pantallas sensibles cuando se configura `FLAG_SECURE`. No hay configuración específica de este flag en la app actualmente — es un área de mejora futura.

### Variables de entorno

Las variables `EXPO_PUBLIC_*` quedan embebidas en el bundle. La única variable pública es `EXPO_PUBLIC_API_URL`, que no contiene secretos. Las claves de Firebase viajan en `google-services.json` (Android) y `GoogleService-Info.plist` (iOS), que son referencias de configuración pública de FCM, no secretos de servidor.

---

## Resumen de superficie de ataque

| Vector                           | Mitigación                                                       |
| -------------------------------- | ---------------------------------------------------------------- |
| Robo de tokens del dispositivo   | expo-secure-store (Keychain / Keystore cifrado por HW)           |
| Token interceptado en tránsito   | HTTPS obligatorio en producción                                  |
| Sesión no terminada              | Logout elimina ambos tokens de SecureStore                       |
| Token expirado usado             | Interceptor de 401 fuerza logout si el refresh también falló     |
| Acceso no autorizado a pantallas | Guard en `index.tsx` + hidratación del store antes de renderizar |
| Datos en logs                    | Sin logging de tokens en producción                              |
