import MockInterview from "../models/MockInterview.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
if (!DEEPGRAM_API_KEY) {
  console.error("Missing DEEPGRAM_API_KEY in .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "MERN Interview Chatbot",
  },
});

export const transcribe = async (req, res) => {
  try {
    const { audioBuffer, role, question } = req.body;

    if (!audioBuffer) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    // Convert base64 string to Buffer if needed
    let audioData;
    if (typeof audioBuffer === "string") {
      audioData = Buffer.from(audioBuffer, "base64");
    } else {
      audioData = audioBuffer; // assume already a Buffer
    }

    const mimeType = "audio/webm"; // or detect based on your frontend

    // Step 1: Transcribe with Deepgram
    const url = new URL("https://api.deepgram.com/v1/listen");
    url.searchParams.set("model", "nova");
    url.searchParams.set("language", "en-US");
    url.searchParams.set("punctuate", "true");
    url.searchParams.set("smart_format", "true");

    const dgResponse = await axios.post(url.toString(), audioData, {
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": mimeType,
      },
      timeout: 120000,
    });

    const rawTranscript =
      dgResponse?.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ??
      "";

    if (!rawTranscript.trim()) {
      return res.json({ transcript: "", rawTranscript: "" });
    }

    // Step 2: Grammar & clarity correction
    const llmResponse = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: `You are a STRICT grammar and spelling corrector for interview answers.

ROLE: ${role || "General Interview Candidate"}
QUESTION: """${question || ""}"""

RULES:
- ONLY fix clear spelling mistakes or obvious grammar errors.
- If a word is slightly misspelled but matches a technical term relevant to the ROLE or QUESTION, correct it to that term.
- DO NOT add, guess, or expand with information the user did not explicitly say.
- If the sentence is already correct, return it exactly as is.
- Keep the meaning exactly the same as the original spoken words.
- If the text is very short (3 words or fewer), return it unchanged.
- DO NOT output explanations, bullet points, labels, or reasoning — return only the corrected text.`,
        },
        { role: "user", content: rawTranscript },
      ],
    });

    const finalTranscript =
      llmResponse.choices?.[0]?.message?.content?.trim() || rawTranscript;

    res.json({
      transcript: finalTranscript,
      rawTranscript,
    });
  } catch (err) {
    console.error("Transcription error:", err.response?.data ?? err.message);
    res.status(500).json({
      error: "Transcription failed",
      details: err.response?.data ?? err.message,
    });
  }
};

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
      }
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


export const feedback = async (req, res) => {
  const { userId, role, sessionId, question, answer, experience } = req.body;

  if (!userId || !role || !question || !answer || !experience) {
    return res.status(400).json({ error: "Missing fields." });
  }

  const prompt = `
You are a technical interviewer for the role of "${role}".
The candidate's experience level is: ${experience}.

Question: ${question}
Candidate's Answer: ${answer}

Provide feedback appropriate for their experience level:
- If Fresher: encourage fundamentals, give learning resources.
- If Mid-Level: focus on efficiency, structure, and applied skills.
- If Senior: expect leadership, scalability, and depth in explanation.

Format the output strictly as valid JSON only:
{
  "score": 8,
  "feedback": "Your answer demonstrated good understanding of the concept...",
  "strengths": ["Clear explanation", "Relevant examples"],
  "weaknesses": ["Lacked depth on edge cases"],
  "suggestions": ["Study system design patterns", "Improve clarity on scalability topics"]
}
`;

  // Get AI feedback
  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const raw = completion.choices[0].message.content;

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return res.status(500).json({ error: "Failed to parse AI response", raw });
  }

  if (!data) return res.status(500).json({ error: "AI feedback failed." });

  // Save to session
  let session;
  if (sessionId) {
    // Continue existing session
    session = await MockInterview.findById(sessionId);
  } else {
    // Check if an ongoing session exists for this user & role
    session = await MockInterview.findOne({
      userId,
      role,
      completed: { $ne: true },
    });
    if (!session) {
      // Create new session if none exists
      session = new MockInterview({
        userId,
        role,
        questionsAsked: [],
        overallScore: 0,
      });
    }
  }

  // Add new question
  session.questionsAsked.push({ question, answer, feedback: data });

  // Update overall score
  const totalScore = session.questionsAsked.reduce(
    (sum, q) => sum + (q.feedback?.score || 0),
    0
  );
  session.overallScore = totalScore / session.questionsAsked.length;

  await session.save();

  // Return feedback + session info to frontend
  res.json({
    ...data, // AI feedback
    sessionId: session._id,
    overallScore: session.overallScore,
  });
};

export const generate_question = async (req, res) => {
  const { role, experience } = req.body;

  if (!role || !experience) {
    return res.status(400).json({ error: "Role and experience are required" });
  }

  try {
    const prompt = `
You are an expert technical interviewer for the role of "${role}".
The candidate has ${experience} experience level.

Generate **1 interview question** that matches their experience:
- For Freshers: focus on fundamentals, definitions, and simple problem-solving.
- For Mid-Level: focus on practical application, debugging, and moderately complex problem-solving.
- For Senior: focus on system design, optimization, leadership, and advanced problem-solving.
The question should be:
- Clear, concise, and role-specific
- Not too broad or vague
- Avoid yes/no answers

Return only the question text — no numbering, no extra explanation.
    `;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const question = completion.choices[0]?.message?.content?.trim();
    res.json({ question });
  } catch (err) {
    console.error("Error generating question:", err.message);
    res.status(500).json({ error: "Failed to generate question" });
  }
};
