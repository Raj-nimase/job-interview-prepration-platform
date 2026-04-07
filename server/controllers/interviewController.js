import MockInterview from "../models/MockInterview.js";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// ─── Gemini Client (STT + LLM for everything) ──────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── Deepgram (TTS only) ────────────────────────────────────────────────────────
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

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
        return {
          ok: true,
          data: JSON.parse(cleaned.slice(start, end + 1)),
          error: null,
        };
      } catch (err2) {
        return {
          ok: false,
          data: null,
          error: err2?.message || "Failed to parse JSON slice",
        };
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
  if (Array.isArray(value)) {
    return value
      .map((v) => String(v || "").trim())
      .filter(Boolean)
      .slice(0, limit);
  }
  if (typeof value === "string") {
    return value
      .split(/\n|\.|;/)
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, limit);
  }
  return [];
};

const normalizeFeedbackData = (raw = {}) => ({
  score: clampScore10(raw.score),
  feedback:
    typeof raw.feedback === "string" && raw.feedback.trim()
      ? raw.feedback.trim()
      : "Your answer has a reasonable base, but can be sharper and more structured.",
  nextLevelEdge:
    typeof raw.nextLevelEdge === "string" ? raw.nextLevelEdge.trim() : "",
  refinementAreas:
    typeof raw.refinementAreas === "string" ? raw.refinementAreas.trim() : "",
  strengths: normalizeList(raw.strengths, 5),
  weaknesses: normalizeList(raw.weaknesses, 5),
  suggestions: normalizeList(raw.suggestions, 6),
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

const buildFeedbackPrompt = ({ role, experience, question, answer }) => `SYSTEM:
You are an expert technical interviewer evaluating a candidate response.
You must score realistically and avoid inflated ratings.

CONTEXT:
- Role: ${role}
- Candidate experience: ${experience}
- Interview question: ${question}
- Candidate answer: ${answer}

SCORING RUBRIC (0-10):
- 9-10: excellent depth, correct, structured, tradeoffs/edge-cases covered
- 7-8: mostly correct, good clarity, minor misses
- 5-6: partial understanding, gaps in depth/examples
- 3-4: weak conceptual clarity, important mistakes
- 0-2: incorrect or non-answer

RULES:
- Base your evaluation only on the candidate answer text.
- Do not assume unstated knowledge.
- Keep feedback specific and actionable.
- Suggestions must be practical for next interview attempts.
- Return ONLY valid JSON.

OUTPUT JSON SHAPE:
{
  "score": 7.5,
  "feedback": "Short paragraph with balanced evaluation.",
  "nextLevelEdge": "3-4 sentences on strengths to leverage next time.",
  "refinementAreas": "3-4 sentences on top gaps and how to fix them.",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}`;

const buildQuestionPrompt = ({
  role,
  experience,
  currentTopic,
  questionsAskedInCurrentTopic,
  history = [],
  lastInteraction = null,
  difficulty = "medium",
}) => {
  const previousQuestions = history.length
    ? history.map((h, i) => `Q${i + 1}: ${h.question}`).join("\n")
    : "None";

  const lastScore = clampScore10(lastInteraction?.feedback?.score);
  const lastAnswer = lastInteraction?.answer
    ? String(lastInteraction.answer).slice(0, 600)
    : "";

  return `SYSTEM:
You are a realistic technical interviewer conducting a live interview.
Ask exactly one natural-sounding interview question.

CANDIDATE PROFILE:
- Role: ${role}
- Experience level: ${experience}

INTERVIEW STATE:
- Current topic: ${currentTopic}
- Question number in this topic: ${questionsAskedInCurrentTopic + 1}
- Target difficulty for this turn: ${difficulty}
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
4) Keep the question concise (1-2 lines) and interview-realistic.
5) No greetings, no explanations, no bullets.
6) Return ONLY the raw question text.

Generate the next interview question now.`;
};

const buildSummaryPrompt = ({ role, transcript }) => `SYSTEM:
You are an expert interview coach generating an end-of-session performance summary.
Be specific, balanced, and evidence-based.

ROLE:
${role}

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
  "refinementAreas": "3-4 sentences on repeated gaps and concrete preparation steps."
}`;

// ─── TRANSCRIBE via Gemini STT ─────────────────────────────────────────────────
export const transcribe = async (req, res) => {
  try {
    const { audioBase64, mimeType, role, question } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    const audioMime = mimeType || "audio/webm";

    // Step 1 — Transcribe audio with Gemini multimodal
    const audioPart = {
      inlineData: {
        mimeType: audioMime,
        data: audioBase64,
      },
    };

    const transcribePrompt = `You are a precise speech-to-text transcription engine.

Listen to the audio carefully and transcribe EXACTLY what the person says word-for-word.

Rules:
- Transcribe all spoken words faithfully, including filler words (um, uh, like).
- Do NOT add, remove, or paraphrase content.
- Do NOT add punctuation unless clearly spoken (e.g. a rising question ends with ?).
- If the audio is silent or inaudible, return an empty string: ""
- Return ONLY the raw transcript text. No labels, no explanations.`;

    const transcribeResult = await gemini.generateContent([
      transcribePrompt,
      audioPart,
    ]);

    const rawTranscript = transcribeResult.response.text().trim();

    if (!rawTranscript) {
      return res.json({ transcript: "", rawTranscript: "" });
    }

    // Step 2 — Grammar & clarity correction via Gemini
    const correctionPrompt = `You are a STRICT grammar and spelling corrector for interview answers.

ROLE: ${role || "General Interview Candidate"}
QUESTION: """${question || ""}"""

RULES:
- ONLY fix clear spelling mistakes or obvious grammar errors.
- If a word is slightly misspelled but matches a technical term relevant to the ROLE or QUESTION, correct it to that term.
- DO NOT add, guess, or expand with information the user did not explicitly say.
- If the sentence is already correct, return it exactly as is.
- Keep the meaning exactly the same as the original spoken words.
- If the text is very short (3 words or fewer), return it unchanged.
- Return ONLY the corrected text — no explanations, no labels, no reasoning.

Text to correct:
${rawTranscript}`;

    const correctionResult = await gemini.generateContent(correctionPrompt);
    const finalTranscript =
      correctionResult.response.text().trim() || rawTranscript;

    res.json({ transcript: finalTranscript, rawTranscript });
  } catch (err) {
    console.error("Transcription error:", err?.message ?? err);
    res.status(500).json({
      error: "Transcription failed",
      details: err?.message ?? String(err),
    });
  }
};

// ─── TTS via Deepgram ──────────────────────────────────────────────────────────
export const tts = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const r = await axios.post(
      "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
      { text },
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.set("Content-Type", r.headers["content-type"] || "audio/mpeg");
    res.send(r.data);
  } catch (err) {
    console.error("TTS error:", err.response?.data ?? err.message);
    res.status(500).json({
      error: "TTS failed",
      details: err.response?.data ?? err.message,
    });
  }
};

// ─── FEEDBACK via Gemini ───────────────────────────────────────────────────────
export const feedback = async (req, res) => {
  const { userId, role, sessionId, question, answer, experience } = req.body;

  if (!role || !question || !answer || !experience) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = buildFeedbackPrompt({ role, experience, question, answer });

  try {
    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });
    const raw = result.response.text().trim();

    const parsed = safeJsonParse(raw);
    if (!parsed.ok) {
      return res
        .status(500)
        .json({ error: "Failed to parse AI response", details: parsed.error, raw });
    }
    const data = normalizeFeedbackData(parsed.data);

    if (!data) return res.status(500).json({ error: "AI feedback failed." });

    // If there is no userId (e.g., guest user), just return the feedback directly without saving
    if (!userId) {
      return res.json({
        ...data,
        sessionId: null,
        overallScore: data.score || 0,
      });
    }

    let session;
    if (sessionId) {
      session = await MockInterview.findById(sessionId);
    } else {
      session = await MockInterview.findOne({
        userId,
        role,
        completed: { $ne: true },
      }).sort({ createdAt: -1 });
      if (!session) {
        session = new MockInterview({
          userId,
          role,
          questionsAsked: [],
          overallScore: 0,
        });
      }
    }

    if (!session) {
      return res.status(404).json({ error: "Interview session not found." });
    }

    session.questionsAsked.push({ question, answer, feedback: data });

    const totalScore = session.questionsAsked.reduce(
      (sum, q) => sum + (q.feedback?.score || 0),
      0,
    );
    session.overallScore = totalScore / session.questionsAsked.length;

    await session.save();

    res.json({
      ...data,
      sessionId: session._id,
      overallScore: session.overallScore,
    });
  } catch (err) {
    console.error("Feedback error:", err?.message ?? err);
    res.status(500).json({ error: "Feedback failed", details: err?.message });
  }
};

