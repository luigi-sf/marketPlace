// src/sockets.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Conecta o socket apenas uma vez, enviando o token JWT
 */
export function connectSocket(token: string): Socket {
  if (!socket) {
    socket = io("http://localhost:3000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket?.id);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("❌ Erro ao conectar socket:", err?.message || err);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket desconectado:", reason);
    });
  }

  return socket;
}

/**
 * Desconecta e limpa o socket global (chame apenas no logout)
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🛑 Socket desconectado manualmente");
  }
}

/**
 * Retorna o socket existente ou null
 */
export function getSocket(): Socket | null {
  return socket;
}