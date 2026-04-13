# Adaptive Session Health Engine
## AI Interview Platform — Feature Specification & Implementation Guide

> **Feature Type:** Core Intelligence Layer  
> **Affects:** `useInterview.js`, `InterviewProvider`, `InterviewWorkspace.jsx`, `InterviewSummary.jsx`, `interviewController.js`  
> **New Files:** `config/interviewConfig.js`, `utils/sessionHealth.js`

---

## Overview

The Adaptive Session Health Engine transforms the interview from a fixed, predictable loop into an intelligent session that responds to the user's live performance. After every scored answer, a background engine evaluates the user's running performance and makes one of three decisions:

| Decision | Trigger | What Happens |
|---|---|---|
| **Continue** | Performance is on track | Next question is asked normally |
| **Extend** | User is consistently excelling | 1–2 bonus questions are added to the session |
| **Terminate** | User is consistently underperforming | Session ends early with a constructive summary |

This replaces the dumb `MAX_QUESTIONS` counter as the sole session controller. The session now ends when it *should* end — not just when it hits an arbitrary number.

---

## Why This Matters

Without this engine, the platform has two failure modes:

1. **A struggling user sits through 10 questions**, receiving low scores on every one, getting demoralized, and leaving with no clear direction. The session had no useful signal to offer after question 3.
2. **A strong user finishes 5 questions in 8 minutes**, scores 9/10 on everything, and leaves under-challenged. The session gave them no upside for their performance.

The health engine fixes both. It makes the session feel like a real interview — one that a human interviewer would naturally cut short if things were going badly, or push further if the candidate was impressive.

---

## Architecture

The engine lives entirely on the **frontend** in `useInterview.js`. It runs synchronously after every `getFeedbackAPI` response, before the UI transitions to the next question. No extra backend call is needed for the evaluation itself — all the data it needs (scores, history, question count) is already in local state.

```
User submits answer
       │
       ▼
getFeedbackAPI  ──→  score + feedback stored in history
       │
       ▼
evaluateSessionHealth(history, config)
       │
       ├──→  'continue'   ──→  getNextQuestion()
       │
       ├──→  'extend'     ──→  setQuestionCount(+N)  ──→  getNextQuestion()
       │
       └──→  'terminate'  ──→  endInterview({ earlyTermination: true })
```

---

## 1. Configuration Object

Create a new file `config/interviewConfig.js`. All thresholds live here — never hardcoded in logic files.

```js
const SESSION_HEALTH_CONFIG = {

  // --- Termination Rules ---

  // Minimum questions before the engine is allowed to terminate
  // Never end a session on question 1 or 2 — not enough data
  minQuestionsBeforeTerminate: 3,

  // If the average of the last 2 scores falls below this, terminate
  terminateIfRecentAvgBelow: 3.5,

  // If the overall session average falls below this AND score is declining, terminate
  terminateIfOverallAvgBelow: 4.0,

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
  // Multiply the termination thresholds by these factors per experience level
  // A Junior user gets more leniency; a Senior user is held to a stricter standard
  experienceModifiers: {
    junior:    { terminationLeniency: 1.2 },  // thresholds effectively 20% lower
    midlevel:  { terminationLeniency: 1.0 },  // no adjustment
    senior:    { terminationLeniency: 0.85 }, // thresholds effectively 15% higher
  },

};

module.exports = SESSION_HEALTH_CONFIG;
```

---

## 2. Core Utility: `evaluateSessionHealth()`

Create `utils/sessionHealth.js`. This is a pure function — no side effects, no API calls, fully unit-testable.

