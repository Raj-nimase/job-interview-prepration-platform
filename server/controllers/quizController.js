import QuizAttempt from "../models/quizAttemptModel.js";

export const submitQuiz = async (req, res) => {
  const { score, totalQuestions } = req.body;
  const userId = req.user.id;

  if (!score || !totalQuestions) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const accuracy = Math.round((score / totalQuestions) * 100);

  const submission = await QuizAttempt.create({
    user: userId,
    score,
    totalQuestions,
    accuracy,
  });

  res.status(201).json({ message: "Quiz submitted", submission });
};

export const getUserStats = async (req, res) => {
  const userId = req.user.id;

  const submissions = await QuizAttempt.find({ user: userId });
  const totalQuizzes = submissions.length;

  const averageAccuracy =
    submissions.reduce((acc, cur) => acc + cur.accuracy, 0) /
    (submissions.length || 1);

  res.status(200).json({
    quizzesAttempted: totalQuizzes,
    averageAccuracy: Math.round(averageAccuracy),
    latest: submissions.slice(-4), // For chart if needed
  });
};


export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.find().limit(5); // adjust logic
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions" });
  }
};