// ─── GENERATE QUESTION via Gemini ──────────────────────────────────────────────
export const generate_question = async (req, res) => {
  const { role, experience, history = [] } = req.body;

  if (!role || !experience) {
    return res.status(400).json({ error: "Role and experience are required" });
  }

  const getTopicFlow = (roleName) => {
    const rl = roleName.toLowerCase();

    // Engineering Flow
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
    }
    // Product & Project Management
    else if (
      rl.includes("product manager") ||
      rl.includes("project manager") ||
      rl.includes("agile")
    ) {
      return [
        { name: "Product Strategy & Discovery", count: 2 },
        { name: "Agile Execution & Roadmaps", count: 2 },
        { name: "Stakeholder Management & Metrics", count: 1 },
      ];
    }
    // Design
    else if (
      rl.includes("designer") ||
      rl.includes("ux") ||
      rl.includes("ui")
    ) {
      return [
        { name: "Design Principles & Typography", count: 1 },
        { name: "UX Research & Wireframing", count: 2 },
        { name: "Prototyping & Case Studies", count: 2 },
      ];
    }
    // Data Science
    else if (rl.includes("data")) {
      return [
        { name: "Statistics & Data Manipulation", count: 2 },
        { name: "Machine Learning & Algorithms", count: 2 },
        { name: "Model Deployment & Evaluation", count: 1 },
      ];
    }
    // Marketing
    else if (rl.includes("marketing")) {
      return [
        { name: "Campaign Strategies & Funnels", count: 2 },
        { name: "Analytics, SEO & Growth", count: 2 },
        { name: "Brand & Leadership", count: 1 },
      ];
    }
    // Finance
    else if (rl.includes("financ") || rl.includes("analyst")) {
      return [
        { name: "Financial Modeling Basics", count: 2 },
        { name: "Risk Assessment & Investments", count: 2 },
        { name: "Advanced Forecasting", count: 1 },
      ];
    }
    // Universal Default
    else {
      return [
        { name: "Fundamentals and Concept Definitions", count: 2 },
        { name: "Practical Application and Scenarios", count: 2 },
        { name: "Advanced Problem Solving", count: 1 },
      ];
    }
  };

  const flow = getTopicFlow(role);
  let currentQuestionIndex = history.length;
  let currentTopic;
  let questionsAskedInCurrentTopic = 0;

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

  const lastInteraction =
    history.length > 0 ? history[history.length - 1] : null;
  const avgScore = history.length
    ? history.reduce((sum, h) => sum + clampScore10(h?.feedback?.score), 0) /
      history.length
    : 0;
  const lastScore = clampScore10(lastInteraction?.feedback?.score);
  const blendedScore = history.length ? (avgScore + lastScore) / 2 : 0;
  const targetDifficulty = getDifficultyBand(blendedScore);

  try {
    const prompt = buildQuestionPrompt({
      role,
      experience,
      currentTopic,
      questionsAskedInCurrentTopic,
      history,
      lastInteraction,
      difficulty: targetDifficulty,
    });

    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.35,
      },
    });
    let question = normalizeQuestionText(result.response.text());

    // Retry once if model returns invalid or repeated question.
    const questionLower = question.toLowerCase();
    const alreadyAsked = history.some(
      (h) => String(h?.question || "").trim().toLowerCase() === questionLower,
    );
    if (!question || question.length < 12 || alreadyAsked) {
      const retryPrompt = `${prompt}

IMPORTANT RETRY CONSTRAINT:
- Your previous output was invalid (empty/too short/repeated).
- Generate a NEW, non-repeated question now.
- Return only the question text.`;
      const retryResult = await gemini.generateContent({
        contents: [{ role: "user", parts: [{ text: retryPrompt }] }],
        generationConfig: { temperature: 0.45 },
      });
      question = normalizeQuestionText(retryResult.response.text());
    }

    if (!question) {
      return res.status(500).json({ error: "Failed to generate valid question" });
    }

    res.json({ question });
  } catch (err) {
    console.error("Error generating question:", err.message);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

// ─── GENERATE FINAL INTERVIEW SUMMARY via Gemini ──────────────────────────────────────────────
export const generate_summary = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId)
      return res.status(400).json({ error: "Session ID required" });

    const session = await MockInterview.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    // If summary is already generated, return it
    if (session.completed && session.summary?.nextLevelEdge) {
      return res.json({ summary: session.summary });
    }

    // Compile everything for Gemini
    const transcript = session.questionsAsked
      .map(
        (q, i) =>
          "Q" +
          (i + 1) +
          ": " +
          q.question +
          "\n" +
          "A" +
          (i + 1) +
          ": " +
          q.answer +
          "\n" +
          "Feedback: " +
          JSON.stringify(q.feedback) +
          "\n",
      )
      .join("\n");

    const prompt = buildSummaryPrompt({ role: session.role, transcript });

    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.25, responseMimeType: "application/json" },
    });

    const raw = result.response.text().trim();
    const parsed = safeJsonParse(raw);
    if (!parsed.ok) {
      return res
        .status(500)
        .json({ error: "Failed to parse AI response", details: parsed.error, raw });
    }
    const data = {
      nextLevelEdge: String(parsed.data?.nextLevelEdge || "").trim(),
      refinementAreas: String(parsed.data?.refinementAreas || "").trim(),
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
