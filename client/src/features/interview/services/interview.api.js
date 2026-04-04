import axios from "axios";

const API_BASE = "http://localhost:4000";

/**
 * Generate the next interview question.
 */
export async function generateQuestion(role, experience, history = []) {
  const res = await axios.post(`${API_BASE}/interview/generate_question`, {
    role,
    experience,
    history,
  });
  return res.data;
}

/**
 * Transcribe audio via Gemini STT backend.
 */
export async function transcribeAudio(audioBase64, mimeType, role, question) {
  const res = await axios.post(`${API_BASE}/interview/transcribe`, {
    audioBase64,
    mimeType,
    role,
    question,
  });
  return res.data;
}

/**
 * Text-to-speech — returns a blob.
 */
export async function getTTS(text) {
  const res = await axios.post(
    `${API_BASE}/interview/tts`,
    { text },
    { responseType: "blob" },
  );
  return res.data;
}

/**
 * Get AI feedback for a given answer.
 */
export async function getFeedbackAPI(
  userId,
  role,
  experience,
  question,
  answer,
) {
  const res = await axios.post(`${API_BASE}/interview/feedback`, {
    userId,
    role,
    experience,
    question,
    answer,
  });
  return res.data;
}

/**
 * Create a session record in the database.
 */
export async function startSession(userId, role) {
  const res = await axios.post(`${API_BASE}/api/session/start_session`, {
    userId,
    role,
  });
  return res.data;
}

/**
 * Generate and fetch the final AI summary report for the interview.
 */
export async function getInterviewSummary(sessionId) {
  const res = await axios.post(`${API_BASE}/interview/summary`, { sessionId });
  return res.data;
}

/**
 * Fetch full session details by ID
 */
export async function getSession(sessionId) {
  const res = await axios.get(`${API_BASE}/api/session/${sessionId}`);
  return res.data;
}
