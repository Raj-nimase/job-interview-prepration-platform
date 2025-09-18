import express from "express";

import {
  tts,
  transcribe,
  generate_question,
  feedback,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/transcribe", transcribe);
router.post("/tts", tts);
router.post("/generate_question", generate_question);
router.post("/feedback", feedback);

export default router;
