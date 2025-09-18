import express from "express";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Submission from "../models/Submission.js";

const router = express.Router();

router.get("/questions/:topic", async (req, res) => {
  try {
    const { topic } = req.params;
    const questions = await Question.find({ topic });

    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for this topic" });
    }

    // don’t send correct answer to frontend
    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.json(safeQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const { userId, topic, answers } = req.body;

    if (!userId || !topic || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // fetch all questions of this topic
    const questions = await Question.find({ topic });

    let score = 0;

    // check each answer
    answers.forEach((ans) => {
      const q = questions.find((q) => q._id.toString() === ans.questionId);
      if (q && q.answer === ans.selectedOption) {
        score++;
      }
    });

    // store submission in DB
    const submission = new Submission({
      userId,
      topic,
      answers,
      score,
      total: questions.length,
    });
    await submission.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      total: questions.length,
    });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/submissions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await Submission.find({ userId })
      .sort({ createdAt: -1 }) // latest first
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
