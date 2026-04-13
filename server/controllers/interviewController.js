import MockInterview from "../models/MockInterview.js";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// ─── Gemini Client ──────────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── Deepgram (TTS only) ────────────────────────────────────────────────────────
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// ─── Utilities ──────────────────────────────────────────────────────────────────
const safeJsonParse = (rawText) => {
  const raw = String(rawText || "").trim();
  if (!raw) return { ok: false, data: null, error: "Empty response" };
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return { ok: true, data: JSON.parse(cleaned), error: null };
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return { ok: true, data: JSON.parse(cleaned.slice(start, end + 1)), error: null };
      } catch (err2) {
        return { ok: false, data: null, error: err2?.message || "Failed to parse JSON slice" };
      }
    }
    return { ok: false, data: null, error: "Failed to parse JSON" };
  }
};

const clampScore10 = (score) => {
  const numeric = Number(score);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(10, numeric));
};

const normalizeList = (value, limit = 6) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v || "").trim()).filter(Boolean).slice(0, limit);
  if (typeof value === "string") return value.split(/\n|\.|;/).map((v) => v.trim()).filter(Boolean).slice(0, limit);
  return [];
};

const normalizeFeedbackData = (raw = {}) => ({
  score: clampScore10(raw.score),
  feedback: typeof raw.feedback === "string" && raw.feedback.trim()
    ? raw.feedback.trim()
    : "Your answer has a reasonable base, but can be sharper and more structured.",
  nextLevelEdge: typeof raw.nextLevelEdge === "string" ? raw.nextLevelEdge.trim() : "",
  refinementAreas: typeof raw.refinementAreas === "string" ? raw.refinementAreas.trim() : "",
  strengths: normalizeList(raw.strengths, 5),
  weaknesses: normalizeList(raw.weaknesses, 5),
  suggestions: normalizeList(raw.suggestions, 6),
  suggestedAnswer: typeof raw.suggestedAnswer === "string" ? raw.suggestedAnswer.trim() : "",
  conciseness: typeof raw.conciseness === "string" ? raw.conciseness.trim() : "",
  starScores: raw.starScores || null,
  delivery: raw.delivery || null,
  codeReview: raw.codeReview || null,
});

