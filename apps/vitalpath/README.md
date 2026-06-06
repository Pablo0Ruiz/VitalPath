# VitalPath — App Móvil

Aplicación móvil desarrollada con **React Native + Expo** para la plataforma VitalPath AI. Dirigida a pacientes y sus cuidadores, permite gestionar citas, medicamentos, registros de salud y comunicarse con un asistente de IA.

---

## ¿Qué hace?

- Permite al paciente ver y gestionar sus **citas médicas** y recibir recordatorios push
- Muestra el **calendario de medicamentos** con horarios y alertas
- Accede al **asistente de IA** (Groq) mediante texto o voz para consultas de salud
- Registra el **estado de ánimo** diario (mood check-in)
- Almacena y visualiza **registros de salud** (resultados, documentos médicos)
- Soporta el rol de **cuidador**: vincula su cuenta con la del paciente y accede a su información
- Incluye un **modo de accesibilidad para adultos mayores** con UI adaptada

---

## Tech stack

| Herramienta                | Uso                                                    |
| -------------------------- | ------------------------------------------------------ |
| React Native + Expo SDK 54 | Framework principal multiplataforma (iOS + Android)    |
| Expo Router v6             | Navegación file-based con rutas tipadas                |
| React Navigation           | Drawer + tabs para la navegación principal             |
| UI Kitten                  | Componentes de UI accesibles y temátizables            |
| Zustand (`@repo/store`)    | Estado global compartido con el portal web             |
| TanStack React Query       | Fetching, caché e invalidación de datos del servidor   |
| Axios (`@repo/api-client`) | Cliente HTTP con interceptores de autenticación        |
| React Hook Form + Zod      | Formularios con validación en el cliente               |
| Expo Notifications         | Notificaciones push locales y remotas                  |
| Expo Secure Store          | Almacenamiento seguro de tokens JWT                    |
| Expo Image Picker          | Selección de imágenes para perfil y registros de salud |
| Expo Audio + Speech        | Entrada de voz para el asistente de IA                 |
| Sentry                     | Monitoreo de errores en producción                     |

---

## Pantallas

### Autenticación

| Pantalla             | Descripción                                                    |
| -------------------- | -------------------------------------------------------------- |
| Login                | Inicio de sesión con email y contraseña                        |
| Registro             | Registro en 3 pasos (datos personales, contacto, confirmación) |
| Registro cuidador    | Flujo específico para registrarse como cuidador                |
| Recuperar contraseña | Solicitud de recuperación vía email                            |
| Sugerencia UI senior | Propone activar el modo de accesibilidad para adultos mayores  |

### Aplicación principal (drawer + tabs)

| Pantalla           | Descripción                                                                           |
| ------------------ | ------------------------------------------------------------------------------------- |
| Home               | Resumen del día: citas próximas, medicamentos pendientes, estado de ánimo             |
| Chat IA            | Asistente conversacional con Groq (texto y voz); puede consultar citas y medicamentos |
| Citas              | Lista, detalle y gestión de citas médicas                                             |
| Medicamentos       | Calendario de medicamentos con horarios y dosis                                       |
| Registros de salud | Historial de documentos y resultados médicos                                          |
| Perfil             | Edición de datos personales y foto de perfil                                          |
| Configuración      | Preferencias de la app (notificaciones, accesibilidad, idioma)                        |
| Cuidadores         | Lista de cuidadores vinculados (vista del paciente)                                   |
| Pacientes          | Lista de pacientes a cargo (vista del cuidador)                                       |
| Vincular           | Flujo para vincular una cuenta de paciente con un cuidador                            |

---

## Variables de entorno

Crear un archivo `.env` en `apps/vitalpath/`:

```env
EXPO_PUBLIC_API_URL=http://<ip-local-de-tu-máquina>:3000
```

> La app necesita la IP local de tu máquina (no `localhost`) para comunicarse con la API desde el dispositivo/emulador.  
> En macOS/Linux: `ifconfig | grep "inet "` → buscá una IP tipo `192.168.x.x`.  
> En Windows: `ipconfig` → buscá `IPv4`.

---

## Ejecutar la app

```bash
# Iniciar el servidor de Expo
pnpm start

# Abrir en simulador iOS
pnpm ios

# Abrir en emulador Android
pnpm android

# Build de Android (preview)
pnpm build:android
```

Desde la raíz del monorepo:

```bash
pnpm --filter vitalpath start
```

Escanear el QR con **Expo Go** en el dispositivo físico, o presionar `i` / `a` en la terminal para abrir el simulador correspondiente.

---

## Tests

```bash
pnpm test
```

Los tests usan **Jest** con `jest-expo` preset. Los mocks globales están en `jest.setup.js` (incluye `expo-secure-store`, `expo-notifications`, `react-native-mmkv`, etc.).
