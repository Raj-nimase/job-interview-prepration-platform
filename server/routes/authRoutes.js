import express from "express";
import {
  login,
  register,
 handleGoogleAuth
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google", handleGoogleAuth);

// router.post("/google-register", googleRegister);

export default router;