const normalizeQuestionText = (questionRaw = "") => {
  return String(questionRaw || "")
    .replace(/^["'`\s]+|["'`\s]+$/g, "")
    .replace(/^question\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
};

const getDifficultyBand = (score) => {
  if (score >= 8) return "hard";
  if (score >= 6) return "medium";
  return "easy";
};

// ─── Persona system prompt builder ─────────────────────────────────────────────
const getPersonaInstruction = (style = "Neutral") => {
  const personas = {
    Friendly: "You are a warm, encouraging interviewer. Use supportive language, give subtle hints when the candidate seems stuck, and celebrate good answers.",
    Neutral: "You are a professional interviewer. Maintain a neutral, objective tone with no emotional signals.",
    Skeptical: "You are a skeptical, challenging interviewer. Question assumptions, probe for contradictions, ask 'are you sure?', and maintain pressure throughout.",
  };
  return personas[style] || personas.Neutral;
};

// ─── Prompt builders ────────────────────────────────────────────────────────────
const buildFeedbackPrompt = ({ role, experience, question, answer, codeAnswer, language, interviewType = "Technical", timeTaken = null, followUpAnswer = null, jobDescription = null, targetCompany = null }) => {
  const isBehavioral = interviewType === "Behavioral" || interviewType === "Mixed";
  const timeContext = timeTaken ? `- Time taken to answer: ${timeTaken} seconds (target: ~120 seconds)` : "";
  const jdContext = jobDescription ? `\nJOB DESCRIPTION CONTEXT:\n${jobDescription.slice(0, 1000)}` : "";
  const companyContext = targetCompany ? `- Target company: ${targetCompany}` : "";
  const followUpContext = followUpAnswer ? `\nFOLLOW-UP ANSWER:\n${followUpAnswer}` : "";
  const codeContext = codeAnswer ? `\nCODE WRITTEN BY CANDIDATE (${language}):\n\`\`\`\n${codeAnswer}\n\`\`\`` : "";

  const starSection = isBehavioral ? `
"starScores": {
  "situation": 0-10,
  "task": 0-10,
  "action": 0-10,
  "result": 0-10
},` : '"starScores": null,';

  const codeSection = codeAnswer ? `
"codeReview": {
  "correctness": 0-10,
  "efficiency": 0-10,
  "readability": 0-10,
  "overallCode": 0-10,
  "suggestions": "Brief paragraph on how to improve the code",
  "improvedVersion": "Complete corrected code string"
},` : '"codeReview": null,';

  return `SYSTEM:
You are an expert interviewer evaluating a candidate response. Score realistically.
${jdContext}

CONTEXT:
- Role: ${role}
- Candidate experience: ${experience}
- Interview type: ${interviewType}
${companyContext}
${timeContext}
- Interview question: ${question}
- Candidate answer: ${answer}${followUpContext}${codeContext}

SCORING RUBRIC (0-10):
- 9-10: excellent depth, correct, structured, tradeoffs/edge-cases covered
- 7-8: mostly correct, good clarity, minor misses
- 5-6: partial understanding, gaps in depth/examples
- 3-4: weak conceptual clarity, important mistakes
- 0-2: incorrect or non-answer
${isBehavioral ? `
STAR FRAMEWORK EVALUATION:
- Situation (20%): Clear, specific context set?
- Task (20%): Individual responsibility defined?
- Action (40%): Concrete, specific "I" actions described?
- Result (20%): Measurable outcome + reflection?` : ""}
${codeAnswer ? `
CODE EVALUATION:
- Correctness: does the code logically solve the core problem?
- Efficiency: are Big-O complexity choices reasonable?
- Readability: naming, syntax, structure.
- overallCode: weighted aggregate score.` : ""}

COMMUNICATION SCORING:
Evaluate delivery quality:
- pacingScore (1-10): word count vs time — too fast/slow/well-paced
- clarityScore (1-10): structured, easy to follow
- overallDeliveryScore: weighted composite

Return ONLY valid JSON:
{
  "score": 7.5,
  "feedback": "Short paragraph with balanced evaluation.",
  "nextLevelEdge": "3-4 sentences on strengths to leverage next time.",
  "refinementAreas": "3-4 sentences on top gaps and how to fix them.",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "suggestedAnswer": "A model answer for this question (2-4 sentences, realistic and specific).",
  "conciseness": "Brief note on whether the answer was over-time, under-time, or well-paced.",
  ${starSection}
  ${codeSection}
  "delivery": {
    "pacingScore": 7,
    "clarityScore": 8,
    "overallDeliveryScore": 7.5
  }
}`;
};

const buildQuestionPrompt = ({ role, experience, currentTopic, questionsAskedInCurrentTopic, history = [], lastInteraction = null, difficulty = "medium", interviewType = "Technical", personaStyle = "Neutral", jobDescription = null, targetCompany = null, competencyProfile = null }) => {
  const previousQuestions = history.length ? history.map((h, i) => `Q${i + 1}: ${h.question}`).join("\n") : "None";
  const lastScore = clampScore10(lastInteraction?.feedback?.score);
  const lastAnswer = lastInteraction?.answer ? String(lastInteraction.answer).slice(0, 600) : "";
  const jdContext = jobDescription ? `\nJOB DESCRIPTION (use for context):\n${jobDescription.slice(0, 800)}` : "";
  const companyContext = targetCompany ? `- Target company: ${targetCompany}` : "";
  const profileContext = competencyProfile ? `\nCANDIDATE COMPETENCY PROFILE:\n${JSON.stringify(competencyProfile)}` : "";
  const behavioralInstruction = (interviewType === "Behavioral" || interviewType === "Mixed")
    ? "\n- For behavioral questions: ask STAR-format questions (Tell me about a time...)\n- Include questions about teamwork, conflict, leadership, failure, success."
    : "";

  return `SYSTEM:
You are a realistic ${interviewType.toLowerCase()} interviewer.
${getPersonaInstruction(personaStyle)}
Ask exactly one natural-sounding interview question.
${jdContext}
${profileContext}

CANDIDATE PROFILE:
- Role: ${role}
- Experience level: ${experience}
${companyContext}

INTERVIEW STATE:
- Interview type: ${interviewType}
- Current topic: ${currentTopic}
- Question number in this topic: ${questionsAskedInCurrentTopic + 1}
- Target difficulty: ${difficulty}
- Previously asked questions:
${previousQuestions}

LAST INTERACTION:
- Last score: ${lastInteraction ? `${lastScore}/10` : "N/A"}
- Last answer (if any): ${lastAnswer || "N/A"}

QUESTION FLOW RULES:
1) Do not repeat or paraphrase any previous question.
2) Keep question tightly focused on current topic.
3) Adaptive progression:
   - If last score < 6: ask a simpler, foundational clarification question.
   - If last score 6-7.9: ask an application/debugging scenario.
   - If last score >= 8: ask deeper tradeoff/system-level follow-up.
4) Keep the question concise (1-3 lines) and interview-realistic.
5) No greetings, no explanations, no bullets.${behavioralInstruction}
6) Return ONLY valid JSON:

{
  "text": "The raw question string to ask the candidate.",
  "codePrompt": "Optional. Only if Technical and coding required: A detailed description of the problem constraints or code snippet to review.",
  "starterCode": "Optional. Only if Technical: Provide the raw boilerplate string (function signature) for the code editor if applicable, or empty string."
}

Generate the next interview question now.`;
};

const buildSummaryPrompt = ({ role, transcript, interviewType = "Technical", earlyTermination = null, sessionExtended = false, overallAvg = 0, trend = 0, questionCount = 0 }) => {
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

  return `SYSTEM:
You are an expert interview coach generating an end-of-session performance report.
${terminationContext}

SESSION DATA:
- Role: ${role}
- Interview Type: ${interviewType}
- Questions answered: ${questionCount}
- Overall average score: ${overallAvg}
- Score trend: ${trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'flat'}

TRANSCRIPT + PER-QUESTION FEEDBACK:
${transcript}

RULES:
- Identify true strengths and repeated weaknesses across answers.
- Do not invent performance details not present in transcript.
- Provide practical next-step guidance for improvement.
- Return ONLY valid JSON.

OUTPUT:
{
  "nextLevelEdge": "3-4 sentences on strongest differentiators and how to leverage them.",
  "refinementAreas": "3-4 sentences on repeated gaps and concrete preparation steps.",
  "mostImprovedArea": "The single competency that showed the most growth.",
  "focusArea": "The single competency needing the most work.",
  "recoveryPlan": "Optional. specific next steps (especially if early termination).",
  "sessionVerdict": "One sentence overall verdict."
}`;
};

// ─── TRANSCRIBE ─────────────────────────────────────────────────────────────────
export const transcribe = async (req, res) => {
  try {
    const { audioBase64, mimeType, role, question } = req.body;
    if (!audioBase64) return res.status(400).json({ error: "No audio data provided" });

    const audioMime = mimeType || "audio/webm";
    const audioPart = { inlineData: { mimeType: audioMime, data: audioBase64 } };

    const transcribePrompt = `You are a precise speech-to-text transcription engine.
Listen to the audio carefully and transcribe EXACTLY what the person says word-for-word.
Rules:
- Transcribe all spoken words faithfully, including filler words (um, uh, like).
- Do NOT add, remove, or paraphrase content.
- Do NOT add punctuation unless clearly spoken.
- If the audio is silent or inaudible, return an empty string: ""
- Return ONLY the raw transcript text. No labels, no explanations.`;

    const transcribeResult = await gemini.generateContent([transcribePrompt, audioPart]);
    const rawTranscript = transcribeResult.response.text().trim();

    if (!rawTranscript) return res.json({ transcript: "", rawTranscript: "" });

    const correctionPrompt = `You are a STRICT grammar and spelling corrector for interview answers.
ROLE: ${role || "General Interview Candidate"}
QUESTION: """${question || ""}"""
RULES:
- ONLY fix clear spelling mistakes or obvious grammar errors.
- If a word matches a technical term for the ROLE, correct it.
- DO NOT add information not said.
- Return ONLY the corrected text.
Text to correct:
${rawTranscript}`;

    const correctionResult = await gemini.generateContent(correctionPrompt);
    const finalTranscript = correctionResult.response.text().trim() || rawTranscript;

    res.json({ transcript: finalTranscript, rawTranscript });
  } catch (err) {
    console.error("Transcription error:", err?.message ?? err);
    res.status(500).json({ error: "Transcription failed", details: err?.message ?? String(err) });
  }
};

// ─── TTS ────────────────────────────────────────────────────────────────────────
export const tts = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const r = await axios.post(
      "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
      { text },
      { responseType: "arraybuffer", headers: { Authorization: `Token ${DEEPGRAM_API_KEY}`, "Content-Type": "application/json" } }
    );
    res.set("Content-Type", r.headers["content-type"] || "audio/mpeg");
    res.send(r.data);
  } catch (err) {
    console.error("TTS error:", err.response?.data ?? err.message);
    res.status(500).json({ error: "TTS failed", details: err.response?.data ?? err.message });
  }
};

// ─── FEEDBACK ───────────────────────────────────────────────────────────────────
export const feedback = async (req, res) => {
  const {
    userId, role, sessionId, question, answer, experience, codeAnswer, language,
    interviewType = "Technical", timeTaken = null, followUpAnswer = null,
    jobDescription = null, targetCompany = null,
  } = req.body;

  if (!role || !question || !answer || !experience) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = buildFeedbackPrompt({ role, experience, question, answer, codeAnswer, language, interviewType, timeTaken, followUpAnswer, jobDescription, targetCompany });

  try {
    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
    });
    const raw = result.response.text().trim();
    const parsed = safeJsonParse(raw);
    if (!parsed.ok) return res.status(500).json({ error: "Failed to parse AI response", details: parsed.error, raw });

    const data = normalizeFeedbackData(parsed.data);

    if (!userId) return res.json({ ...data, sessionId: null, overallScore: data.score || 0 });

    let session;
    if (sessionId) {
      session = await MockInterview.findById(sessionId);
    } else {
      session = await MockInterview.findOne({ userId, role, completed: { $ne: true } }).sort({ createdAt: -1 });
      if (!session) {
        session = new MockInterview({ userId, role, questionsAsked: [], overallScore: 0 });
      }
    }
    if (!session) return res.status(404).json({ error: "Interview session not found." });

    session.questionsAsked.push({
      question,
      answer,
      codeAnswer: codeAnswer || "",
      codeLanguage: language || "",
      followUpAnswer: followUpAnswer || "",
      questionType: interviewType,
      timeTaken: timeTaken || 0,
      feedback: data,
    });

    const totalScore = session.questionsAsked.reduce((sum, q) => sum + (q.feedback?.score || 0), 0);
    session.overallScore = totalScore / session.questionsAsked.length;

    const totalDelivery = session.questionsAsked.reduce((sum, q) => sum + (q.feedback?.delivery?.overallDeliveryScore || 0), 0);
    session.overallDeliveryScore = totalDelivery / session.questionsAsked.length;

    await session.save();
    res.json({ ...data, sessionId: session._id, overallScore: session.overallScore });
  } catch (err) {
    console.error("Feedback error:", err?.message ?? err);
    res.status(500).json({ error: "Feedback failed", details: err?.message });
  }
};

