# Videochat App

[English](#english) · [Español](#español)

---



## English

Room-based video calling web application built to explore real-time communication with **WebRTC**, **MediaStreams**, and **Socket.IO**.

Each participant chooses a username and a room. After joining, the application captures their camera and microphone, creates peer-to-peer connections with the other users in the same room, and keeps their media control states synchronized.

### Features

- Join rooms using a username and a shared room identifier.
- Check username availability against the backend before joining.
- Multi-participant video calls powered by WebRTC.
- Local microphone and camera controls.
- Real-time synchronization of every participant's media state.
- Visual indicators for the connection status, current room, and username.
- Initial-based avatar when a participant turns off their camera.
- Responsive interface built with Tailwind CSS.



### Tech stack

- [React 19](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- Google's public STUN server for peer discovery



### How it works

Socket.IO acts as the signaling channel: it announces when users join or leave and exchanges offers, answers, and ICE candidates. Once the connection has been negotiated, audio and video travel directly between browsers through WebRTC.

```text
Browser A ───── signaling ───── Socket.IO backend ───── signaling ───── Browser B
    └────────────────────── audio and video (WebRTC) ──────────────────────┘
```



### Prerequisites

- Node.js 20 or a later version compatible with Vite 7.
- [pnpm](https://pnpm.io/) to install the dependencies recorded in `pnpm-lock.yaml`.
- A compatible signaling backend running and accessible from the browser.
- Camera and microphone permissions.

> Outside `localhost`, browsers require HTTPS to access the camera and microphone.



### Installation

1. Clone the repository and enter the frontend directory:
  ```bash
   git clone <REPOSITORY_URL>
   cd fronted/Videochat-App
  ```
2. Install the dependencies:
  ```bash
   pnpm install
  ```
3. Create a `.env` file in the `Videochat-App` root directory:
  ```env
   VITE_BACKEND_URL=http://localhost:3000/
  ```
   The trailing slash is required because this URL is also used to request the `userExists/:userId` endpoint.
4. Start the development server:
  ```bash
   pnpm dev
  ```
5. Open the URL shown by Vite, usually `http://localhost:5173`.

To test a call, open the application in two browsers or devices, choose a different username in each one, and enter the exact same room name.

### Environment variable


| Variable           | Description                                                              | Example                  |
| ------------------ | ------------------------------------------------------------------------ | ------------------------ |
| `VITE_BACKEND_URL` | Base URL of the HTTP backend and Socket.IO server. It must end with `/`. | `http://localhost:3000/` |


When this variable is not defined, the Socket.IO client attempts to connect to `http://localhost:3000`. Username validation, however, requires `VITE_BACKEND_URL` to be configured.

### Expected backend contract

This repository contains only the frontend. It requires a backend implementing the following interface.

#### HTTP endpoint

```http
GET /userExists/:userId
```

Expected response:

```json
{
  "exists": false
}
```



#### Socket.IO events


| Event           | Direction       | Purpose                                          |
| --------------- | --------------- | ------------------------------------------------ |
| `join-room`     | Client → server | Add a user to a room.                            |
| `user-joined`   | Server → client | Announce that a WebRTC negotiation should begin. |
| `offer`         | Bidirectional   | Exchange the SDP offer.                          |
| `answer`        | Bidirectional   | Exchange the SDP answer.                         |
| `ice-candidate` | Bidirectional   | Exchange ICE candidates.                         |
| `media-update`  | Bidirectional   | Synchronize microphone and camera states.        |
| `remove-user`   | Server → client | Remove a disconnected participant.               |


The server must forward user-targeted messages using the `room`, `from`, and `to` fields sent by the client.

### Available scripts

```bash
pnpm dev      # start the development server on the local network
pnpm build    # run TypeScript checks and create a production build
pnpm lint     # analyze the code with ESLint
pnpm preview  # preview the production build locally
```



### Project structure

```text
src/
├── components/        # join screen and video views
├── hooks/             # media capture, controls, and WebRTC connection
├── services/          # Socket.IO client and ICE/STUN configuration
├── types/             # shared types
├── App.tsx            # main interface composition and state
├── index.css          # visual theme and Tailwind CSS configuration
└── main.tsx           # React entry point
```



### Network considerations

- The project configures a **STUN** server, but not a **TURN** server. Some corporate, mobile, or restrictive NAT networks may prevent a direct connection.
- For a production deployment, consider adding a dedicated TURN server and serving both the frontend and backend over HTTPS/WSS.
- Every participant creates a peer-to-peer connection with every other user. This architecture is suitable for small rooms; larger groups usually require an SFU.



### Project status

This is an educational and experimental project focused on learning WebRTC and MediaStreams. It does not include authentication, room persistence, text chat, or TURN infrastructure.

---



## Español

Aplicación web de videollamadas por salas construida para practicar comunicación en tiempo real con **WebRTC**, **MediaStreams** y **Socket.IO**.

Cada participante elige un nombre de usuario y una sala. Al ingresar, la aplicación captura su cámara y micrófono, establece conexiones peer-to-peer con los demás usuarios de la misma sala y mantiene sincronizado el estado de sus controles multimedia.

### Funcionalidades

- Acceso a salas mediante un nombre de usuario y un identificador compartido.
- Validación del nombre de usuario contra el backend antes de entrar.
- Videollamadas entre múltiples participantes mediante WebRTC.
- Activación y desactivación local del micrófono y la cámara.
- Sincronización del estado multimedia de cada participante.
- Indicadores visuales de conexión, sala y usuario actual.
- Avatar con inicial cuando un participante apaga su cámara.
- Interfaz responsive desarrollada con Tailwind CSS.



### Tecnologías

- [React 19](https://react.dev/) y [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- Servidor STUN público de Google para el descubrimiento de pares



### Cómo funciona

Socket.IO se utiliza como canal de señalización: comunica cuándo entra o sale un usuario e intercambia ofertas, respuestas y candidatos ICE. Una vez negociada la conexión, el audio y el video viajan directamente entre los navegadores mediante WebRTC.

```text
Navegador A ── señalización ── Backend Socket.IO ── señalización ── Navegador B
     └──────────────────── audio y video (WebRTC) ────────────────────┘
```



### Requisitos previos

- Node.js 20 o una versión posterior compatible con Vite 7.
- [pnpm](https://pnpm.io/) para instalar las dependencias incluidas en `pnpm-lock.yaml`.
- Un backend de señalización compatible, ejecutándose y accesible desde el navegador.
- Permisos de cámara y micrófono.

> Fuera de `localhost`, los navegadores requieren HTTPS para acceder a cámara y micrófono.



### Instalación

1. Cloná el repositorio y entrá al frontend:
  ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd fronted/Videochat-App
  ```
2. Instalá las dependencias:
  ```bash
   pnpm install
  ```
3. Creá un archivo `.env` en la raíz de `Videochat-App`:
  ```env
   VITE_BACKEND_URL=http://localhost:3000/
  ```
   La barra final es necesaria porque la URL también se utiliza para consultar el endpoint `userExists/:userId`.
4. Iniciá el servidor de desarrollo:
  ```bash
   pnpm dev
  ```
5. Abrí la URL que indique Vite, normalmente `http://localhost:5173`.

Para probar una llamada, abrí la aplicación en dos navegadores o dispositivos, elegí nombres de usuario diferentes e ingresá exactamente el mismo nombre de sala.

### Variable de entorno


| Variable           | Descripción                                                                | Ejemplo                  |
| ------------------ | -------------------------------------------------------------------------- | ------------------------ |
| `VITE_BACKEND_URL` | URL base del backend HTTP y del servidor Socket.IO. Debe finalizar en `/`. | `http://localhost:3000/` |


Si la variable no está definida, el cliente de Socket.IO intenta conectarse a `http://localhost:3000`; sin embargo, la validación del usuario requiere que `VITE_BACKEND_URL` esté configurada.

### Contrato esperado del backend

Este repositorio contiene únicamente el frontend. Para funcionar necesita un backend que implemente:

#### Endpoint HTTP

```http
GET /userExists/:userId
```

Respuesta esperada:

```json
{
  "exists": false
}
```



#### Eventos de [Socket.IO](http://Socket.IO)


| Evento          | Dirección          | Propósito                                          |
| --------------- | ------------------ | -------------------------------------------------- |
| `join-room`     | Cliente → servidor | Unir un usuario a una sala.                        |
| `user-joined`   | Servidor → cliente | Avisar que se debe iniciar una negociación WebRTC. |
| `offer`         | Bidireccional      | Intercambiar la oferta SDP.                        |
| `answer`        | Bidireccional      | Intercambiar la respuesta SDP.                     |
| `ice-candidate` | Bidireccional      | Intercambiar candidatos ICE.                       |
| `media-update`  | Bidireccional      | Sincronizar el estado del micrófono y la cámara.   |
| `remove-user`   | Servidor → cliente | Eliminar a un participante desconectado.           |


El servidor debe reenviar los mensajes dirigidos a un usuario respetando los campos `room`, `from` y `to` enviados por el cliente.

### Scripts disponibles

```bash
pnpm dev      # servidor de desarrollo accesible en la red local
pnpm build    # comprobación de TypeScript y build de producción
pnpm lint     # análisis estático con ESLint
pnpm preview  # vista previa local del build
```



### Estructura principal

```text
src/
├── components/        # pantalla de acceso y vistas de video
├── hooks/             # captura multimedia, controles y conexión WebRTC
├── services/          # cliente Socket.IO y configuración ICE/STUN
├── types/             # tipos compartidos
├── App.tsx            # composición y estado principal de la interfaz
├── index.css          # tema visual y configuración de Tailwind CSS
└── main.tsx           # punto de entrada de React
```



### Consideraciones de red

- El proyecto configura un servidor **STUN**, pero no un servidor **TURN**. Algunas redes corporativas, móviles o con NAT restrictivo pueden impedir la conexión directa.
- Para un despliegue de producción conviene agregar un servidor TURN propio y servir tanto frontend como backend mediante HTTPS/WSS.
- Cada participante crea una conexión peer-to-peer con los demás usuarios. Esta arquitectura es adecuada para salas pequeñas; para grupos grandes suele utilizarse un SFU.



### Estado del proyecto

Proyecto educativo y experimental orientado al aprendizaje de WebRTC y MediaStreams. No incluye autenticación, persistencia de salas, chat de texto ni infraestructura TURN.