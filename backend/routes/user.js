import express from "express";
import {
  getAllUsers,
  getMe,
  updateProfile,
  uploadProfilePic,
  deleteAccount,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Fetch all users (for chat list)
router.get("/all", getAllUsers);

// ✅ Fetch current logged-in user
router.get("/me", verifyToken, getMe);

// ✅ Update user profile
router.put("/update", verifyToken, updateProfile);

// ✅ Upload profile picture
router.post("/upload", verifyToken, upload.single("profile_pic"), uploadProfilePic);

// ✅ Delete account
router.delete("/delete", verifyToken, deleteAccount);

export default router;
