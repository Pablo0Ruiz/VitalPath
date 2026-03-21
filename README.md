# VitalPath AI 🩺

VitalPath AI es una aplicación móvil de salud inteligente desarrollada con **React Native (Expo)** y un backend **NestJS**, estructurada como monorepo con **Turborepo**. Su objetivo es acompañar al usuario en su bienestar a través de una interfaz conversacional potenciada por la IA de Google Gemini, permitiendo consultas de salud personalizadas con soporte de texto e imágenes.

---

## 🚀 Primeros pasos

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/) v8 o superior
- [Expo Go](https://expo.dev/go) instalado en tu dispositivo físico o simulador iOS/Android

### 1. Clonar el repositorio

```bash
git clone https://github.com/Pablo0Ruiz/VitalPath_AI.git
cd VitalPath_AI
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` dentro de `apps/vitalpath/` con el siguiente contenido:

```env
EXPO_PUBLIC_API_URL=http://<TU_IP_LOCAL>:3000
```

> Reemplaza `<TU_IP_LOCAL>` con la IP de tu máquina en la red local (ej. `192.168.1.10`). Puedes obtenerla con `ipconfig` (Windows) o `ifconfig` (macOS/Linux).

Crea también un archivo `.env` dentro de `apps/api/` con:

```env
PORT=3000
MONGO_URI=<tu_uri_de_mongodb>
MONGO_DB_NAME=vitalpathdb
JWT_SECRET=<tu_secreto_jwt>
GEMINI_API_KEY=<tu_api_key_de_gemini>
```

### 4. Iniciar el backend (API)

Abre una terminal y ejecuta:

```bash
pnpm --filter api start:dev
```

### 5. Iniciar la aplicación móvil

Abre otra terminal y ejecuta:

```bash
pnpm --filter vitalpath start
```

Escanea el código QR con **Expo Go** desde tu dispositivo, o presiona `i` para iOS / `a` para Android en el simulador.

---

## ✨ Funcionalidades disponibles

### 🔐 Autenticación

- **Registro de usuario** — Crea una cuenta nueva con email y contraseña.
- **Inicio de sesión** — Accede a tu cuenta de forma segura. La sesión se mantiene activa gracias a JWT almacenado de forma segura en el dispositivo.

### 🤖 Chat con IA (Gemini)

- Conversación en tiempo real con **Google Gemini** mediante streaming de respuestas.
- Soporte para mensajes de **texto** e **imágenes** (adjunta fotos directamente desde tu galería).
- Historial de conversación persistente durante la sesión para mantener el contexto.
- Respuestas formateadas en **Markdown** y en **español**.
- Indicador visual de "Gemini está escribiendo..." mientras se genera la respuesta.

---

## 🗂️ Estructura del monorepo

```
VitalPathAI/
├── apps/
│   ├── vitalpath/   # App móvil (React Native + Expo)
│   └── api/         # Backend REST (NestJS)
└── packages/        # Paquetes compartidos
```

---

## 🛠️ Stack tecnológico

| Capa     | Tecnología                          |
| -------- | ----------------------------------- |
| Mobile   | React Native, Expo, Zustand         |
| Backend  | NestJS, MongoDB (Mongoose)          |
| IA       | Google Gemini API (`@google/genai`) |
| Auth     | JWT, Passport.js                    |
| Monorepo | Turborepo, pnpm workspaces          |
| Lenguaje | TypeScript                          |