```js
const SESSION_HEALTH_CONFIG = require('../config/interviewConfig');

/**
 * Evaluates the current session performance and returns an action decision.
 *
 * @param {Array}  history       - Array of { score, question, answer, feedback } objects
 * @param {number} questionCount - Current target question count for the session
 * @param {string} experience    - 'junior' | 'midlevel' | 'senior'
 *
 * @returns {{ action: 'continue' | 'extend' | 'terminate', reason?: string, extraQuestions?: number }}
 */
function evaluateSessionHealth(history, questionCount, experience = 'midlevel') {
  const cfg = SESSION_HEALTH_CONFIG;

  // Not enough data yet — always continue
  if (history.length < cfg.minQuestionsBeforeTerminate) {
    return { action: 'continue' };
  }

  // --- Compute metrics ---
  const scores     = history.map(h => h.score);
  const avg        = scores.reduce((a, b) => a + b, 0) / scores.length;
  const recentTwo  = scores.slice(-2);
  const recentAvg  = recentTwo.reduce((a, b) => a + b, 0) / recentTwo.length;

  // Trend: score change from 3 questions ago to now (positive = improving)
  const trend = scores.length >= 3
    ? scores[scores.length - 1] - scores[scores.length - 3]
    : 0;

  // Apply experience modifier to termination thresholds
  const modifier = cfg.experienceModifiers[experience]?.terminationLeniency ?? 1.0;
  const recentThreshold  = cfg.terminateIfRecentAvgBelow  * modifier;
  const overallThreshold = cfg.terminateIfOverallAvgBelow * modifier;

  // --- Termination checks ---

  // Rule 1: Two consecutive very poor answers
  if (recentAvg < recentThreshold) {
    return {
      action: 'terminate',
      reason: 'struggling',
      message: 'Last two answers scored below the minimum threshold.'
    };
  }

  // Rule 2: Overall average is low AND the trend is getting worse
  if (avg < overallThreshold && trend < 0) {
    return {
      action: 'terminate',
      reason: 'declining',
      message: 'Overall average is below threshold and performance is declining.'
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

module.exports = { evaluateSessionHealth };
```

### Unit Test Cases

These are the scenarios you should test before integrating:

| Scenario | History | Expected Action |
|---|---|---|
| Only 2 questions answered | `[8, 7]` | `continue` (not enough data) |
| Two very poor recent answers | `[6, 5, 3, 2]` | `terminate` — struggling |
| Declining average with low overall | `[5, 4, 4, 3]` | `terminate` — declining |
| At limit, avg 8.5 | `[8, 9, 8, 9, 9]` (5/5) | `extend` — excelling (+2) |
| At limit, avg 7.2, trend positive | `[6, 7, 8, 8, 7]` (5/5) | `extend` — improving (+1) |
| At limit, avg 6.0, flat trend | `[6, 6, 6, 6, 6]` (5/5) | `terminate` — complete |
| Junior user, recent avg 3.8 | `[6, 4, 3, 4]` | `continue` (leniency modifier) |
| Senior user, recent avg 3.8 | `[6, 4, 3, 4]` | `terminate` — struggling |

---

## 3. State Changes in `InterviewProvider`

Add the following new state fields to your context:

```js
// In InterviewProvider.jsx or useInterview.js initial state

const [earlyTerminationReason, setEarlyTerminationReason] = useState(null);
// null | 'struggling' | 'declining' | 'complete' | 'manual'

const [sessionExtended, setSessionExtended] = useState(false);
// true once the session has been extended — prevents multiple extensions

const [sessionHealthLog, setSessionHealthLog] = useState([]);
// Array of { questionIndex, avg, recentAvg, trend, action } snapshots
// Used by the Summary page to render the performance curve chart

const [performanceStatus, setPerformanceStatus] = useState('neutral');
// 'strong' | 'on-track' | 'needs-work' | 'neutral'
// Drives the live PerformancePulse UI indicator
```

Expose all of these through the context value so child components can read them.

---

## 4. Integration in `useInterview.js`

Replace the current `handleNextQuestion` function with this updated version:

```js
import { evaluateSessionHealth } from '../utils/sessionHealth';
import SESSION_HEALTH_CONFIG from '../config/interviewConfig';

const handleNextQuestion = async () => {
  // 1. Run the health evaluation
  const health = evaluateSessionHealth(history, questionCount, experience);

  // 2. Log this snapshot for the summary chart
  const scores = history.map(h => h.score);
  const avg    = scores.reduce((a, b) => a + b, 0) / scores.length;
  setSessionHealthLog(prev => [...prev, {
    questionIndex: history.length,
    avg:           parseFloat(avg.toFixed(2)),
    action:        health.action,
    reason:        health.reason ?? null,
  }]);

  // 3. Update the live performance status indicator
  setPerformanceStatus(
    avg >= 7.5 ? 'strong'     :
    avg >= 5.0 ? 'on-track'   :
                 'needs-work'
  );

  // 4. Handle the engine's decision
  if (health.action === 'terminate') {
    setEarlyTerminationReason(health.reason);
    endInterview({ earlyTermination: health.reason !== 'complete' });
    return;
  }

  if (health.action === 'extend' && !sessionExtended) {
    const newCount = Math.min(
      questionCount + health.extraQuestions,
      SESSION_HEALTH_CONFIG.absoluteMaxQuestions
    );
    setQuestionCount(newCount);
    setSessionExtended(true);

    // Show a toast notification to the user
    showToast(
      health.reason === 'excelling'
        ? `Excellent performance! Adding ${health.extraQuestions} more question${health.extraQuestions > 1 ? 's' : ''}.`
        : `You're improving — adding 1 more question.`,
      'success'
    );
  }

  // 5. Proceed to next question
  await getNextQuestion();
};
```

---

## 5. Live Performance Indicator: `PerformancePulse`

This component gives the user a real-time signal so an early termination never feels like a surprise. Place it in the session header inside `InterviewWorkspace.jsx`, beside the question counter.

```jsx
// components/PerformancePulse.jsx

