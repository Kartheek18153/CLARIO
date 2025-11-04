import express from "express";
import {
  createStory,
  getUserStories,
  getAllStories,
  deleteStory,
  cleanupCloudinaryStorage,
} from "../controllers/storyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Create a new story (with file upload)
router.post("/create", verifyToken, upload.single("media"), createStory);

// ✅ Get current user's stories
router.get("/my", verifyToken, getUserStories);

// ✅ Get all active stories
router.get("/all", verifyToken, getAllStories);

// ✅ Delete a specific story
router.delete("/:id", verifyToken, deleteStory);

// ✅ Admin: Cleanup orphaned Cloudinary files
router.post("/cleanup-cloudinary", verifyToken, cleanupCloudinaryStorage);

export default router;
