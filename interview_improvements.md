# Job Interview Preparation Platform
## AI Interview Flow — Feature Improvement Specification
**Version 2.0 | Engineering Reference Document**

---

## Overview

This document specifies the improvements to be implemented on the AI Mock Interview platform. It extends the existing three-phase flow (Setup → Active Session → Summary) and introduces new modules, backend calls, and UI components that bring the experience closer to a real-world interview. Each section documents the rationale, the implementation approach, the new backend calls required, and the changes needed in existing components.

Improvements are ordered by implementation priority. High-impact items that most fundamentally change the interview experience are listed first.

---

## Improvement Roadmap

| Feature | Priority | Effort | Phase Affected |
|---|---|---|---|
| AI Follow-up Drilling | 🔴 Critical | Medium | Active Session |
| Timed Pressure Per Question | 🔴 Critical | Low | Active Session |
| Behavioral / STAR Mode | 🔴 Critical | Medium | Setup + Active Session |
| Communication Quality Scoring | 🟡 High | Medium | Active Session + Summary |
| Side-by-Side Ideal Answer | 🟡 High | Low | Active Session + Summary |
| Company & JD Context Input | 🟡 High | Low | Setup |
| Clarifying Question Phase | 🟠 Medium | Medium | Active Session |
| Live Code / Whiteboard Panel | 🟠 Medium | High | Active Session |
| Interviewer Persona Variety | 🟠 Medium | Low | Setup + Active Session |
| Cross-Session Progress Tracking | 🟠 Medium | Medium | Summary + Dashboard |
| Adaptive Difficulty | 🟠 Medium | High | Setup + Active Session |
| Warm-up Round | 🟢 Polish | Low | Active Session |
| Voice Playback in Feedback | 🟢 Polish | Low | Active Session |
| Bookmark & Retry Questions | 🟢 Polish | Low | Summary + Setup |

---

## 1. AI Follow-up Drilling

This is the single highest-impact addition to the platform. Currently the session flow is a simple loop: question → answer → feedback → next question. Real interviews are conversations. When a candidate gives a vague or incomplete answer, the interviewer probes deeper. This improvement introduces that dynamic.

### Rationale

A vague answer that scores below threshold should not advance the session. Instead, the AI should generate a targeted follow-up probe (e.g., "Can you give me a concrete example from a past project?") and await a second response. This forces the user to practice the skill of defending and elaborating on their answers — a critical real-interview competency.

### User Flow Change

1. User submits answer.
2. Backend evaluates answer and returns a preliminary score + a `shouldFollowUp` flag.
3. If `shouldFollowUp` is true, the UI enters a **Follow-up Phase** instead of showing full feedback.
4. The AI probe question is displayed and spoken via TTS.
5. User answers the follow-up. The combined answer + follow-up answer is re-evaluated.
6. Full feedback is shown. Session advances.

### New Backend Call: `checkFollowUp`

**POST `/api/interview/checkFollowUp`**

| Field | Detail |
|---|---|
| **Input** | `{ sessionId, questionId, answer, role, experience }` |
| **Output** | `{ shouldFollowUp: boolean, followUpQuestion: string, prelimScore: number }` |
| **Logic** | Gemini evaluates the answer. If the response is generic, under-evidenced, or missing STAR structure (for behavioral questions), `shouldFollowUp` is set to `true` and a targeted probe is generated. |
| **Threshold** | `shouldFollowUp` triggers when `prelimScore < 6` OR when key competency signals are absent from the answer. |

### Component Changes

- **`AnswerCard`** — Add a `followUpMode` state. When active, hide the normal answer controls and render a secondary recording/typing interface with the follow-up question displayed at the top.
- **`QuestionFeedbackPanel`** — Show a combined transcript of the original answer + follow-up response. Label them clearly ("Your initial answer", "Your follow-up").
- **`useInterview` hook** — Add `followUpQuestion` and `isFollowUpPhase` to global state. Add `submitFollowUp(answer)` action that calls `checkFollowUp`, then `getFeedbackAPI` with the full combined context.

---

## 2. Timed Pressure Per Question

Real interviews have implicit time constraints. Candidates who take 5 minutes to answer a 90-second question signal poor communication. Adding a visible countdown per question trains the user to give concise, structured answers under pressure.

### Implementation

- Each question starts a countdown timer (default: 120 seconds, configurable by role and experience level in the Setup phase).
- The timer is displayed as a visual progress ring in the `QuestionCard` header.
- At 30 seconds remaining, the ring pulses amber. At 10 seconds, it turns red.
- When the timer expires, the answer is auto-submitted with the current transcript or typed content. If nothing was recorded, a `"No answer submitted"` flag is set.
- The timer pauses when the TTS audio is playing and resumes when audio ends.

### New State Fields in `useInterview`

```js
questionTimeLimit: number   // seconds, set during setup
timeRemaining: number       // counts down during active phase
timerExpired: boolean       // triggers auto-submit
```

### Scoring Impact

The feedback prompt sent to Gemini should include the time taken to answer. The feedback object should include a new `conciseness` field alongside strengths and weaknesses, noting whether the user was over-time, under-time, or well-paced.