const STATUS_CONFIG = {
  strong:     { label: 'Strong',     color: 'var(--color-text-success)', arrow: '↑' },
  'on-track': { label: 'On track',   color: 'var(--color-text-warning)', arrow: '→' },
  'needs-work':{ label: 'Needs work',color: 'var(--color-text-danger)',  arrow: '↓' },
  neutral:    { label: '',           color: 'transparent',               arrow: ''  },
};

const PerformancePulse = ({ history, performanceStatus }) => {
  // Don't show anything until there are at least 2 scored answers
  if (history.length < 2) return null;

  const cfg = STATUS_CONFIG[performanceStatus] ?? STATUS_CONFIG.neutral;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 500,
      color: cfg.color,
      transition: 'color 0.4s ease',
    }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: cfg.color,
          display: 'inline-block',
        }}
      />
      <span>{cfg.label}</span>
      <span style={{ fontSize: 14 }}>{cfg.arrow}</span>
    </div>
  );
};

export default PerformancePulse;
```

### Usage in `InterviewWorkspace.jsx`

```jsx
// In the session header bar, next to "Question X of Y"
<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
    Question {currentQuestionIndex + 1} of {questionCount}
  </span>
  <PerformancePulse
    history={history}
    performanceStatus={performanceStatus}
  />
</div>
```

The dot and label update smoothly after each scored answer. A user who sees "Needs work ↓" for two questions in a row will not be surprised when the session ends.

---

## 6. Early Termination Summary in `InterviewSummary.jsx`

When `earlyTermination` is truthy, the summary page renders a contextual banner above the score breakdown. The messaging is honest but never harsh.

```jsx
// In InterviewSummary.jsx

const TERMINATION_COPY = {
  struggling: {
    title: 'Session ended early',
    body: "The last couple of answers scored below the minimum threshold for this role. That's completely okay — this is practice. Use the feedback below to identify exactly where to focus, and try again with those areas in mind.",
    bg: 'var(--color-background-warning)',
    color: 'var(--color-text-warning)',
  },
  declining: {
    title: 'Session ended early',
    body: "Your scores were trending downward over the session. This often happens when fatigue or topic difficulty compounds. The breakdown below shows the exact inflection point — start your next session right there.",
    bg: 'var(--color-background-warning)',
    color: 'var(--color-text-warning)',
  },
};

{earlyTerminationReason && TERMINATION_COPY[earlyTerminationReason] && (
  <div style={{
    background: TERMINATION_COPY[earlyTerminationReason].bg,
    borderRadius: 'var(--border-radius-lg)',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
    borderLeft: `3px solid ${TERMINATION_COPY[earlyTerminationReason].color}`,
    borderRadius: 0,
  }}>
    <p style={{ fontWeight: 500, color: TERMINATION_COPY[earlyTerminationReason].color, margin: '0 0 6px' }}>
      {TERMINATION_COPY[earlyTerminationReason].title}
    </p>
    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
      {TERMINATION_COPY[earlyTerminationReason].body}
    </p>
  </div>
)}
```

Also add a session extension acknowledgment banner for users who got bonus questions:

```jsx
{sessionExtended && !earlyTerminationReason && (
  <div style={{
    background: 'var(--color-background-success)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
  }}>
    <p style={{ fontWeight: 500, color: 'var(--color-text-success)', margin: '0 0 4px' }}>
      Extended session completed
    </p>
    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
      Your strong performance unlocked bonus questions. Scores from extended questions are included in your overall average.
    </p>
  </div>
)}
```

---

## 7. Backend Changes in `interviewController.js`

### `generate_summary` — context-aware narrative

Pass the termination context to Gemini so the AI narrative references the actual performance arc rather than treating every session the same:

```js
// In the generate_summary handler

