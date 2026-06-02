# Version Gate — App Móvil VitalPath

---

## Propósito

`VersionGate` es el guardián de compatibilidad de la app. Bloquea el acceso a toda la interfaz si la versión instalada del APK es inferior a la versión mínima definida en el backend. Esto asegura que los usuarios no operen con builds obsoletos que pueden tener bugs críticos o incompatibilidades con la API.

---

## Posición en el árbol de componentes

`VersionGate` envuelve la totalidad de la aplicación en el layout raíz (`app/_layout.tsx`), dentro del `QueryClientProvider` pero fuera de cualquier pantalla de navegación:

```
<SafeAreaProvider>
  <QueryClientProvider>
    <AuthInitializer />          ← solo inicializa auth, no renderiza nada
    <VersionGate>               ← ✅ cubre toda la app
      <View>
        <StatusBar />
        <Stack>                 ← toda la navegación vive aquí
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </View>
    </VersionGate>
  </QueryClientProvider>
</SafeAreaProvider>
```

Mientras la verificación está pendiente (`isLoading === true`), `VersionGate` devuelve `null` y el splash screen permanece visible. El usuario nunca ve una pantalla en blanco.

---

## Hook: `useVersionCheck()`

**Ubicación en la app móvil:** `apps/vitalpath/src/hooks/useVersionCheck.ts`

El hook resuelve la versión actual del APK desde `Constants.expoConfig?.version` (fallback: `'1.0.0'`) y delega la consulta al hook de `@repo/api-client`:

```typescript
// apps/vitalpath/src/hooks/useVersionCheck.ts
import Constants from 'expo-constants';
import { useVersionCheck as useVersionCheckQuery } from '@repo/api-client';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export function useVersionCheck() {
  return useVersionCheckQuery(appVersion);
}
```

**Hook del paquete compartido** (`packages/api-client/src/hooks/useVersionCheck.ts`):

```typescript
export const useVersionCheck = (appVersion: string) => {
  const { data, isLoading } = useQuery({
    queryKey: healthKeys.versionCheck(appVersion),
    queryFn: () => checkAppVersion(appVersion),
    staleTime: Infinity, // ← se consulta una sola vez por sesión
    retry: false,
  });

  return {
    isBlocked: data?.status === 'blocked',
    isLoading,
    minVersion: data?.minVersion ?? null,
  };
};
```

**Valores devueltos:**

| Campo        | Tipo             | Descripción                                           |
| ------------ | ---------------- | ----------------------------------------------------- |
| `isBlocked`  | `boolean`        | `true` si el backend respondió `status: 'blocked'`    |
| `isLoading`  | `boolean`        | `true` mientras la petición HTTP está en vuelo        |
| `minVersion` | `string \| null` | Versión mínima aceptada, útil para mostrar al usuario |

---

## Endpoint: `GET /health/version-check`

```
GET /health/version-check?version={appVersion}

Autenticación: ninguna (endpoint público)
Throttling:    @SkipThrottle() — excluido del rate limiter global
```

### Query parameter

| Parámetro | Tipo     | Ejemplo | Descripción                         |
| --------- | -------- | ------- | ----------------------------------- |
| `version` | `string` | `1.2.0` | Versión semántica del APK instalado |

### Respuesta exitosa — versión soportada

```json
{
  "status": "ok",
  "minVersion": "1.2.0"
}
```

### Respuesta cuando la versión está bloqueada

```json
{
  "status": "blocked",
  "minVersion": "1.2.0",
  "message": "Update required to continue using the app."
}
```

El backend compara `major.minor.patch` de forma lexicográfica por segmentos numéricos. Si `appVersion >= minVersion` la app pasa; si es inferior, queda bloqueada.

---

## Variable de entorno: `MIN_APP_VERSION`

Definida en `apps/api/src/config/env.config.ts` y validada con Joi:

```
MIN_APP_VERSION=1.2.0   # patrón: ^d+.d+.d+$ — opcional, default: '1.0.0'
```

El controlador la lee vía `ConfigService`:

```typescript
const minVersion = this.config.get<string>('min_app_version', '1.0.0');
```

Para bloquear una versión antigua, basta con actualizar esta variable en el entorno del backend sin redeploy de código.

---

## `@SkipThrottle()` en el controlador

El controlador `HealthController` está decorado con `@SkipThrottle()` a nivel de clase. Esto excluye todos sus endpoints del throttler global de NestJS. La razón: el endpoint de version-check se llama al arrancar la app, antes de que el usuario esté autenticado, y no debe verse penalizado por límites de tasa que están pensados para proteger endpoints de negocio.

---

## `ForceUpdateScreen` — pantalla de bloqueo

Cuando `isBlocked === true`, `VersionGate` reemplaza toda la app con `ForceUpdateScreen`:

```typescript
if (isBlocked) return <ForceUpdateScreen />;
```

La pantalla muestra:

| Elemento | Contenido                                             |
| -------- | ----------------------------------------------------- |
| Icono 🔒 | Círculo con candado en color `primary600`             |
| Título   | **"Actualización requerida"**                         |
| Mensaje  | "Para continuar debe actualizar la versión del apk."  |
| Pista    | "Solicitá la versión actualizada a tu administrador." |

No hay botón de descarga automática. La distribución del APK es interna (sideloading), por lo que el usuario debe solicitar la actualización manualmente al administrador del sistema.

---

## Flujo completo de bloqueo

```
App arranca
    │
    ▼
SplashScreen visible (preventAutoHideAsync)
    │
    ▼
VersionGate monta → useVersionCheck() inicia fetch
    │
    ├─ isLoading = true → VersionGate devuelve null (splash sigue visible)
    │
    ▼
GET /health/version-check?version={appVersion}
    │
    ├─── status: 'ok'  ──────────────────────────────► App renderiza normalmente
    │                                                   SplashScreen se oculta
    │
    └─── status: 'blocked' ──────────────────────────► ForceUpdateScreen
                                                        (toda la navegación bloqueada)
```

`staleTime: Infinity` garantiza que la verificación se hace una sola vez por sesión. Si la app pasa al fondo y vuelve al primer plano, no se vuelve a consultar el endpoint.
