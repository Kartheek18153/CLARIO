import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// ✅ Signup route
router.post("/signup", signup);

// ✅ Login route
router.post("/login", login);

// ✅ Test route (optional)
router.get("/", (req, res) => {
  res.send("Auth route working ✅");
});

export default router;
