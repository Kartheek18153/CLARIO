// backend/server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// For ESM __dirname compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: path.join(__dirname, ".env"), override: true });

import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import setupSocket from "./config/socket.js"; // ✅ default import (no { })

// Import all routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import storyRoutes from "./routes/story.js";

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CORS setup (allow frontend to communicate)
app.use(
  cors({
    origin: "http://localhost:5173", // change when you deploy
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/story", storyRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ Create HTTP + Socket.IO server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// ✅ Setup Socket.IO events
setupSocket(io);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
