import express from "express";

import {
  tts,
  transcribe,
  generate_question,
  feedback,
  generate_summary,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/transcribe", transcribe);
router.post("/tts", tts);
router.post("/generate_question", generate_question);
router.post("/feedback", feedback);
router.post("/summary", generate_summary);

export default router;
