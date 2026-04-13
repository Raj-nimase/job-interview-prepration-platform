import SESSION_HEALTH_CONFIG from '../config/interviewConfig.js';

/**
 * Evaluates the current session performance and returns an action decision.
 *
 * @param {Array}  history       - Array of { score, question, answer, feedback } objects
 * @param {number} questionCount - Current target question count for the session
 * @param {string} experience    - 'junior' | 'midlevel' | 'senior'
 *
 * @returns {{ action: 'continue' | 'extend' | 'terminate', reason?: string, extraQuestions?: number }}
 */
export function evaluateSessionHealth(history, questionCount, experience = 'midlevel') {
  const cfg = SESSION_HEALTH_CONFIG;

  // Not enough data yet — always continue
  if (history.length < cfg.minQuestionsBeforeTerminate) {
    return { action: 'continue' };
  }

  // --- Compute metrics ---
  const scores     = history.map(h => h.feedback?.score || 0); // Need to get score from feedback
  const avg        = scores.reduce((a, b) => a + b, 0) / scores.length;
  const recentTwo  = scores.slice(-2);
  const recentAvg  = recentTwo.reduce((a, b) => a + b, 0) / recentTwo.length;

  // Trend: score change from 3 questions ago to now (positive = improving)
  const trend = scores.length >= 3
    ? scores[scores.length - 1] - scores[scores.length - 3]
    : 0;

  // Apply experience modifier to termination thresholds
  // Modifier > 1.0 = lower threshold (more lenient)
  // Modifier < 1.0 = higher threshold (stricter)
  let expKey = 'midlevel';
  if (experience) {
    const lowerExp = experience.toLowerCase();
    if (lowerExp.includes('junior') || lowerExp.includes('entry')) expKey = 'junior';
    if (lowerExp.includes('senior') || lowerExp.includes('lead') || lowerExp.includes('principal') || lowerExp.includes('manager')) expKey = 'senior';
  }
  const modifier = cfg.experienceModifiers[expKey]?.terminationLeniency ?? 1.0;
  const recentThreshold  = cfg.terminateIfRecentAvgBelow  / modifier;
  const overallThreshold = cfg.terminateIfOverallAvgBelow / modifier;

  // --- Termination checks ---

  // Rule 1: Two consecutive very poor answers (recentAvg <= threshold)
  if (recentAvg <= recentThreshold) {
    return {
      action: 'terminate',
      reason: 'struggling',
      message: 'Performance on recent questions fell below the minimum threshold for this role.'
    };
  }

  // Rule 2: Overall average is low AND the trend is getting worse
  if (avg <= overallThreshold && trend < 0) {
    return {
      action: 'terminate',
      reason: 'declining',
      message: 'Overall performance trend is declining below the required average.'
    };
  }

  // --- Extension checks (only when at or past the question limit) ---

  if (history.length >= questionCount) {
    // Rule 3: Strong overall performance
    if (avg >= cfg.extendIfAvgAbove) {
      return {
        action: 'extend',
        reason: 'excelling',
        extraQuestions: cfg.extensionQuestionsOnStrong
      };
    }

    // Rule 4: Good performance with a positive trend
    if (avg >= cfg.extendIfAvgAboveWithPositiveTrend && trend > 0) {
      return {
        action: 'extend',
        reason: 'improving',
        extraQuestions: cfg.extensionQuestionsOnImproving
      };
    }

    // At the question limit but not excelling — end normally
    return { action: 'terminate', reason: 'complete' };
  }

  // Default — keep going
  return { action: 'continue' };
}