---

## 3. Behavioral / STAR Mode

Most non-technical interviews are almost entirely behavioral. The current platform treats all question types identically. Adding a dedicated Behavioral track with STAR-aware scoring is a major differentiator.

### Setup Phase Change

Add a third input to `RoleSelector`: **Interview Type**, with options: `Technical`, `Behavioral`, and `Mixed`. This selection is stored in context and localStorage alongside role and experience.

### STAR Scoring

Behavioral answers should be scored across four explicit dimensions that map to the STAR framework:

| Component | What Gemini Checks | Score Weight |
|---|---|---|
| **Situation** | Did the user set a clear, specific context? Is the scenario relevant to the question? | 20% |
| **Task** | Did the user define their individual responsibility clearly? Is ownership established? | 20% |
| **Action** | Are concrete, specific actions described? Is the "I" vs "we" distinction clear? | 40% |
| **Result** | Is there a measurable or observable outcome? Does the user reflect on what they learned? | 20% |

### Component Changes

- **`QuestionFeedbackPanel`** — In Behavioral mode, replace the single score display with a STAR breakdown card showing four sub-scores and a color-coded indicator (green ≥ 7, amber 4–6, red ≤ 3) for each component.
- **`SummaryQuestionBreakdown`** — Show the STAR sub-scores per behavioral question. Add a column to the timeline for question type (Technical / Behavioral).

---

## 4. Communication Quality Scoring

Technical accuracy is only one dimension of interview performance. Delivery matters: filler words, pace, clarity of structure, and confidence all affect how a candidate is perceived. This improvement surfaces delivery quality as a separate scored dimension.

### Filler Word Detection

After transcription (`transcribeAudio`), run a lightweight client-side scan of the transcript string for filler words before sending to Gemini. Track counts per category:

- **Hesitation fillers:** "um", "uh", "er", "hmm"
- **Padding fillers:** "like", "you know", "kind of", "sort of", "basically", "literally"
- **Sentence starters:** "so", "and so", "I mean", "right"

### New Feedback Fields

Extend the feedback object returned by `getFeedbackAPI` to include a `delivery` section:

```js
delivery: {
  fillerWordCount: number,
  fillerWordRate: number,        // per 100 words
  pacingScore: number,           // 1–10, evaluated by Gemini from word count vs time
  clarityScore: number,          // 1–10, how structured and easy to follow
  overallDeliveryScore: number   // weighted composite
}
```

### UI Changes

- **`QuestionFeedbackPanel`** — Add a **Delivery** tab alongside the **Content** tab. Show the filler word breakdown with a count list. Show pacing and clarity scores as labeled bars.
- **`SummaryOverallScoreCard`** — Show two scores: **Content Score** and **Delivery Score**. The overall session score is a weighted average (70% content, 30% delivery).

---

## 5. Side-by-Side Ideal Answer

Generic feedback like "strengthen your examples" is harder to act on than seeing a model answer alongside your own. This feature makes the feedback immediately actionable.

### Implementation

The `getFeedbackAPI` response already includes a `suggestedAnswer` field. This improvement changes how it is presented in the UI.

- **`QuestionFeedbackPanel` layout change** — Split the feedback panel into two columns: the left column shows the user's transcribed answer with inline annotations (highlighting phrases flagged as weak, marking missing components), and the right column shows the Gemini-generated model answer.
- **Diff highlighting** — Run a simple word-level diff between the user's answer and the model answer client-side. Highlight content present in the model answer but absent from the user's answer in a soft amber background.
- **Collapsed by default on mobile** — On narrow viewports, collapse the model answer behind a "Show ideal answer" toggle to avoid layout overflow.

---

## 6. Company & Job Description Context Input

Allowing users to paste a real job description transforms the platform from a generic interview tool into targeted, company-specific preparation. A question about "your experience with high-traffic systems" is far more useful when it references the actual JD requirements.

### Setup Phase Change (`RoleSelector`)

Add an optional third step below the role/experience selectors:

- A textarea labeled **"Paste job description (optional)"** with a character limit of 3,000.
- A text input labeled **"Target company"** (optional, e.g., "Google", "HDFC Bank").
- Both fields are stored in context and localStorage as `jobDescription` and `targetCompany`.

### Backend Change: `generateQuestion`

When `jobDescription` is present, prepend it to the Gemini system prompt. Instruct Gemini to:

- Extract key technical requirements, values, and competencies from the JD.
- Prioritize questions that directly address those requirements.
- Reference the company name and context in behavioral questions where appropriate (e.g., "At a company like [targetCompany], how would you approach...").

---

## 7. Clarifying Question Phase

In real interviews, candidates are encouraged to ask clarifying questions before answering — especially for ambiguous or complex questions. This signals strategic thinking. The platform should reward this behavior.

### User Flow

1. After a question is displayed and spoken, a brief window (15 seconds, skippable) appears before the answer timer starts.
2. During this window the user can click **"Ask a clarification"** to open a text input.
3. The user types their clarifying question. It is sent to the backend.
4. Gemini responds in character as the interviewer, answering the clarification.
5. The response is read via TTS. The answer timer then starts.
6. Whether the user asked a clarification, and the quality of it, is noted in the feedback.

