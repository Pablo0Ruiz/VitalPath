# Módulo de Autenticación (`auth`)

## Propósito

Gestionar la identidad y el acceso a la plataforma VitalPath AI. Se encarga exclusivamente del inicio de sesión, el manejo de errores de credenciales, y la derivación de los usuarios a su espacio protegido respectivo según su rol.

## Rutas / Páginas Principales

- **`/login`**: Formulario principal de ingreso al sistema.

## Componentes Clave

- `LoginForm`: Contiene la lógica del formulario (utilizando `react-hook-form` + `zod` para validar formato de email y requerir contraseña).
- `SessionGate` / `AuthProvider`: Encargados de abstraer la lógica de hidratación y manejo de tokens.

## Llamadas a la API

- **Método y URL:** `POST /login`
- **Datos enviados:** `{ email, password }`
- **Datos recibidos:** `{ access_token, user: { id, email, role, ... } }` y se setea una cookie `httpOnly` para el refresh.

## Flujos Típicos

1. El usuario intenta navegar a `/dashboard`.
2. El middleware `proxy.ts` detecta que no hay token válido y hace redirect a `/login?message=no_token_found`.
3. El componente en `/login` captura el `message` de los query params y despliega un _toast_ ("Por favor inicie sesión").
4. El usuario rellena los datos, pulsa el botón; el formulario se valida en el cliente sin requerir recargar.
5. Si es exitoso, la función `login` de Zustand (o context) llama al backend. Se guarda el token retornado y se redirige con `next/navigation` o `window.location.href` de nuevo hacia el `/dashboard`.