const terminationContext =
  earlyTermination === 'struggling' ? `
    IMPORTANT: This session was ended early because the user scored below threshold
    on their last two answers. Your summary must acknowledge this directly but
    constructively. Identify the specific topic or competency that caused the drop
    and give concrete, actionable recovery steps. Do NOT be vague.
  ` :
  earlyTermination === 'declining' ? `
    IMPORTANT: This session was ended early due to a declining performance trend.
    Your summary should identify the inflection point (which question the scores
    started dropping) and explain what changed. Give recovery advice specific to
    those topics.
  ` :
  sessionExtended ? `
    NOTE: This session was extended because the user performed exceptionally well.
    Acknowledge this in the summary. Highlight what they did right and suggest
    what Senior-level challenges they should prepare for next.
  ` :
  `Standard session completion. Give a balanced summary.`;

const prompt = `
  You are generating a final interview performance report.
  ${terminationContext}

  Session data:
  - Role: ${role}
  - Experience: ${experience}
  - Questions answered: ${history.length}
  - Overall average score: ${overallAvg}
  - Score trend: ${trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'flat'}
  - Full Q&A history: ${JSON.stringify(history)}

  Return a JSON object with:
  {
    "nextLevelEdge": "...",     // what they did well
    "refinementAreas": "...",   // what to work on
    "recoveryPlan": "...",      // specific next steps (especially if early termination)
    "sessionVerdict": "..."     // one sentence overall verdict
  }
`;
```

---

## 8. Performance Curve Chart in `InterviewSummary.jsx`

Use the `sessionHealthLog` array (stored in context) to render a score-over-time mini chart in the Summary. This makes the arc of the session visually obvious.

```jsx
// Uses Chart.js — the canvas approach from InterviewWorkspace

const PerformanceCurveChart = ({ sessionHealthLog }) => {
  if (sessionHealthLog.length < 2) return null;

  const labels  = sessionHealthLog.map((_, i) => `Q${i + 1}`);
  const avgData = sessionHealthLog.map(s => s.avg);

  const data = {
    labels,
    datasets: [{
      label: 'Running average',
      data: avgData,
      borderColor: '#2E75B6',
      backgroundColor: 'rgba(46, 117, 182, 0.08)',
      fill: true,
      tension: 0.35,
      pointRadius: 5,
      pointBackgroundColor: avgData.map(v =>
        v >= 7.5 ? '#059669' :
        v >= 5.0 ? '#B45309' :
                   '#DC2626'
      ),
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 10, ticks: { stepSize: 2 } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Avg: ${ctx.parsed.y.toFixed(1)} / 10`
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: 180, marginBottom: '1.5rem' }}>
      <canvas id="performanceCurve" role="img" aria-label="Line chart showing running score average across questions" />
    </div>
  );
};
```

Place this chart at the top of the Summary page, before the `SummaryOverallScoreCard`. It gives the user an immediate visual read on their session arc.

---

## 9. Complete File Change Summary

| File | Change Type | What Changes |
|---|---|---|
| `config/interviewConfig.js` | **New file** | All health engine thresholds and experience modifiers |
| `utils/sessionHealth.js` | **New file** | `evaluateSessionHealth()` pure function |
| `useInterview.js` | Modified | `handleNextQuestion` integrates health evaluation, manages new state |
| `InterviewProvider.jsx` | Modified | 4 new state fields: `earlyTerminationReason`, `sessionExtended`, `sessionHealthLog`, `performanceStatus` |
| `components/PerformancePulse.jsx` | **New file** | Live status indicator component |
| `InterviewWorkspace.jsx` | Modified | Mounts `PerformancePulse` in session header |
| `InterviewSummary.jsx` | Modified | Early termination banner, extension banner, performance curve chart |
| `interviewController.js` | Modified | `generate_summary` receives termination context, generates targeted narrative |

---

## Design Principles

**Never surprise the user.** The `PerformancePulse` indicator updates after every answer. By the time a session ends early, the user has already seen "Needs work ↓" for at least two questions. The termination feels earned, not arbitrary.

**Leniency scales with experience.** A Junior candidate scoring 3.8/10 on recent answers gets more runway than a Senior candidate at the same score. The `experienceModifiers` config makes this explicit and adjustable without changing core logic.

**Extend only once.** The `sessionExtended` flag prevents runaway sessions. A user cannot keep getting extensions by maintaining a high average — the engine extends exactly once, by a bounded number of questions, then ends normally.

**The summary tells the whole story.** The `sessionHealthLog` and the performance curve chart turn the summary from a static scorecard into a narrative of what happened during the session — where the user peaked, where they dropped, and exactly what to do next.

---

*Internal Engineering Document — AI Interview Platform*
