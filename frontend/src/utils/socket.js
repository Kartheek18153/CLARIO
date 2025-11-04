// src/utils/socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const backendURL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : "http://localhost:5000";

export const socket = io(backendURL, {
  auth: { token },
});