### New Backend Call: `respondToClarification`

**POST `/api/interview/respondToClarification`**

| Field | Detail |
|---|---|
| **Input** | `{ sessionId, questionId, clarificationText, role, experience, personaStyle }` |
| **Output** | `{ interviewerResponse: string }` |
| **Logic** | Gemini is prompted to respond as the interviewer, in the selected persona style. The response should be brief (1–2 sentences) and realistic. |

---

## 8. Interviewer Persona Variety

Adding selectable interviewer styles trains users to handle different real-world interviewer personalities. A candidate who can answer confidently under a skeptical interviewer will handle any interview.

### Setup Phase Change

Add a fourth selector to `RoleSelector`: **Interviewer Style** with three options:

| Style | Persona | Behavior |
|---|---|---|
| **Friendly** | Encouraging | Warm follow-ups, supportive tone, gives hints if the user seems stuck. |
| **Neutral** | Professional | Standard tone, no emotional signals. Default mode. |
| **Skeptical** | Stress | Challenges answers, asks "are you sure?", probes for contradictions, maintains pressure. |

### Backend Change

The `personaStyle` field is passed to all Gemini-based calls (`generateQuestion`, `respondToClarification`, `checkFollowUp`) and injected into the system prompt to modulate tone and behavior.

---

## 9. Warm-up Round

Users are anxious at the start of a session. A brief unscored warm-up calibrates the microphone, eases the user into the flow, and reduces performance anxiety on the first real question.

### Implementation

- Before the main session begins, the platform presents 1–2 simple, low-stakes questions (e.g., "Tell me a bit about yourself" or "What brings you here today?").
- These questions are clearly labeled as **Warm-up — Not Scored**.
- Answers are transcribed and shown back to the user, but no feedback is generated and no score is stored.
- The warm-up also serves as a microphone check: if the transcription returns empty or very short, the platform surfaces a prompt to check the microphone before the session begins.
- Warm-up questions are generated separately from the main `generateQuestion` flow using a dedicated lightweight prompt.

---

## 10. Cross-Session Progress & Adaptive Difficulty

A single session score is a snapshot. Users improve over time and need longitudinal data to see that improvement.

### Dashboard Changes

- Add a **Progress** tab to the Dashboard alongside completed sessions.
- Show a line chart of overall session score over time, filterable by role.
- Show a radar chart of average scores across categories: Technical Accuracy, Communication, Behavioral, STAR Structure, Delivery.
- Highlight the most-improved competency and the competency needing the most work.

### Adaptive Difficulty

- Tag all generated questions with a difficulty level (`Easy` / `Medium` / `Hard`) in the database.
- After each session, compute the user's competency profile per role.
- The next session's `generateQuestion` call receives the competency profile and is instructed to weight questions toward areas where the user scored below 6, and to use harder questions in areas where the user consistently scores above 8.

---

## 11. Polish Features

### Voice Playback in Feedback

In the `QuestionFeedbackPanel`, add a **Play** button next to the transcript label. Clicking it plays back the original audio blob recorded during the answer phase. The audio blob should be stored in component state (not uploaded to the backend) and is available as long as the session is active. Hearing yourself speak is a powerful self-coaching experience.

### Bookmark & Retry Questions

In the `QuestionFeedbackPanel`, add a small **Bookmark** icon in the top-right corner. Clicking it saves the question ID and the user's score to a bookmarks collection in the database.

- In the Setup phase, add a toggle: **"Include bookmarked questions from past sessions"**.
- When enabled, the `generateQuestion` call receives the bookmarked question IDs and is instructed to include at least one similar question from each bookmarked topic.
- The Summary screen shows a **"Questions to revisit"** section listing any bookmarked questions from the current session.

---

## Appendix: Full Backend API Change Summary

| Endpoint | Status | Change Summary |
|---|---|---|
| `startSession` | Modified | Accept `interviewType`, `personaStyle`, `jobDescription`, `targetCompany` fields. |
| `generateQuestion` | Modified | Accept `interviewType`, `personaStyle`, `jobDescription`, `competencyProfile`. Tag returned question with difficulty. |
| `getFeedbackAPI` | Modified | Return extended feedback object including STAR sub-scores, delivery metrics, and conciseness rating. |
| `generate_summary` | Modified | Include STAR and delivery averages in the holistic report. Add most-improved and focus-area fields. |
| `checkFollowUp` | **New** | Evaluate answer, decide if follow-up is warranted, generate targeted probe question. |
| `respondToClarification` | **New** | Respond in-character to user's clarifying question before they answer. |
| `generateWarmup` | **New** | Generate 1–2 unscored warm-up questions appropriate to the role. |
| `bookmarkQuestion` | **New** | Save question ID and score to user's bookmark collection. |
| `getCompetencyProfile` | **New** | Return aggregated performance data per role for adaptive difficulty and dashboard. |

---

*Confidential — Internal Development Document*
