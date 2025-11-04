// src/utils/socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const socket = io(backendURL, {
  auth: { token },
});
