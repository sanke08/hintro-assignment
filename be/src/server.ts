import http from "http";
import app from "./app.js";
import { Server } from "socket.io";

const server = http.createServer(app);

// server.ts
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.VITE_FE_URL!], // Match Express
    credentials: true,
  },
  transports: ["websocket", "polling"], // Add polling as fallback
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-board", (boardId: string) => {
    console.log(`Socket ${socket.id} joining board:${boardId}`);
    socket.join(`board:${boardId}`);
  });

  socket.on("leave-board", (boardId: string) => {
    console.log(`Socket ${socket.id} leaving board:${boardId}`);
    socket.leave(`board:${boardId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, "Reason:", reason);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });
});

io.engine.on("connection_error", (err) => {
  console.error("❌ Connection error:", err);
});

export default server;
