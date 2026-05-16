# @repo/store

El paquete `@repo/store` encapsula el manejo del estado global del cliente utilizando Zustand, separando la lógica del estado de la plataforma donde se ejecuta.

## Propósito

- Proveer hooks reactivos y accesos no reactivos al estado global.
- Persistir la sesión de usuario y las preferencias entre recargas o inicios de aplicación.
- Mantener estados compartidos complejos como el contexto del chat de IA.

## API Pública

### Hooks y Funciones

- **`createAuthStore(storage: StorageAdapter)`**
  - **Propósito**: Fábrica para crear el store de autenticación inyectando la estrategia de almacenamiento subyacente.
  - **Estado y Acciones**:
    - `user`: Objeto del usuario logueado (`UserSession` o `null`).
    - `isAuthenticated`: Booleano derivado de la presencia de sesión.
    - `isLoading` / `_hasHydrated`: Estados de carga inicial y rehidratación asíncrona de persistencia.
    - Acciones: `setSession(user)`, `clearSession()`, `setIsLoading(boolean)`, `setHasHydrated()`.

- **`createChatContextStore()`** _(Asumido según el contenido del dir)_
  - Maneja el estado global relacionado con las interacciones del bot médico.

### Interfaces

- **`StorageAdapter`**
  - **Propósito**: Interfaz base para conectar la capa de persistencia de Zustand (`persist` middleware) con un almacenamiento real (`getItem`, `setItem`, `removeItem`).

## Consumo y Uso

**Proyectos que lo usan**: Frontend (`apps/web`) y App Móvil (`apps/vitalpath`).

### Integración con Autenticación

El store **NO** maneja ni guarda el JWT, solo guarda la **identidad** (`UserSession`). Al iniciar sesión exitosamente, se llama a `setSession(userData)` y se limpia con `clearSession()` al hacer logout.

### Ejemplo de Uso (React Native)

```typescript
import { createAuthStore } from '@repo/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Crear el store inyectando el StorageAdapter nativo
const useAuthStore = createAuthStore({
  getItem: async (name) => await AsyncStorage.getItem(name),
  setItem: async (name, value) => await AsyncStorage.setItem(name, value),
  removeItem: async (name) => await AsyncStorage.removeItem(name),
});

// 2. Usar en un componente
const ProfileScreen = () => {
  const user = useAuthStore(state => state.user);
  const clearSession = useAuthStore(state => state.clearSession);

  return (
    <View>
      <Text>Hola, {user?.name}</Text>
      <Button title="Cerrar Sesión" onPress={clearSession} />
    </View>
  );
};
```
