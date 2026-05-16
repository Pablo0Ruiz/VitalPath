# Privacidad de los Datos en Paquetes Compartidos

El manejo de la privacidad y los datos sensibles (PII) de los usuarios es crítico. La carpeta `packages/` contiene lógica que interactúa con estos datos, asegurando que se gestionen bajo los estándares adecuados.

## Paquetes Relacionados con Datos Sensibles

1. **`@repo/store`**
   - **`auth.store.ts`**: Almacena el objeto `user` (tipo `UserSession` definido en `@repo/types`). Este objeto contiene información vital del usuario (e.g., ID, rol, email).
   - **Privacidad del Store**: El diseño del store separa la persistencia (a través de `StorageAdapter`). Esto es clave porque permite que, dependiendo de la plataforma, los datos sensibles se guarden en almacenamientos encriptados (como `SecureStore` en React Native) en lugar de un `localStorage` plano.
   - La información manejada en este store debe ser la mínima necesaria para mostrar la UI (principio de privilegios mínimos). Los datos clínicos y de salud profundamente sensibles no deben persistirse aquí de forma permanente.

2. **`@repo/types`**
   - Define los esquemas (usando Zod) y las interfaces de los modelos, incluyendo datos médicos y perfiles de usuario.
   - **Validación y Filtrado**: Al usar esquemas de validación estrictos en el frontend y el backend, se garantiza que solo se procesen y expongan los campos estrictamente necesarios, previniendo fugas de información.

3. **`@repo/api-client`**
   - Transporta datos sensibles (incluyendo el token de sesión) entre el cliente y el backend.
   - No registra (loguea) los payloads de peticiones ni las cabeceras `Authorization`, evitando que los tokens o datos médicos terminen en consolas o sistemas de monitoreo externos.

## Mecanismos de Minimización de Datos

- **Tipado Estricto**: `UserSession` solo contiene datos de presentación y control de acceso.
- **Sin Persistencia Innecesaria**: Estados temporales como historiales médicos o resultados de interacciones de IA no se persisten en el almacenamiento del dispositivo si no es estrictamente necesario (o se persisten con cifrado).
- **Adaptadores Seguros**: La arquitectura de inyección de adaptadores obliga al consumidor (Next.js o Expo) a decidir conscientemente qué mecanismo de almacenamiento usar, fomentando el uso de APIs seguras nativas en entornos móviles.