// ─── CHECK FOLLOW-UP ────────────────────────────────────────────────────────────
export const checkFollowUp = async (req, res) => {
  const { sessionId, questionId, answer, role, experience, interviewType = "Technical", question } = req.body;

  if (!answer || !role || !question) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `SYSTEM:
You are an expert interviewer evaluating whether a candidate's answer warrants a follow-up probe.

CONTEXT:
- Role: ${role}
- Experience: ${experience}
- Interview type: ${interviewType}
- Question: ${question}
- Candidate answer: ${answer}

EVALUATION CRITERIA — trigger follow-up when:
1. Answer scores below 6/10 in perceived quality
2. Answer is generic or lacks specific examples
3. Answer is missing STAR structure (for behavioral questions)
4. Answer uses vague language without concrete evidence

Return ONLY valid JSON:
{
  "shouldFollowUp": true/false,
  "prelimScore": 6.5,
  "followUpQuestion": "Can you give me a specific example from a past project where this applied?"
}
- If shouldFollowUp is false, followUpQuestion can be an empty string.
- followUpQuestion must be a targeted, specific probe — not a generic question.`;

  try {
    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
    });
    const raw = result.response.text().trim();
    const parsed = safeJsonParse(raw);
    if (!parsed.ok) return res.status(500).json({ error: "Failed to parse AI response", details: parsed.error });

    res.json({
      shouldFollowUp: !!parsed.data?.shouldFollowUp,
      followUpQuestion: String(parsed.data?.followUpQuestion || "").trim(),
      prelimScore: clampScore10(parsed.data?.prelimScore),
    });
  } catch (err) {
    console.error("checkFollowUp error:", err?.message);
    res.status(500).json({ error: "Follow-up check failed", details: err?.message });
  }
};

