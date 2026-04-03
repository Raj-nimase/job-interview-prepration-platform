import axios from "axios";

const API_BASE = "http://localhost:4000";

export async function fetchQuizQuestions(topic, level = 1) {
  if (!topic) throw new Error("Missing topic");
  const res = await axios.get(`${API_BASE}/api/quiz/questions/${topic}/${level}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function submitQuizAttempt({ userId, topic, level, answers }) {
  if (!userId) throw new Error("Missing userId");
  if (!topic) throw new Error("Missing topic");
  if (!Array.isArray(answers)) throw new Error("Missing answers");

  const res = await axios.post(
    `${API_BASE}/api/quiz/submit`,
    { userId, topic, level, answers },
    { withCredentials: true }
  );
  return res.data;
}

export async function fetchUserProgress(userId, topic) {
  if (!userId) throw new Error("Missing userId");
  if (!topic) throw new Error("Missing topic");

  const res = await axios.get(`${API_BASE}/api/quiz/progress/${userId}/${topic}`, {
    withCredentials: true,
  });
  return res.data;
}
