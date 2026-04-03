import express from "express";
import Question from "../models/Question.js";
import Submission from "../models/Submission.js";

const router = express.Router();

// Minimum percentage score needed to unlock the next level
const PASS_THRESHOLD = 60;

// Get questions for a topic + level
router.get("/questions/:topic/:level", async (req, res) => {
  try {
    const { topic, level } = req.params;
    const questions = await Question.find({
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
      level: Number(level),
    });

    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for this topic and level" });
    }

    // Don't send correct answer to frontend
    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      topic: q.topic,
      level: q.level,
    }));

    res.json(safeQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Legacy support) Get questions for a topic (all levels)
router.get("/questions/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    const questions = await Question.find({
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
    });

    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for this topic" });
    }

    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      topic: q.topic,
      level: q.level,
    }));

    res.json(safeQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit quiz answers
router.post("/submit", async (req, res) => {
  try {
    const { userId, topic, level, answers } = req.body;

    if (!userId || !topic || !answers || !level) {
      return res.status(400).json({ error: "Missing required fields (userId, topic, level, answers)" });
    }

    // Fetch all questions of this topic + level
    const questions = await Question.find({
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
      level: Number(level),
    });

    let score = 0;

    // Check each answer
    answers.forEach((ans) => {
      const q = questions.find((q) => q._id.toString() === ans.questionId);
      if (q && q.answer === ans.selectedOption) {
        score++;
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= PASS_THRESHOLD;

    // Store submission in DB
    const submission = new Submission({
      userId,
      topic,
      level: Number(level),
      answers,
      score,
      total,
      passed,
    });
    await submission.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      total,
      percentage,
      passed,
      levelUnlocked: passed ? Number(level) + 1 : Number(level),
    });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's progress for a specific topic (which levels are unlocked)
router.get("/progress/:userId/:topic", async (req, res) => {
  try {
    const { userId, topic } = req.params;

    // Find all passed submissions for this user & topic
    const passedSubmissions = await Submission.find({
      userId,
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
      passed: true,
    }).sort({ level: 1 });

    // The unlocked level is 1 + the highest passed level (or 1 if none)
    let unlockedLevel = 1;
    for (const sub of passedSubmissions) {
      if (sub.level >= unlockedLevel) {
        unlockedLevel = sub.level + 1;
      }
    }

    // Cap at max level 5
    if (unlockedLevel > 5) unlockedLevel = 5;

    // Get all submissions for history
    const allSubmissions = await Submission.find({
      userId,
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      topic,
      unlockedLevel,
      totalAttempts: allSubmissions.length,
      submissions: allSubmissions.slice(0, 10), // latest 10
    });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all submissions for a user
router.get("/submissions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for this user" });
    }

    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
