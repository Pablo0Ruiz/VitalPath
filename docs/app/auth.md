# Módulo de Autenticación — App Móvil VitalPath

---

## Propósito

Gestionar la identidad del usuario en la app: login, registro multi-paso, recuperación de contraseña y detección automática del modo Senior UI para usuarios ≥ 65 años.

---

## Pantallas del módulo

| Pantalla             | Ruta                                  | Descripción                                       |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| Login                | `/(auth)/login`                       | Entrada principal — email/contraseña o código 2FA |
| Registro paso 1      | `/(auth)/register`                    | Email y contraseña                                |
| Registro paso 2      | `/(auth)/register/step-2`             | Nombre, fecha de nacimiento, género               |
| Registro paso 3      | `/(auth)/register/step-3`             | Confirmación y términos                           |
| Recuperar contraseña | `/(auth)/recover-password`            | Ingresa email para recibir enlace                 |
| Email enviado        | `/(auth)/recover-password-email-sent` | Confirmación visual                               |
| Sugerencia Senior UI | `/(auth)/senior-ui-suggestion`        | Se muestra automáticamente a usuarios ≥ 65 años   |

---

## Componentes principales

| Componente       | Tipo     | Responsabilidad                                    |
| ---------------- | -------- | -------------------------------------------------- |
| `AuthHeader`     | molecule | Logo + título de la pantalla de auth               |
| `FormField`      | molecule | Label + Input + mensaje de error (react-hook-form) |
| `SocialButton`   | atom     | Botón de acción secundario (estilo outlined)       |
| `GradientHero`   | atom     | Fondo degradado en pantallas de auth               |
| `SecurityBanner` | molecule | Banner informativo de seguridad en login           |
| `BackButton`     | atom     | Botón de retroceso en recover-password             |
| `LoadingScreen`  | atom     | Pantalla de carga mientras se hidrata el store     |

---

## Formularios y validación

Se usa **react-hook-form** con esquemas **Zod**:

```typescript
// Esquema de login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

// Esquema de código 2FA
const codigoSchema = z.object({
  codigo: z.string().length(6, 'El código debe tener 6 caracteres'),
});
```

La validación es síncrona y ocurre en el cliente antes de enviar la petición al backend.

---

## Llamadas a la API

### Login estándar

```
POST /auth/login
Body:    { email: string, password: string }
Headers: { x-client-platform: 'mobile' }

Response 200:
{
  user: UserSession,
  accessToken: string,
  refreshToken: string     ← viaja en body (no cookie) porque x-client-platform: mobile
}

Response 401: Credenciales incorrectas
Response 403: Cuenta desactivada
```

### Login con código 2FA

```
POST /auth/login-code
Body:    { codigo: string }
Headers: { x-client-platform: 'mobile' }

Response 200: { user, accessToken, refreshToken }
Response 400: Código inválido o expirado
```

### Registro

```
POST /auth/register
Body: {
  email: string,
  password: string,
  name: string,
  fechaNacimiento: string,   // DD/MM/YYYY
  genero: 'M' | 'F' | 'Otro'
}

Response 201: { user, accessToken, refreshToken }
Response 409: Email ya registrado
```

### Recuperar contraseña

```
POST /auth/forgot-password
Body: { email: string }

Response 200: { message: 'Email enviado' }
Response 404: Email no registrado
```

---

## Flujo de login estándar

```
Usuario ingresa email + contraseña
  → react-hook-form valida con Zod
  → useLogin() mutation (React Query)
    → POST /auth/login { email, password }
      → Backend valida credenciales
        ← 200: { user, accessToken, refreshToken }
  → mobileTokenAdapter.setToken(accessToken)
  → mobileTokenAdapter.setRefreshToken(refreshToken)
  → setSession(user) en auth store
  → ¿usuario.fechaNacimiento indica ≥ 65 años?
      SÍ → seniorUI.syncWithUser(user) activa modo senior
           router.replace('/(auth)/senior-ui-suggestion')
      NO  → router.replace(ROUTES.HOME)
```

---

## Flujo de registro multi-paso

```
Paso 1: email + contraseña
  → Validación Zod local
  → Estado guardado en React state (no persiste)
  → router.push('/(auth)/register/step-2')

Paso 2: nombre + fechaNacimiento + género
  → Validación Zod local
  → router.push('/(auth)/register/step-3')

Paso 3: revisión + aceptación de términos
  → POST /auth/register (con todos los datos acumulados)
  → Si OK: mismo flujo de post-login (tokens + store + redirect)
```

---

## Detección automática de modo Senior UI

Al finalizar el login o registro, la app evalúa la edad del usuario:

```typescript
const edadAnios = calcularEdad(user.fechaNacimiento); // src/utils/date.ts
if (edadAnios >= 65 && !seniorUI.hasSeenSuggestion) {
  seniorUI.setHasSeenSuggestion();
  router.replace('/(auth)/senior-ui-suggestion');
}
```

La pantalla `senior-ui-suggestion` permite al usuario aceptar o rechazar el modo. La preferencia se persiste en SecureStore vía `seniorUI.store`.

---

## Inicialización de sesión al arrancar la app

Al montar el root layout (`app/_layout.tsx`), el componente `AuthInitializer` ejecuta `useSession`:

```
App inicia
  → AuthInitializer monta
  → useSession(mobileTokenAdapter, { setSession, clearSession, setIsLoading })
    → mobileTokenAdapter.getToken()  → lee de SecureStore
      → token presente → GET /auth/me con Bearer {token}
        → 200: setSession(user)
        → 401: intenta refresh → POST /auth/refresh-mobile { refreshToken }
          → 200: nuevo token → setSession(user)
          → falla: clearSession() → app redirige a login
      → token ausente → clearSession() → app redirige a login
  → setIsLoading(false)
  → app/index.tsx redirige según user !== null
```

---

## Datos que usa este módulo

| Dato            | Origen                      | Destino                           |
| --------------- | --------------------------- | --------------------------------- |
| email, password | Input del usuario           | Body de POST /auth/login          |
| accessToken     | Respuesta del backend       | SecureStore (`vitalpath.access`)  |
| refreshToken    | Respuesta del backend       | SecureStore (`vitalpath.refresh`) |
| UserSession     | Respuesta del backend       | Zustand auth store + SecureStore  |
| Edad calculada  | UserSession.fechaNacimiento | SeniorUI store                    |
