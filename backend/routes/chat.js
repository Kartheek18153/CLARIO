// backend/routes/chat.js
import express from "express";
import { getMessages, sendMessage, deleteMessage } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Fetch messages for a specific chat/room
router.get("/:roomId", verifyToken, getMessages);

// Send a new message (with optional image upload)
router.post("/", verifyToken, upload.single("image"), sendMessage);

// Delete a message
router.delete("/:messageId", verifyToken, deleteMessage);

export default router;