// ─── RESPOND TO CLARIFICATION ───────────────────────────────────────────────────
export const respondToClarification = async (req, res) => {
  const { sessionId, questionId, clarificationText, role, experience, personaStyle = "Neutral", question } = req.body;

  if (!clarificationText || !question) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `SYSTEM:
You are acting as a ${personaStyle.toLowerCase()} interviewer in a live interview.
${getPersonaInstruction(personaStyle)}

The interviewer just asked: "${question}"
The candidate asks for clarification: "${clarificationText}"

RULES:
- Respond in character as the interviewer.
- Keep your response brief: 1-3 sentences only.
- Be realistic — real interviewers give minimal clarification, so don't give away the answer.
- Acknowledge the question and provide only the necessary context.
- If the clarification is off-track, politely redirect.

Response:`;

  try {
    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3 },
    });
    const response = result.response.text().trim();
    res.json({ interviewerResponse: response });
  } catch (err) {
    console.error("respondToClarification error:", err?.message);
    res.status(500).json({ error: "Clarification response failed", details: err?.message });
  }
};

// ─── GENERATE WARMUP QUESTIONS ──────────────────────────────────────────────────
export const generateWarmup = async (req, res) => {
  const { role, experience } = req.body;

  if (!role || !experience) {
    return res.status(400).json({ error: "Role and experience required." });
  }

  const prompt = `SYSTEM:
You are preparing 2 gentle warm-up questions for a ${experience} ${role} interview.
These should be easy, low-stakes, conversational questions to ease the candidate in.
Good examples: "Tell me about yourself", "What drew you to ${role}?", "What's your proudest professional achievement?"

RULES:
- Return exactly 2 questions.
- Questions must be brief, open-ended, and non-technical.
- No scoring will happen — these are purely to warm up the candidate.
- Return ONLY valid JSON:

{
  "questions": ["question 1", "question 2"]
}`;

  try {
    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
    });
    const raw = result.response.text().trim();
    const parsed = safeJsonParse(raw);
    if (!parsed.ok) return res.status(500).json({ error: "Failed to parse warmup questions" });

    const questions = Array.isArray(parsed.data?.questions)
      ? parsed.data.questions.slice(0, 2)
      : ["Tell me about yourself.", "What motivated you to apply for this role?"];

    res.json({ questions });
  } catch (err) {
    console.error("generateWarmup error:", err?.message);
    res.status(500).json({ error: "Failed to generate warmup questions", details: err?.message });
  }
};

