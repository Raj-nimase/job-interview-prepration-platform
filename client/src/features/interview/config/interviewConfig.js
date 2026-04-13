const SESSION_HEALTH_CONFIG = {

  // --- Termination Rules ---

  // Minimum questions before the engine is allowed to terminate
  // Never end a session on question 1 or 2 — not enough data
  minQuestionsBeforeTerminate: 3,

  // If the average of the last 2 scores falls below this, terminate
  terminateIfRecentAvgBelow: 3.5,

  // If the overall session average falls below this AND score is declining, terminate
  terminateIfOverallAvgBelow: 6.0,

  // --- Extension Rules ---

  // If overall avg is above this when the session hits its question limit, extend
  extendIfAvgAbove: 8.0,

  // If overall avg is above this AND trend is positive, extend (softer threshold)
  extendIfAvgAboveWithPositiveTrend: 7.0,

  // How many bonus questions to add on strong performance
  extensionQuestionsOnStrong: 2,

  // How many bonus questions to add on improving-but-not-stellar performance
  extensionQuestionsOnImproving: 1,

  // Hard cap — a session can only be extended once, maximum this many questions total
  absoluteMaxQuestions: 20,

  // --- Experience Level Modifiers ---
  // Division logic: base_threshold / modifier
  // Modifier > 1.0 reduces the threshold (leniency)
  // Modifier < 1.0 increases the threshold (strictness)
  experienceModifiers: {
    junior:    { terminationLeniency: 1.4 },  // e.g. 3.5 / 1.4 = 2.5 threshold
    midlevel:  { terminationLeniency: 1.0 },  // 3.5 / 1.0 = 3.5 threshold
    senior:    { terminationLeniency: 0.7 },  // e.g. 3.5 / 0.7 = 5.0 threshold
  },

};

export default SESSION_HEALTH_CONFIG;
