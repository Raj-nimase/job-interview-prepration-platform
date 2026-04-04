import express from "express";
import { start_session, get_session } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start_session", start_session);
router.get("/:id", get_session);

export default router;
