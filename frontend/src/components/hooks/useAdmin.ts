import { useEffect } from "react";
import { connectSocket } from "../../sockets";

export function useAdminSocket(token?: string) {
  useEffect(() => {
    if (!token) return; // espera token estar disponível

    const socket = connectSocket(token);

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("❌ Erro ao conectar socket:", err.message || err);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      // não desconecta globalmente
    };
  }, [token]);
}