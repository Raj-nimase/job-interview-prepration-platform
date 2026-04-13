import express from "express";

import {
  tts,
  transcribe,
  generate_question,
  feedback,
  generate_summary,
  checkFollowUp,
  respondToClarification,
  generateWarmup,
  bookmarkQuestion,
  getCompetencyProfile,
  startInterviewSession,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/transcribe", transcribe);
router.post("/tts", tts);
router.post("/generate_question", generate_question);
router.post("/feedback", feedback);
router.post("/summary", generate_summary);

// ── New endpoints ──
router.post("/checkFollowUp", checkFollowUp);
router.post("/respondToClarification", respondToClarification);
router.post("/generateWarmup", generateWarmup);
router.post("/bookmarkQuestion", bookmarkQuestion);
router.get("/competencyProfile", getCompetencyProfile);
router.post("/startSession", startInterviewSession);

export default router;
