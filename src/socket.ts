import { io } from "socket.io-client";
const url = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
console.log(url);
export const socket = io(url, {
  transports: ["websocket"],
});