// ─── BOOKMARK QUESTION ──────────────────────────────────────────────────────────
export const bookmarkQuestion = async (req, res) => {
  const { sessionId, questionIndex, bookmarked = true } = req.body;

  if (!sessionId || questionIndex === undefined) {
    return res.status(400).json({ error: "sessionId and questionIndex required." });
  }

  try {
    const session = await MockInterview.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found." });

    if (session.questionsAsked[questionIndex]) {
      session.questionsAsked[questionIndex].bookmarked = bookmarked;
      await session.save();
    }

    res.json({ success: true, bookmarked });
  } catch (err) {
    console.error("bookmarkQuestion error:", err?.message);
    res.status(500).json({ error: "Bookmark failed", details: err?.message });
  }
};

// ─── GET COMPETENCY PROFILE ─────────────────────────────────────────────────────
export const getCompetencyProfile = async (req, res) => {
  const { userId, role } = req.query;

  if (!userId) return res.status(400).json({ error: "userId required." });

  try {
    const query = { userId, completed: true };
    if (role) query.role = role;

    const sessions = await MockInterview.find(query).sort({ createdAt: -1 }).limit(10);

    if (!sessions.length) {
      return res.json({ sessions: [], profile: null });
    }

    // Aggregate scores over time
    const sessionData = sessions.map((s) => ({
      sessionId: s._id,
      role: s.role,
      date: s.createdAt,
      overallScore: s.overallScore,
      overallDeliveryScore: s.overallDeliveryScore || 0,
      interviewType: s.interviewType,
      questionCount: s.questionsAsked.length,
    }));

    // Compute average scores per category
    let totalContent = 0, totalDelivery = 0, count = 0;
    sessions.forEach((s) => {
      totalContent += s.overallScore || 0;
      totalDelivery += s.overallDeliveryScore || 0;
      count++;
    });

    const profile = {
      avgContentScore: count ? (totalContent / count).toFixed(1) : 0,
      avgDeliveryScore: count ? (totalDelivery / count).toFixed(1) : 0,
      sessionCount: count,
    };

    res.json({ sessions: sessionData, profile });
  } catch (err) {
    console.error("getCompetencyProfile error:", err?.message);
    res.status(500).json({ error: "Failed to get competency profile", details: err?.message });
  }
};

