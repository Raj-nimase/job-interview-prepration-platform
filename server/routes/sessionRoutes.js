import express from "express";
import { start_session } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start_session", start_session);

export default router;
