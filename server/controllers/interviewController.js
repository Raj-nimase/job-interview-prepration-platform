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
  const { role, experience } = req.body;

  if (!role || !experience) {
    return res.status(400).json({ error: "Role and experience are required" });
  }

  try {
    const prompt = `You are an expert technical interviewer for the role of "${role}".
The candidate has ${experience} experience level.

Generate exactly 1 interview question that matches their experience:
- For Freshers: focus on fundamentals, definitions, and simple problem-solving.
- For Mid-Level: focus on practical application, debugging, and moderately complex problem-solving.
- For Senior: focus on system design, optimization, leadership, and advanced problem-solving.

The question must be:
- Clear, concise, and role-specific
- Not too broad or vague
- Not a yes/no question

Return ONLY the question text — no numbering, no extra explanation.`;

    const result = await gemini.generateContent(prompt);
    const question = result.response.text().trim();
    res.json({ question });
  } catch (err) {
    console.error("Error generating question:", err.message);
    res.status(500).json({ error: "Failed to generate question" });
  }
};
