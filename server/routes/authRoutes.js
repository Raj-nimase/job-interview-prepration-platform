import express from "express";
import {
  login,
  register,
  getMe,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
// client can call this to validate/refresh current user
router.get("/me", protect, getMe);
// clear cookie on server
router.post("/logout", logout);

// router.post("/google-register", googleRegister);

export default router;
