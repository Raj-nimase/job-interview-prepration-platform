/**
 * Normalizes feedback from API (string or object) for UI layers.
 */
export function getFeedbackParts(feedback) {
  if (!feedback) {
    return {
      text: "",
      score: null,
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };
  }

  if (typeof feedback === "string") {
    return {
      text: feedback,
      score: null,
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };
  }

  return {
    text: feedback.feedback || "",
    score:
      feedback.score !== undefined && feedback.score !== null
        ? Number(feedback.score)
        : null,
    strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
    weaknesses: Array.isArray(feedback.weaknesses) ? feedback.weaknesses : [],
    suggestions: Array.isArray(feedback.suggestions)
      ? feedback.suggestions
      : [],
  };
}

export function averageScoreFromHistory(history) {
  if (!Array.isArray(history) || history.length === 0) return null;
  const scores = history
    .map((h) => getFeedbackParts(h.feedback).score)
    .filter((s) => typeof s === "number" && !Number.isNaN(s));
  if (scores.length === 0) return null;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

export function scoreRingDashOffset(score, max = 10) {
  const n = Math.min(max, Math.max(0, Number(score) || 0));
  const circumference = 2 * Math.PI * 58;
  return circumference * (1 - n / max);
}

export function scoreLabel(score) {
  if (score == null || Number.isNaN(score)) return "Feedback";
  if (score >= 8.5) return "Strong match";
  if (score >= 7) return "Solid performance";
  if (score >= 5) return "Room to grow";
  return "Keep practicing";
}
