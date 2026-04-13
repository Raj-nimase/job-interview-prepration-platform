import axios from "axios";

const API_BASE = "http://localhost:4000";

/** Generate the next interview question. */
export async function generateQuestion(role, experience, history = [], options = {}) {
  const { interviewType = "Technical", personaStyle = "Neutral", jobDescription = null, targetCompany = null, competencyProfile = null, includeBookmarked = false } = options;
  const res = await axios.post(`${API_BASE}/interview/generate_question`, {
    role, experience, history,
    interviewType, personaStyle, jobDescription, targetCompany, competencyProfile, includeBookmarked
  });
  return res.data;
}

/** Transcribe audio via Gemini STT backend. */
export async function transcribeAudio(audioBase64, mimeType, role, question) {
  const res = await axios.post(`${API_BASE}/interview/transcribe`, { audioBase64, mimeType, role, question });
  return res.data;
}

/** Text-to-speech — returns a blob. */
export async function getTTS(text) {
  const res = await axios.post(`${API_BASE}/interview/tts`, { text }, { responseType: "blob" });
  return res.data;
}

/** Get AI feedback for a given answer. */
export async function getFeedbackAPI(userId, sessionId, role, experience, question, answer, options = {}, codeAnswer = "", language = "") {
  const { interviewType = "Technical", timeTaken = null, followUpAnswer = null, jobDescription = null, targetCompany = null } = options;
  const res = await axios.post(`${API_BASE}/interview/feedback`, {
    userId, sessionId, role, experience, question, answer, codeAnswer, language,
    interviewType, timeTaken, followUpAnswer, jobDescription, targetCompany,
  });
  return res.data;
}

/** Start a session (with new fields). */
export async function startSession(userId, role, options = {}) {
  const { interviewType = "Technical", personaStyle = "Neutral", jobDescription = "", targetCompany = "" } = options;
  const res = await axios.post(`${API_BASE}/interview/startSession`, {
    userId, role, interviewType, personaStyle, jobDescription, targetCompany,
  });
  return res.data;
}

/** Generate and fetch the final AI summary report. */
export async function getInterviewSummary(sessionId, options = {}) {
  const { earlyTermination = null, sessionExtended = false } = options;
  const res = await axios.post(`${API_BASE}/interview/summary`, { sessionId, earlyTermination, sessionExtended });
  return res.data;
}

/** Fetch full session details by ID */
export async function getSession(sessionId) {
  const res = await axios.get(`${API_BASE}/api/session/${sessionId}`);
  return res.data;
}

/** Check if a follow-up question should be triggered. */
export async function checkFollowUpAPI(sessionId, question, answer, role, experience, interviewType = "Technical") {
  const res = await axios.post(`${API_BASE}/interview/checkFollowUp`, {
    sessionId, question, answer, role, experience, interviewType,
  });
  return res.data;
}

/** Get interviewer's in-character response to a clarification question. */
export async function respondToClarificationAPI(sessionId, question, clarificationText, role, experience, personaStyle = "Neutral") {
  const res = await axios.post(`${API_BASE}/interview/respondToClarification`, {
    sessionId, question, clarificationText, role, experience, personaStyle,
  });
  return res.data;
}

/** Generate warm-up questions for the session. */
export async function generateWarmupAPI(role, experience) {
  const res = await axios.post(`${API_BASE}/interview/generateWarmup`, { role, experience });
  return res.data;
}

/** Bookmark or un-bookmark a question in a session. */
export async function bookmarkQuestionAPI(sessionId, questionIndex, bookmarked = true) {
  const res = await axios.post(`${API_BASE}/interview/bookmarkQuestion`, { sessionId, questionIndex, bookmarked });
  return res.data;
}

/** Get user competency profile (for progress tracking + adaptive difficulty). */
export async function getCompetencyProfileAPI(userId, role = null) {
  const params = { userId };
  if (role) params.role = role;
  const res = await axios.get(`${API_BASE}/interview/competencyProfile`, { params });
  return res.data;
}
