import { io as clientIo, Socket } from "socket.io-client";

// Use environment variable or fallback to localhost
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

// Singleton socket instance
export const socket: Socket = clientIo(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // We'll connect manually
});
