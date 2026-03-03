// src/socket.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
  sellerProfileID?: string;
}

declare module "socket.io" {
  interface Socket {
    user?: JwtPayload;
  }
}

let io: Server;

export function setupSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  // Middleware JWT
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) return next(new Error("Token não fornecido"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      socket.user = decoded;
      console.log("TOKEN DECODIFICADO:", decoded);
      next();
    } catch (err) {
      console.error("Erro JWT socket:", err);
      next(new Error("Token inválido"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id, socket.user?.id, socket.user?.role);

    if (!socket.user) return;

    socket.join(socket.user.id); // Sala individual

    if (socket.user.role === "ADMIN") {
      socket.join("admins");
      console.log(`✅ Admin ${socket.user.id} entrou na sala admins`);
    } else {
      console.log(`🔥 User ${socket.user.id} entrou na sua sala`);
    }
  });

  return io;
}

export function getIo() {
  if (!io) throw new Error("Socket.IO não inicializado");
  return io;
}