import express from "express";
import multer from "multer";
import {
  analyzeResume,
  getAnalysisHistory,
} from "../controllers/resumeController.js";

const router = express.Router();

// Store file in memory buffer for pdf-parse
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

router.post("/analyze", upload.single("resume"), analyzeResume);
router.get("/history/:userId", getAnalysisHistory);

export default router;
