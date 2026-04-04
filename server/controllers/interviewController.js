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

  const prompt = `You are a technical interviewer for the role of "${role}".
The candidate's experience level is: ${experience}.

Question: ${question}
Candidate's Answer: ${answer}

Provide feedback appropriate for their experience level:
- If Fresher: encourage fundamentals, give learning resources.
- If Mid-Level: focus on efficiency, structure, and applied skills.
- If Senior: expect leadership, scalability, and depth in explanation.

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "score": 8,
  "feedback": "Your answer demonstrated good understanding of the concept...",
  "nextLevelEdge": "A short paragraph explaining the strongest thing the candidate can lean into next time.",
  "refinementAreas": "A short paragraph describing the most important gap or blind spot to improve.",
  "strengths": ["Clear explanation", "Relevant examples"],
  "weaknesses": ["Lacked depth on edge cases"],
  "suggestions": ["Study system design patterns", "Improve clarity on scalability topics"]
}`;

  try {
    const result = await gemini.generateContent(prompt);
    const raw = result.response.text().trim();

    let data;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Failed to parse AI response", raw });
    }

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
      });
      if (!session) {
        session = new MockInterview({
          userId,
          role,
          questionsAsked: [],
          overallScore: 0,
        });
      }
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

  try {
    let previousQuestionsStr = "None";
    if (history.length > 0) {
      previousQuestionsStr = history
        .map((h, i) => `\nQ${i + 1}: ${h.question}`)
        .join("");
    }

    let lastInteractionStr = "LAST INTERACTION: None (First question)";
    if (lastInteraction) {
      const score = lastInteraction.feedback?.score || "N/A";
      lastInteractionStr = `LAST INTERACTION:
Candidate's last answer: "${lastInteraction.answer}"
Your feedback/assessment score of last answer: ${score}/10`;
    }

    const prompt = `You are an expert technical interviewer for the role of "${role}".
The candidate has ${experience} experience level.

INTERVIEW STATE:
Current Topic: ${currentTopic}
Question number in this topic: ${questionsAskedInCurrentTopic + 1}
Previous questions asked: ${previousQuestionsStr}

${lastInteractionStr}

INSTRUCTIONS:
1. Ask exactly ONE interview question.
2. The question MUST be about the Current Topic: "${currentTopic}".
3. DO NOT repeat any of the previous questions.
4. If there is a last interaction:
   - If the candidate's last answer was weak (score < 6) or incorrect, ask a slightly simpler question or clarify fundamentals.
   - If the answer was good (score >= 6), ask a deeper or more advanced follow-up question related to the current topic.
   - If moving to a new topic (Question number in this topic is 1), ask a foundational question for "${currentTopic}".
5. Ensure the question matches their experience level (${experience}).
   - For Freshers: focus on fundamentals, definitions, and simple problem-solving.
   - For Mid-Level: focus on practical application, debugging, and moderately complex problem-solving.
   - For Senior: focus on system design, optimization, leadership, and advanced problem-solving.
6. Do not include pleasantries, greetings, or explanations.
7. Return ONLY the question string.

Generate the next question:`;

    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
      },
    });
    const question = result.response.text().trim();
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

    const prompt =
      "You are an expert career coach reviewing a candidate's mock interview performance for the role of \"" +
      session.role +
      '".\n' +
      "Here is the transcript and individual feedback for their responses:\n" +
      transcript +
      "\n\n" +
      "Based on this complete performance, generate two summary paragraphs (Return ONLY valid JSON, no markdown formatting!):\n" +
      "{\n" +
      '  "nextLevelEdge": "Write a 3-4 sentence paragraph addressing their unique strengths, how they can leverage them to stand out among other candidates in this role.",\n' +
      '  "refinementAreas": "Write a 3-4 sentence paragraph addressing an overall pattern of weakness or blind spots they demonstrated, and specific steps they should take to improve before the real interview."\n' +
      "}";

    const result = await gemini.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4 },
    });

    const raw = result.response.text().trim();
    let data;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Failed to parse AI response", raw });
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
