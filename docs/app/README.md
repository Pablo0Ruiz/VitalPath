# VitalPath — App Móvil

VitalPath es una aplicación móvil para pacientes desarrollada con **React Native 0.81.5** y **Expo SDK 54**, diseñada para que adultos mayores y pacientes en general puedan gestionar su salud de forma sencilla: consultar citas, revisar resultados médicos, administrar medicamentos y conversar con un asistente de IA.

---

## Visión general

| Atributo   | Valor                                     |
| ---------- | ----------------------------------------- |
| Framework  | React Native 0.81.5                       |
| Plataforma | Expo SDK 54 (new architecture habilitada) |
| Router     | Expo Router ~6.0.23 (file-based)          |
| Lenguaje   | TypeScript (strict mode)                  |
| Monorepo   | pnpm workspaces — package `vitalpath`     |
| Backend    | NestJS en `apps/api`                      |

---

## Propósito

La app conecta a pacientes con su historial médico digital. Resuelve tres problemas concretos:

1. **Fragmentación de información** — citas, medicamentos y estudios en un solo lugar.
2. **Barreras de acceso** — modo Senior UI con tipografía ampliada y áreas de toque mayores para usuarios ≥ 65 años.
3. **Seguimiento activo** — recordatorios diarios, check-in de estado de ánimo y asistente de IA integrado.

---

## Casos de uso principales

| Actor                 | Caso de uso                                                  |
| --------------------- | ------------------------------------------------------------ |
| Paciente              | Ver y gestionar sus citas médicas                            |
| Paciente              | Consultar resultados de estudios (PDF adjunto)               |
| Paciente              | Registrar y hacer seguimiento de medicamentos                |
| Paciente              | Chatear con asistente IA (texto y voz)                       |
| Paciente adulto mayor | Activar modo Senior UI de alto contraste y tipografía grande |
| Sistema               | Enviar notificaciones push ante nuevos resultados            |

---

## Pantallas principales

| Sección              | Ruta                            | Descripción                                             |
| -------------------- | ------------------------------- | ------------------------------------------------------- |
| Login                | `/(auth)/login`                 | Autenticación por email/contraseña o código 2FA         |
| Registro             | `/(auth)/register`              | Formulario multi-paso (3 pasos)                         |
| Recuperar contraseña | `/(auth)/recover-password`      | Envío de enlace por correo                              |
| Sugerencia Senior UI | `/(auth)/senior-ui-suggestion`  | Se muestra automáticamente a usuarios ≥ 65 años         |
| Dashboard            | `/(drawer)/(tabs)/home`         | Vista principal con estado diario, citas y medicamentos |
| Chat IA              | `/(drawer)/(tabs)/chat`         | Conversación con asistente (texto, voz, imágenes)       |
| Resultados médicos   | `/(drawer)/(tabs)/records`      | Listado de estudios y resultados de citas               |
| Citas                | `/(drawer)/(tabs)/appointments` | Agenda de citas con estados                             |
| Medicamentos         | `/(drawer)/(tabs)/medications`  | CRUD completo de medicamentos                           |
| Perfil               | `/(drawer)/profile`             | Datos personales editables y foto de perfil             |
| Configuración        | `/(drawer)/settings`            | Tema, modo Senior, seguridad y cierre de sesión         |

---

## Estructura de carpetas

```
apps/vitalpath/
├── app/                    # Expo Router — rutas como sistema de archivos
│   ├── index.tsx           # Punto de entrada — redirige según estado de auth
│   ├── _layout.tsx         # Root layout: proveedores, fuentes, inicialización
│   ├── (auth)/             # Stack público (sin sesión)
│   └── (drawer)/           # Drawer protegido (con sesión)
│       └── (tabs)/         # Navegación por pestañas anidada
│
├── src/
│   ├── adapters/           # Implementaciones móviles de puertos (SecureStore)
│   ├── components/ui/      # Sistema de diseño atómico
│   │   ├── atoms/          # Componentes primitivos
│   │   ├── molecules/      # Composiciones reutilizables
│   │   └── organisms/      # Bloques de función completos
│   ├── stores/             # Estado global Zustand
│   ├── hooks/              # Hooks personalizados
│   ├── lib/                # Configuración de infraestructura (API, interceptores)
│   ├── routes/             # Constantes de rutas tipadas
│   ├── utils/              # Utilidades generales
│   └── constants/          # Tokens de diseño y configuraciones
│
├── assets/                 # Fuentes Inter (5 variantes) e imágenes
├── app.json                # Configuración Expo
├── package.json
└── google-services.json    # Firebase (push notifications)
```

---

## Instalación y ejecución

### Prerequisitos

- Node.js ≥ 20
- pnpm ≥ 9
- Expo CLI (`npm install -g expo@latest`)
- Para iOS: Xcode + simulador
- Para Android: Android Studio + emulador o dispositivo físico

### Instalar dependencias

Desde la raíz del monorepo:

```bash
pnpm install
```

### Variables de entorno

Crear `apps/vitalpath/.env.local`:

```bash
# URL base del backend NestJS
EXPO_PUBLIC_API_URL=http://localhost:3000
```

> Las variables con prefijo `EXPO_PUBLIC_` quedan expuestas en el bundle. Nunca coloques secretos con ese prefijo.

### Ejecutar en desarrollo

```bash
# Modo Expo Go (escanear QR con la app Expo Go en el dispositivo)
pnpm --filter vitalpath start

# Emulador Android
pnpm --filter vitalpath android

# Simulador iOS
pnpm --filter vitalpath ios
```

### Build de producción (EAS)

```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Configurar proyecto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

---

## Documentación adicional

| Archivo                              | Contenido                                           |
| ------------------------------------ | --------------------------------------------------- |
| [architecture.md](./architecture.md) | Arquitectura, navegación y comunicación con backend |
| [security.md](./security.md)         | Manejo de tokens, guards y seguridad                |
| [privacy.md](./privacy.md)           | Datos almacenados, permisos y políticas             |
| [flows.md](./flows.md)               | Diagramas de flujo del token y datos del usuario    |
| [auth.md](./auth.md)                 | Módulo de autenticación                             |
| [dashboard.md](./dashboard.md)       | Pantalla principal                                  |
| [chat.md](./chat.md)                 | Asistente IA                                        |
| [records.md](./records.md)           | Resultados médicos                                  |
| [appointments.md](./appointments.md) | Citas médicas                                       |
| [medications.md](./medications.md)   | Gestión de medicamentos                             |
| [profile.md](./profile.md)           | Perfil del usuario                                  |
| [settings.md](./settings.md)         | Configuración de la app                             |
