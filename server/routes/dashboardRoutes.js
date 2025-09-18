import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import Submission from "../models/Submission.js";

const router = express.Router();

router.get("/userData/:userId", getDashboard);

router.get("/quiz-stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const topicStats = {};
    const attempts = await Submission.find({ userId });

    if (!attempts.length) {
      return res.json({
        totalQuizzes: 0,
        totalQuestions: 0,
        correct: 0,
        wrong: 0,
        accuracy: 0,
        topicWise: [],
      });
    }

    let totalQuizzes = attempts.length;
    let totalQuestions = 0;
    let correct = 0;
    let wrong = 0;

    attempts.forEach((a) => {
      const { topic, score, total } = a;

      // Update overall stats
      totalQuestions += total;
      correct += score;
      wrong += total - score;

      // Group by topic
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0 };
      }
      topicStats[topic].correct += score;
      topicStats[topic].total += total;
    });

    // Calculate overall accuracy
    const accuracy =
      totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : 0;

    // Create topic-wise stats array
    const topicWise = [];

    for (let topic in topicStats) {
      const data = topicStats[topic];
      const accuracy = ((data.correct / data.total) * 100).toFixed(1);
      topicWise.push({ topic, accuracy });
    }

    res.json({
      totalQuizzes,
      totalQuestions,
      correct,
      wrong,
      accuracy,
      topicWise,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