// ─── GENERATE QUESTION ──────────────────────────────────────────────────────────
export const generate_question = async (req, res) => {
  const {
    role, experience, history = [],
    interviewType = "Technical", personaStyle = "Neutral",
    jobDescription = null, targetCompany = null, competencyProfile = null,
  } = req.body;

  if (!role || !experience) {
    return res.status(400).json({ error: "Role and experience are required" });
  }

  const getTopicFlow = (roleName, type) => {
    const rl = roleName.toLowerCase();
    if (type === "Behavioral") {
      return [
        { name: "Teamwork & Collaboration", count: 2 },
        { name: "Leadership & Conflict", count: 2 },
        { name: "Achievement & Failure", count: 1 },
      ];
    }
    if (rl.includes("react") || rl.includes("frontend")) {
      return [
        { name: "HTML/CSS & Web Basics", count: 1 },
        { name: "JavaScript Core Concepts", count: 2 },
        { name: "React & Advanced UI", count: 2 },
      ];
    } else if (rl.includes("backend") || rl.includes("node")) {
      return [
        { name: "Backend Languages & APIs", count: 2 },
        { name: "Database & Storage", count: 2 },
        { name: "System Architecture & Scaling", count: 1 },
      ];
    } else if (rl.includes("full") && rl.includes("stack")) {
      return [
        { name: "Frontend Basics (JS/React)", count: 2 },
        { name: "Backend & APIs", count: 2 },
        { name: "Databases & Architecture", count: 1 },
      ];
    } else if (rl.includes("software") || rl.includes("engineer")) {
      return [
        { name: "Data Structures & Algorithms", count: 2 },
        { name: "System Design & Architecture", count: 2 },
        { name: "Debugging & Deployment", count: 1 },
      ];
    } else if (rl.includes("product manager") || rl.includes("project manager") || rl.includes("agile")) {
      return [
        { name: "Product Strategy & Discovery", count: 2 },
        { name: "Agile Execution & Roadmaps", count: 2 },
        { name: "Stakeholder Management & Metrics", count: 1 },
      ];
    } else if (rl.includes("designer") || rl.includes("ux") || rl.includes("ui")) {
      return [
        { name: "Design Principles & Typography", count: 1 },
        { name: "UX Research & Wireframing", count: 2 },
        { name: "Prototyping & Case Studies", count: 2 },
      ];
    } else if (rl.includes("data")) {
      return [
        { name: "Statistics & Data Manipulation", count: 2 },
        { name: "Machine Learning & Algorithms", count: 2 },
        { name: "Model Deployment & Evaluation", count: 1 },
      ];
    } else if (rl.includes("marketing")) {
      return [
        { name: "Campaign Strategies & Funnels", count: 2 },
        { name: "Analytics, SEO & Growth", count: 2 },
        { name: "Brand & Leadership", count: 1 },
      ];
    } else if (rl.includes("financ") || rl.includes("analyst")) {
      return [
        { name: "Financial Modeling Basics", count: 2 },
        { name: "Risk Assessment & Investments", count: 2 },
        { name: "Advanced Forecasting", count: 1 },
      ];
    } else {
      return [
        { name: "Fundamentals and Concept Definitions", count: 2 },
        { name: "Practical Application and Scenarios", count: 2 },
        { name: "Advanced Problem Solving", count: 1 },
      ];
    }
  };

  const flow = getTopicFlow(role, interviewType);
  let currentQuestionIndex = history.length;
  let currentTopic, questionsAskedInCurrentTopic = 0;

  let qCount = 0;
  for (let topic of flow) {
    if (currentQuestionIndex < qCount + topic.count) {
      currentTopic = topic.name;
      questionsAskedInCurrentTopic = currentQuestionIndex - qCount;
      break;
    }
    qCount += topic.count;
  }
  if (!currentTopic) {
    currentTopic = flow[flow.length - 1].name;
    questionsAskedInCurrentTopic = 0;
  }

  const lastInteraction = history.length > 0 ? history[history.length - 1] : null;
  const avgScore = history.length
    ? history.reduce((sum, h) => sum + clampScore10(h?.feedback?.score), 0) / history.length : 0;
  const lastScore = clampScore10(lastInteraction?.feedback?.score);
  const blendedScore = history.length ? (avgScore + lastScore) / 2 : 0;
  const targetDifficulty = getDifficultyBand(blendedScore);

  try {
    const prompt = buildQuestionPrompt({
      role, experience, currentTopic, questionsAskedInCurrentTopic,
      history, lastInteraction, difficulty: targetDifficulty,
      interviewType, personaStyle, jobDescription, targetCompany, competencyProfile,
    });

    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.35, responseMimeType: "application/json" },
    });
    const parsedObj = safeJsonParse(result.response.text());
    let question = parsedObj.data?.text ? normalizeQuestionText(parsedObj.data.text) : "";
    let starterCode = parsedObj.data?.starterCode || "";
    let codePrompt = parsedObj.data?.codePrompt || "";

    const questionLower = question.toLowerCase();
    const alreadyAsked = history.some((h) => String(h?.question || "").trim().toLowerCase() === questionLower);
    if (!question || question.length < 12 || alreadyAsked) {
      const retryPrompt = `${prompt}\n\nIMPORTANT RETRY: previous output was invalid/repeated. Generate NEW non-repeated question now. Ensure you return valid JSON.`;
      const retryResult = await gemini.generateContent({
        contents: [{ role: "user", parts: [{ text: retryPrompt }] }],
        generationConfig: { temperature: 0.45, responseMimeType: "application/json" },
      });
      const parsedRetry = safeJsonParse(retryResult.response.text());
      question = normalizeQuestionText(parsedRetry.data?.text || "");
      starterCode = parsedRetry.data?.starterCode || "";
      codePrompt = parsedRetry.data?.codePrompt || "";
    }

    if (!question) return res.status(500).json({ error: "Failed to generate valid question" });

    // Determine if it's an engineering role that should get the coding panel
    const engineeringPatterns = ["software", "swe", "frontend", "backend", "full stack", "fullstack", "data scientist", "machine learning", "devops", "sre", "mobile"];
    const rlToLower = role.toLowerCase();
    const isEngineering = engineeringPatterns.some(p => rlToLower.includes(p));
    const requiresCode = isEngineering && interviewType === "Technical";

    res.json({ 
      question, 
      topic: currentTopic, 
      difficulty: targetDifficulty,
      type: interviewType,
      codePrompt: requiresCode ? codePrompt : "",
      starterCode: requiresCode ? starterCode : ""
    });
  } catch (err) {
    console.error("Error generating question:", err.message);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

// ─── GENERATE SUMMARY ───────────────────────────────────────────────────────────
export const generate_summary = async (req, res) => {
  try {
    const { sessionId, earlyTermination, sessionExtended } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Session ID required" });

    const session = await MockInterview.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    if (session.completed && session.summary?.nextLevelEdge) {
      return res.json({ summary: session.summary });
    }

    const transcript = session.questionsAsked
      .map((q, i) =>
        `Q${i + 1}: ${q.question}\n` +
        `A${i + 1}: ${q.answer}\n` +
        (q.followUpQuestion ? `Follow-up Q: ${q.followUpQuestion}\n` : "") +
        (q.followUpAnswer ? `Follow-up A: ${q.followUpAnswer}\n` : "") +
        `Feedback: ${JSON.stringify(q.feedback)}\n`
      )
      .join("\n");

    const scores = session.questionsAsked.map((q) => q.feedback?.score || 0);
    const overallAvg = scores.length ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;
    const trend = scores.length >= 3 ? scores[scores.length - 1] - scores[scores.length - 3] : 0;

    const prompt = buildSummaryPrompt({ 
      role: session.role, 
      transcript, 
      interviewType: session.interviewType,
      earlyTermination,
      sessionExtended,
      overallAvg,
      trend,
      questionCount: session.questionsAsked.length,
    });

    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.25, responseMimeType: "application/json" },
    });

    const raw = result.response.text().trim();
    const parsed = safeJsonParse(raw);
    if (!parsed.ok) return res.status(500).json({ error: "Failed to parse AI response", details: parsed.error, raw });

    // Compute STAR averages from behavioral questions
    const behavioral = session.questionsAsked.filter((q) => q.feedback?.starScores);
    const starAverages = { situation: 0, task: 0, action: 0, result: 0 };
    if (behavioral.length) {
      behavioral.forEach((q) => {
        starAverages.situation += q.feedback.starScores.situation || 0;
        starAverages.task += q.feedback.starScores.task || 0;
        starAverages.action += q.feedback.starScores.action || 0;
        starAverages.result += q.feedback.starScores.result || 0;
      });
      Object.keys(starAverages).forEach((k) => {
        starAverages[k] = parseFloat((starAverages[k] / behavioral.length).toFixed(1));
      });
    }

    const totalDelivery = session.questionsAsked.reduce((sum, q) => sum + (q.feedback?.delivery?.overallDeliveryScore || 0), 0);
    const deliveryAverage = session.questionsAsked.length ? parseFloat((totalDelivery / session.questionsAsked.length).toFixed(1)) : 0;

    const data = {
      nextLevelEdge: String(parsed.data?.nextLevelEdge || "").trim(),
      refinementAreas: String(parsed.data?.refinementAreas || "").trim(),
      mostImprovedArea: String(parsed.data?.mostImprovedArea || "").trim(),
      focusArea: String(parsed.data?.focusArea || "").trim(),
      recoveryPlan: parsed.data?.recoveryPlan ? String(parsed.data.recoveryPlan).trim() : "",
      sessionVerdict: parsed.data?.sessionVerdict ? String(parsed.data.sessionVerdict).trim() : "",
      starAverages,
      deliveryAverage,
    };

    if (!data.nextLevelEdge || !data.refinementAreas) {
      return res.status(500).json({ error: "AI summary response incomplete", raw });
    }

    session.summary = data;
    session.completed = true;
    await session.save();

    res.json({ summary: session.summary });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Summary generation failed" });
  }
};

// ─── START SESSION ───────────────────────────────────────────────────────────────
export const startInterviewSession = async (req, res) => {
  const { userId, role, interviewType = "Technical", personaStyle = "Neutral", jobDescription = "", targetCompany = "" } = req.body;

  if (!userId || !role) return res.status(400).json({ error: "userId and role required." });

  try {
    const session = new MockInterview({
      userId,
      role,
      interviewType,
      personaStyle,
      jobDescription,
      targetCompany,
      questionsAsked: [],
      overallScore: 0,
    });
    await session.save();
    res.json({ sessionId: session._id });
  } catch (err) {
    console.error("startInterviewSession error:", err?.message);
    res.status(500).json({ error: "Failed to start session", details: err?.message });
  }
};
