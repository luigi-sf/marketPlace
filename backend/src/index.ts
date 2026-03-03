// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import path from "path";

import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";

import userRoutes from "./routes/userRoute";
import authRoutes from "./routes/authRoute";
import productRoutes from "./routes/productRoute";
import sellerProfileRoute from "./routes/sellerProfileRoute";
import categoryRoute from "./routes/categoryRoute";
import adminRoute from "./routes/adminRoute";

import { setupSwagger } from "./config/swagger";
import { setupSocket, getIo } from "./socket";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

/* ======================== MIDDLEWARES ======================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

/* ======================== ROTAS ======================== */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/sellers", sellerProfileRoute);
app.use("/categories", categoryRoute);
app.use("/admin", adminRoute);

app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "..", "uploads"))
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to marketplace 🚀" });
});

/* ======================== SWAGGER ======================== */
setupSwagger(app, port);

/* ======================== ERRO HANDLER ======================== */
app.use(errorHandler);

/* ======================== SERVER + SOCKET.IO ======================== */
const server = http.createServer(app);

// Inicializa Socket.IO com JWT e middleware
export const io = setupSocket(server);

/* ======================== SERVIDOR ======================== */
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});