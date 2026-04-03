import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

// Add questions (bulk)
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res
        .status(400)
        .json({ error: "Request body must be a non-empty array of questions" });
    }

    // Validate each question
    for (const q of data) {
      const { topic, level, question, options, answer } = q;
      if (
        !topic ||
        !level ||
        !question ||
        !options ||
        !Array.isArray(options) ||
        answer === undefined
      ) {
        return res.status(400).json({
          error:
            "Each question must have topic, level, question, options (array), and answer",
        });
      }

      if (!options.includes(answer)) {
        return res.status(400).json({
          error: `Answer must be one of the options for question: "${question}"`,
        });
      }
    }

    // Save all questions
    const newQuestions = await Question.insertMany(data);

    res.status(201).json({
      message: "Questions added successfully",
      count: newQuestions.length,
      questions: newQuestions,
    });
  } catch (error) {
    console.error("Error adding questions:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all questions for a topic
router.get("/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    const questions = await Question.find({
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
    });

    if (!questions.length) {
      return res
        .status(404)
        .json({ error: "No questions found for this topic" });
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get questions for a topic + level
router.get("/:topic/:level", async (req, res) => {
  try {
    const { topic, level } = req.params;
    const questions = await Question.find({
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
      level: Number(level),
    });

    if (!questions.length) {
      return res
        .status(404)
        .json({ error: "No questions found for this topic and level" });
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all questions (admin/debug)
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
