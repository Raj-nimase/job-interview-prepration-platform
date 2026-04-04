import MockInterview from "../models/MockInterview.js";

export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all sessions for this user
    const sessions = await MockInterview.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const totalInterviews = sessions.length;

    // Total questions attempted across all sessions
    const totalQuestions = sessions.reduce(
      (sum, s) => sum + (s.questionsAsked?.length || 0),
      0,
    );

    // Total score across all questions
    const totalScoreAcrossQuestions = sessions.reduce(
      (sum, s) =>
        sum +
        (s.questionsAsked?.reduce(
          (qSum, q) => qSum + (q.feedback?.score || 0),
          0,
        ) || 0),
      0,
    );

    const averageScorePerQuestion =
      totalQuestions > 0 ? totalScoreAcrossQuestions / totalQuestions : 0;

    // Average score per session
    const averageScorePerSession =
      totalInterviews > 0
        ? sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) /
          totalInterviews
        : 0;

    const lastInterviewScore = sessions[0]?.overallScore || 0;

    // Highest scoring session
    const highestScoringSession = sessions.reduce(
      (prev, curr) =>
        (curr.overallScore || 0) > (prev.overallScore || 0) ? curr : prev,
      { overallScore: 0, role: "N/A" },
    );

    // Last 5 sessions summary
    const recentSessions = sessions.map((s) => ({
      id: s._id,
      role: s.role,
      overallScore: s.overallScore,
      questionsAttempted: s.questionsAsked?.length || 0,
      summary: s.summary || null,
      createdAt: s.createdAt || null,
    }));

    res.json({
      totalInterviews,
      totalQuestions,
      averageScorePerQuestion,
      averageScorePerSession,
      lastInterviewScore,
      highestScoringSession: {
        role: highestScoringSession.role,
        overallScore: highestScoringSession.overallScore,
      },
      recentSessions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Server error" });
  }
};
